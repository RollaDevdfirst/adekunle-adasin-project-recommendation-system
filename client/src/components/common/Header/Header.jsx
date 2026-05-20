
import './Header.css';
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Popular Resources", href: "#popular-resources" },
  { label: "Admin", href: "/admin" },
];

const STATS = [
  { value: "500+", label: "Resources" },
  { value: "20+", label: "Courses" },
  { value: "AI", label: "Powered" },
];

const STEPS = [
  {
    icon: "🔍",
    step: "01",
    title: "Input Keywords",
    desc: "Enter topics from your coursework or paste keywords from the chatbot assistant.",
  },
  {
    icon: "⚙️",
    step: "02",
    title: "AI Matches Resources",
    desc: "Our engine maps your keywords to courses and surfaces the most relevant materials.",
  },
  {
    icon: "📖",
    step: "03",
    title: "You Learn",
    desc: "Open PDFs, videos, and lecture notes instantly — no account required.",
  },
];

const PREVIEW_RESOURCES = [
  {
    title: "Introduction to Calculus – Lecture Notes",
    course: "Mathematics",
    type: "PDF",
    typeColor: "#c9a84c",
  },
  {
    title: "Data Structures & Algorithms Overview",
    course: "Computer Science",
    type: "Video",
    typeColor: "#4c8ec9",
  },
  {
    title: "Thermodynamics Practice Problems",
    course: "Physics",
    type: "PDF",
    typeColor: "#c9a84c",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetRecommendations = () => {
    if (!query.trim()) return;
    // Navigate to recommendations page with keywords
    window.location.href = `/recommendations?q=${encodeURIComponent(query)}`;
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleGetRecommendations();
  };

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@300;400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:   #0b1524;
          --navy2:  #111e33;
          --navy3:  #182740;
          --gold:   #c9a84c;
          --gold2:  #e3c06e;
          --cream:  #f5f0e8;
          --muted:  #8fa3bd;
          --border: rgba(201,168,76,0.18);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--navy);
          color: var(--cream);
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 400;
          line-height: 1.7;
          min-height: 100vh;
        }

        /* ── Navbar ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
          padding: 0 2rem;
        }
        .nav.scrolled {
          background: rgba(11,21,36,0.92);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 var(--border);
        }
        .nav-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--cream);
          letter-spacing: 0.04em;
          text-decoration: none;
        }
        .nav-logo span { color: var(--gold); }
        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }
        .nav-links a {
          font-size: 0.875rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--gold); }
        .nav-btn {
          background: var(--gold);
          color: var(--navy);
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 2px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .nav-btn:hover { background: var(--gold2); transform: translateY(-1px); }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--cream);
          border-radius: 2px;
          transition: all 0.2s;
        }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 8rem 2rem 5rem;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(24,39,64,0.8) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-inner {
          max-width: 1120px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--gold);
        }
        .hero-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          font-weight: 900;
          line-height: 1.07;
          color: var(--cream);
          max-width: 760px;
          margin-bottom: 1.5rem;
        }
        .hero-heading em {
          font-style: italic;
          color: var(--gold);
        }
        .hero-sub {
          font-size: 1.1rem;
          color: var(--muted);
          max-width: 520px;
          margin-bottom: 2.5rem;
          line-height: 1.75;
        }

        /* ── Search bar ── */
        .search-wrap {
          display: flex;
          align-items: center;
          background: var(--navy2);
          border: 1px solid var(--border);
          border-radius: 4px;
          max-width: 560px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-wrap:focus-within {
          border-color: rgba(201,168,76,0.45);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
        }
        .search-wrap input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          padding: 0.875rem 1.25rem;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.95rem;
          color: var(--cream);
          placeholder-color: var(--muted);
        }
        .search-wrap input::placeholder { color: var(--muted); }
        .search-btn {
          background: var(--gold);
          color: var(--navy);
          border: none;
          padding: 0.875rem 1.5rem;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
          letter-spacing: 0.03em;
        }
        .search-btn:hover { background: var(--gold2); }

        /* ── Stats strip ── */
        .stats {
          display: flex;
          gap: 2.5rem;
          margin-top: 3rem;
        }
        .stat-item {}
        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--gold);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 0.2rem;
        }
        .stat-divider {
          width: 1px;
          background: var(--border);
          align-self: stretch;
        }

        /* ── Sections shared ── */
        .section {
          padding: 6rem 2rem;
        }
        .section-inner {
          max-width: 1120px;
          margin: 0 auto;
        }
        .section-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .section-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.75rem);
          font-weight: 700;
          color: var(--cream);
          max-width: 560px;
          line-height: 1.2;
          margin-bottom: 3.5rem;
        }

        /* ── How it works ── */
        .how-it-works {
          background: var(--navy2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .how-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .how-note {
          font-size: 0.875rem;
          color: var(--muted);
          max-width: 240px;
          text-align: right;
          line-height: 1.5;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .step-card {
          background: var(--navy2);
          padding: 2.5rem 2rem;
          position: relative;
          transition: background 0.2s;
        }
        .step-card:hover { background: var(--navy3); }
        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          color: rgba(201,168,76,0.12);
          line-height: 1;
          margin-bottom: 1rem;
          user-select: none;
        }
        .step-label {
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--cream);
          margin-bottom: 0.75rem;
        }
        .step-desc {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.65;
        }

        /* ── Popular resources ── */
        .resources-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .resources-note {
          font-size: 0.875rem;
          color: var(--muted);
          max-width: 280px;
          text-align: right;
          line-height: 1.6;
        }
        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .resource-card {
          background: var(--navy2);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .resource-card:hover {
          border-color: rgba(201,168,76,0.4);
          transform: translateY(-3px);
        }
        .resource-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .resource-badge {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 2px;
        }
        .badge-pdf  { background: rgba(201,168,76,0.15); color: var(--gold); }
        .badge-video { background: rgba(76,142,201,0.15); color: #7ab4e0; }
        .badge-link { background: rgba(76,201,140,0.15); color: #7ae0b0; }
        .resource-course {
          font-size: 0.75rem;
          color: var(--muted);
          letter-spacing: 0.05em;
        }
        .resource-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--cream);
          line-height: 1.35;
          flex: 1;
        }
        .resource-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gold);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: gap 0.2s;
        }
        .resource-link:hover { gap: 0.65rem; }
        .resource-link::after { content: '→'; }

        /* ── CTA Band ── */
        .cta-band {
          padding: 5rem 2rem;
          background: var(--navy2);
          border-top: 1px solid var(--border);
          text-align: center;
        }
        .cta-band h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          color: var(--cream);
          margin-bottom: 1rem;
        }
        .cta-band p {
          color: var(--muted);
          font-size: 1rem;
          margin-bottom: 2rem;
        }
        .cta-gold {
          display: inline-block;
          background: var(--gold);
          color: var(--navy);
          padding: 0.85rem 2.25rem;
          border-radius: 2px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: background 0.2s, transform 0.15s;
          border: none;
          cursor: pointer;
          font-family: 'Source Sans 3', sans-serif;
        }
        .cta-gold:hover { background: var(--gold2); transform: translateY(-2px); }

        /* ── Footer ── */
        .footer {
          padding: 2.5rem 2rem;
          border-top: 1px solid var(--border);
        }
        .footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--cream);
          letter-spacing: 0.04em;
        }
        .footer-logo span { color: var(--gold); }
        .footer-copy {
          font-size: 0.8rem;
          color: var(--muted);
        }

        /* ── Mobile nav drawer ── */
        .mobile-drawer {
          display: none;
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: var(--navy2);
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 2rem;
          z-index: 99;
          flex-direction: column;
          gap: 1.25rem;
        }
        .mobile-drawer.open { display: flex; }
        .mobile-drawer a {
          font-size: 1rem;
          color: var(--muted);
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .mobile-drawer a:hover { color: var(--gold); }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .nav-links, .nav-btn { display: none; }
          .hamburger { display: flex; }
          .stats { gap: 1.5rem; }
          .stat-divider { display: none; }
          .how-note, .resources-note { text-align: left; }
          .how-header, .resources-header { flex-direction: column; align-items: flex-start; }
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="/" className="nav-logo">Edu<span>Reach</span></a>
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <a href="/admin" className="nav-btn">Admin Panel</a>
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
      </div>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">EduReach · Academic Resource Platform</div>
          <h1 className="hero-heading">
            Find resources <em>tailored</em><br />for your studies.
          </h1>
          <p className="hero-sub">
            Enter a topic or keyword and our AI engine will match you with
            lecture notes, PDFs, videos, and practice materials aligned with
            your course.
          </p>

          <div className="search-wrap">
            <input
              type="text"
              placeholder="e.g. calculus, thermodynamics, data structures…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              aria-label="Search keywords"
            />
            <button className="search-btn" onClick={handleGetRecommendations}>
              Get Recommendations
            </button>
          </div>

          <div className="stats">
            {STATS.map((s, i) => (
              <>
                {i > 0 && <div key={`d-${i}`} className="stat-divider" />}
                <div key={s.label} className="stat-item">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section how-it-works" id="how-it-works">
        <div className="section-inner">
          <div className="how-header">
            <div>
              <div className="section-eyebrow">How it works</div>
              <h2 className="section-heading" style={{ marginBottom: 0 }}>
                Simple steps to reach your next study goal.
              </h2>
            </div>
            <p className="how-note">No account required. Just search and learn.</p>
          </div>

          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-number">{s.step}</div>
                <div className="step-label">Step {s.step}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Resources ── */}
      <section className="section" id="popular-resources">
        <div className="section-inner">
          <div className="resources-header">
            <div>
              <div className="section-eyebrow">Popular Resources</div>
              <h2 className="section-heading" style={{ marginBottom: 0 }}>
                High-impact study materials for immediate review.
              </h2>
            </div>
            <p className="resources-note">
              Browse the most recommended materials, curated from your fellow
              students' most-accessed resources.
            </p>
          </div>

          <div className="resource-grid">
            {PREVIEW_RESOURCES.map((r) => (
              <div key={r.title} className="resource-card">
                <div className="resource-top">
                  <span
                    className={`resource-badge badge-${r.type.toLowerCase()}`}
                  >
                    {r.type}
                  </span>
                  <span className="resource-course">{r.course}</span>
                </div>
                <div className="resource-title">{r.title}</div>
                <a href="/recommendations" className="resource-link">
                  Open resource
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="cta-band">
        <h2>Ready to find what you need?</h2>
        <p>
          Let the recommendation engine do the work. Enter any keyword and
          discover curated academic materials in seconds.
        </p>
        <button className="cta-gold" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Start Searching ↑
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">Edu<span>Reach</span></div>
          <div className="footer-copy">
            © {new Date().getFullYear()} EduReach · Final Year Project · Academic Resource Platform
          </div>
        </div>
      </footer>
    </>
  
  );
}
