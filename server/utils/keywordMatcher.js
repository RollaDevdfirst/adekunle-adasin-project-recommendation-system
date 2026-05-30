/**
 * keywordMatcher.js
 * Rule-based keyword → resource matching engine.
 * Scores each resource against the input keywords
 * and returns results sorted by relevance.
 */

// Course keyword map — expands single keywords to related course terms
const COURSE_MAP = {
  // Mathematics
  calculus: "Mathematics",
  derivatives: "Mathematics",
  integration: "Mathematics",
  limits: "Mathematics",
  algebra: "Mathematics",
  geometry: "Mathematics",
  trigonometry: "Mathematics",
  statistics: "Mathematics",
  probability: "Mathematics",
  mathematics: "Mathematics",
  maths: "Mathematics",
  math: "Mathematics",

  // Computer Science
  algorithm: "Computer Science",
  algorithms: "Computer Science",
  "data structures": "Computer Science",
  sorting: "Computer Science",
  arrays: "Computer Science",
  programming: "Computer Science",
  python: "Computer Science",
  javascript: "Computer Science",
  coding: "Computer Science",
  "computer science": "Computer Science",
  software: "Computer Science",
  database: "Computer Science",
  networking: "Computer Science",

  // Physics
  physics: "Physics",
  thermodynamics: "Physics",
  mechanics: "Physics",
  newton: "Physics",
  force: "Physics",
  energy: "Physics",
  motion: "Physics",
  optics: "Physics",
  electricity: "Physics",
  magnetism: "Physics",

  // Chemistry
  chemistry: "Chemistry",
  organic: "Chemistry",
  molecules: "Chemistry",
  bonds: "Chemistry",
  reactions: "Chemistry",
  elements: "Chemistry",
  periodic: "Chemistry",

  // Biology
  biology: "Biology",
  cells: "Biology",
  genetics: "Biology",
  evolution: "Biology",
  ecology: "Biology",
  anatomy: "Biology",

  // Economics
  economics: "Economics",
  microeconomics: "Economics",
  macroeconomics: "Economics",
  supply: "Economics",
  demand: "Economics",
  market: "Economics",
  inflation: "Economics",
  gdp: "Economics",

  // English
  english: "English",
  essay: "English",
  grammar: "English",
  literature: "English",
  writing: "English",
};

/**
 * Score a single resource against input keywords.
 * Higher score = more relevant.
 */
function scoreResource(resource, inputKeywords) {
  let score = 0;
  const resourceKeywords = (resource.keywords || "")
    .toLowerCase()
    .split(",")
    .map((k) => k.trim());
  const resourceTitle = resource.title.toLowerCase();
  const resourceCourse = resource.course.toLowerCase();

  for (const keyword of inputKeywords) {
    const kw = keyword.toLowerCase().trim();
    if (!kw) continue;

    // Exact match in resource keywords list → high score
    if (resourceKeywords.includes(kw)) score += 10;

    // Partial match in resource keywords → medium score
    if (resourceKeywords.some((rk) => rk.includes(kw) || kw.includes(rk)))
      score += 5;

    // Match in title → medium score
    if (resourceTitle.includes(kw)) score += 6;

    // Match in course name → lower score
    if (resourceCourse.includes(kw)) score += 4;

    // Course map match → boost if keyword maps to this resource's course
    const mappedCourse = COURSE_MAP[kw];
    if (mappedCourse && mappedCourse === resource.course) score += 8;
  }

  return score;
}

/**
 * Main matcher function.
 * @param {string[]} keywords - array of keyword strings
 * @param {object[]} resources - all resources from DB
 * @param {number}   limit     - max results to return (default 10)
 * @returns {object[]} sorted, scored resources
 */
function matchResources(keywords, resources, limit = 10) {
  if (!keywords || keywords.length === 0) return [];

  const scored = resources
    .map((resource) => ({
      ...resource,
      _score: scoreResource(resource, keywords),
    }))
    .filter((r) => r._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...resource }) => resource); // remove internal score from output

  return scored;
}

module.exports = { matchResources, COURSE_MAP };
