const db = require("../config/db");
const { matchResources } = require("../utils/keywordMatcher");

// ── POST /recommend ──
// Accepts keywords from chatbot or frontend search
// Returns matched resources sorted by relevance
exports.recommend = async (req, res) => {
  const { user_id, keywords } = req.body;

  // Validate input
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    return res.status(400).json({
      message: "keywords must be a non-empty array of strings.",
    });
  }

  // Sanitize keywords — remove empties, limit to 20
  const cleanKeywords = keywords
    .map((k) => String(k).trim())
    .filter((k) => k.length > 0)
    .slice(0, 20);

  if (cleanKeywords.length === 0) {
    return res.status(400).json({ message: "No valid keywords provided." });
  }

  try {
    // Fetch all resources from DB
    const [allResources] = await db.query(
      "SELECT id, title, course, type, link, keywords FROM resources",
    );

    // Run keyword matching engine
    const matched = matchResources(cleanKeywords, allResources, 10);

    // Log recommendations if user_id provided
    if (user_id && matched.length > 0) {
      const logValues = matched.map((r) => [user_id, r.id]);
      await db
        .query("INSERT INTO recommendations (user_id, resource_id) VALUES ?", [
          logValues,
        ])
        .catch(() => {}); // non-blocking — don't fail if logging fails
    }

    return res.status(200).json({
      keywords: cleanKeywords,
      count: matched.length,
      recommendations: matched.map((r) => ({
        title: r.title,
        type: r.type,
        link: r.link,
        course: r.course,
      })),
    });
  } catch (err) {
    console.error("Recommend error:", err);
    return res
      .status(500)
      .json({ message: "Failed to generate recommendations." });
  }
};
