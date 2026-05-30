const db = require("../config/db");

// ── GET all resources ──
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM resources ORDER BY created_at DESC",
    );
    return res.status(200).json({ resources: rows });
  } catch (err) {
    console.error("Get resources error:", err);
    return res.status(500).json({ message: "Failed to fetch resources." });
  }
};

// ── GET single resource ──
exports.getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM resources WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Resource not found." });
    }
    return res.status(200).json({ resource: rows[0] });
  } catch (err) {
    console.error("Get resource error:", err);
    return res.status(500).json({ message: "Failed to fetch resource." });
  }
};

// ── POST add resource ──
exports.create = async (req, res) => {
  const { title, course, type, link, keywords } = req.body;

  if (!title || !course || !type || !link) {
    return res
      .status(400)
      .json({ message: "Title, course, type and link are required." });
  }

  const validTypes = ["PDF", "Video", "Link"];
  if (!validTypes.includes(type)) {
    return res
      .status(400)
      .json({ message: "Type must be PDF, Video, or Link." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO resources (title, course, type, link, keywords) VALUES (?, ?, ?, ?, ?)",
      [title, course, type, link, keywords || null],
    );
    return res.status(201).json({
      message: "Resource added successfully.",
      resource: { id: result.insertId, title, course, type, link, keywords },
    });
  } catch (err) {
    console.error("Create resource error:", err);
    return res.status(500).json({ message: "Failed to add resource." });
  }
};

// ── PUT update resource ──
exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, course, type, link, keywords } = req.body;

  if (!title || !course || !type || !link) {
    return res
      .status(400)
      .json({ message: "Title, course, type and link are required." });
  }

  try {
    const [result] = await db.query(
      "UPDATE resources SET title=?, course=?, type=?, link=?, keywords=? WHERE id=?",
      [title, course, type, link, keywords || null, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Resource not found." });
    }
    return res.status(200).json({ message: "Resource updated successfully." });
  } catch (err) {
    console.error("Update resource error:", err);
    return res.status(500).json({ message: "Failed to update resource." });
  }
};

// ── DELETE resource ──
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM resources WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Resource not found." });
    }
    return res.status(200).json({ message: "Resource deleted successfully." });
  } catch (err) {
    console.error("Delete resource error:", err);
    return res.status(500).json({ message: "Failed to delete resource." });
  }
};
