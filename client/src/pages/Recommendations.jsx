import { useState, useEffect, useCallback } from "react";
import "./Recommendations.css";

// ── Sample fallback data (replace with real API response) ──
const MOCK_RESULTS = [
  { id: 1, title: "Introduction to Calculus – Lecture Notes", type: "PDF", course: "Mathematics", link: "https://example.com/calculus-notes.pdf" },
  { id: 2, title: "Limits and Continuity – Video Series", type: "Video", course: "Mathematics", link: "https://example.com/limits-video" },
  { id: 3, title: "Data Structures & Algorithms Overview", type: "PDF", course: "Computer Science", link: "https://example.com/dsa.pdf" },
  { id: 4, title: "Sorting Algorithms Visualised", type: "Video", course: "Computer Science", link: "https://example.com/sorting" },
  { id: 5, title: "Thermodynamics Practice Problems", type: "PDF", course: "Physics", link: "https://example.com/thermo.pdf" },
  { id: 6, title: "Newton's Laws – Lecture Slides", type: "Link", course: "Physics", link: "https://example.com/newton" },
];

const COURSES = ["All Courses", "Mathematics", "Computer Science", "Physics", "Chemistry", "Biology"];
const TYPES   = ["All Types", "PDF", "Video", "Link"];

const TYPE_ICON = { PDF: "📄", Video: "🎬", Link: "🔗" };

function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel-line skel-short" />
      <div className="skel-line skel-long" />
      <div className="skel-line skel-med" />
      <div className="skel-footer" />
    </div>
  );
}

export default function Recommendations() {
  const [query, setQuery]           = useState("");
  const [inputVal, setInputVal]     = useState("");
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [courseFilter, setCourse]   = useState("All Courses");
  const [typeFilter, setType]       = useState("All Types");
  const [searched, setSearched]     = useState(false);

  // Read ?q= from URL on mount
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("q") || "";
  if (searchQuery) {
    setTimeout(() => {
      setInputVal(searchQuery);
      setQuery(searchQuery);
    }, 0);
  }
}, []);


  const fetchRecommendations = useCallback(async () => {
    setTimeout(() => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setType("All Types");
  }, 0);

    try {
    //   ── Real API call (uncomment when backend is ready) ── (keywords)
      // const res = await fetch("/recommend", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ user_id: 1, keywords: keywords.split(",").map(k => k.trim()) }),
      // });
      // if (!res.ok) throw new Error("Failed to fetch recommendations");
      // const data = await res.json();
      // setResults(data.recommendations);

      // ── Mock delay for now ──
      await new Promise((r) => setTimeout(r, 1400));
      setResults(MOCK_RESULTS);
    } catch (err) {
      setError("Could not load recommendations. Please try again.");
      setResults([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recommendations when query changes
  useEffect(() => {
  if (!query.trim()) return;
  
  const run = async () => {
    await fetchRecommendations(query);
  };
  
  run();
}, [query, fetchRecommendations]);

  const handleSearch = () => {
    if (!inputVal.trim()) return;
    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(inputVal)}`;
    window.history.pushState({}, "", newUrl);
    setQuery(inputVal);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(); };

  // Filtered results
  const filtered = results.filter((r) => {
    const byCourse = courseFilter === "All Courses" || r.course === courseFilter;
    const byType   = typeFilter   === "All Types"   || r.type   === typeFilter;
    return byCourse && byType;
  });

  return (
    <>
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="topbar-logo">Edu<span>Reach</span></a>
          <div className="topbar-divider" />
          <div className="topbar-search">
            <input
              type="text"
              placeholder="Search keywords, topics, courses…"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKey}
              aria-label="Search recommendations"
            />
            <button className="topbar-search-btn" onClick={handleSearch}>Search</button>
          </div>
          <a href="/" className="topbar-back">← Home</a>
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="page">

        {/* Header */}
        <div className="page-header">
          {searched && !loading ? (
            <>
              <div className="page-eyebrow">Recommendations</div>
              <h1 className="page-heading">
                Results for <span>"{query}"</span>
              </h1>
              <p className="page-meta">
                {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
                {courseFilter !== "All Courses" ? ` · ${courseFilter}` : ""}
                {typeFilter !== "All Types" ? ` · ${typeFilter}` : ""}
              </p>
            </>
          ) : searched && loading ? (
            <>
              <div className="page-eyebrow">Recommendations</div>
              <h1 className="page-heading">Finding resources…</h1>
              <p className="page-meta">Matching keywords to your course materials</p>
            </>
          ) : (
            <>
              <div className="page-eyebrow">Recommendations</div>
              <h1 className="page-heading">Find your learning resources</h1>
              <p className="page-meta">Enter a keyword above to get started</p>
            </>
          )}
        </div>

        {/* Filters — only show when results exist */}
        {searched && !loading && results.length > 0 && (
          <div className="filters">
            <span className="filter-label">Filter</span>
            <div className="filter-divider" />

            <div className="filter-group">
              {TYPES.map((t) => (
                <button
                  key={t}
                  className={`filter-chip${typeFilter === t ? " active" : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="filter-divider" />

            <div className="filter-group">
              {COURSES.map((c) => (
                <button
                  key={c}
                  className={`filter-chip${courseFilter === c ? " active" : ""}`}
                  onClick={() => setCourse(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <span className="filter-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        )}

        {/* ── Content area ── */}
        {!searched ? (
          // No search yet
          <div className="prompt-box">
            <div className="prompt-icon">🔍</div>
            <div className="prompt-title">Search for a topic</div>
            <p className="prompt-sub">
              Type a keyword or topic in the search bar above — or come here from
              the chatbot with keywords pre-loaded.
            </p>
          </div>

        ) : loading ? (
          // Skeleton loading
          <div className="results-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>

        ) : error ? (
          // Error state
          <div className="results-grid">
            <div className="state-box">
              <div className="state-icon">⚠️</div>
              <div className="state-title">Something went wrong</div>
              <p className="state-sub">{error}</p>
              <button className="state-btn" onClick={() => fetchRecommendations(query)}>Try again</button>
            </div>
          </div>

        ) : filtered.length === 0 ? (
          // No results after filter
          <div className="results-grid">
            <div className="state-box">
              <div className="state-icon">📭</div>
              <div className="state-title">No results match your filters</div>
              <p className="state-sub">Try adjusting the course or type filter above.</p>
              <button className="state-btn" onClick={() => { setCourse("All Courses"); setType("All Types"); }}>
                Clear filters
              </button>
            </div>
          </div>

        ) : (
          // Results grid
          <div className="results-grid">
            {filtered.map((r, i) => (
              <div
                key={r.id}
                className="res-card"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="res-top">
                  <span className={`res-badge badge-${r.type.toLowerCase()}`}>
                    {TYPE_ICON[r.type]} {r.type}
                  </span>
                  <span className="res-course">{r.course}</span>
                </div>
                <div className="res-title">{r.title}</div>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="res-open"
                >
                  Open resource
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}