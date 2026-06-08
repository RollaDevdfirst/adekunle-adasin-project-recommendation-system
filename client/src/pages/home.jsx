import { useState, useEffect } from "react";
import "./Home.css";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Popular Resources", href: "#popular-resources" },
  { label: "About", href: "#about" },
];

const STEPS = [
  {
    step: "01",
    title: "Input Keywords",
    desc: "Enter topics from your coursework or paste keywords received from the chatbot assistant.",
  },
  {
    step: "02",
    title: "AI Matches Resources",
    desc: "Our engine maps your keywords to courses and surfaces the most relevant materials.",
  },
  {
    step: "03",
    title: "You Learn",
    desc: "Open PDFs, videos, and lecture notes instantly — login required to access full resources.",
  },
];

const PREVIEW_RESOURCES = [
  {
    title: "Introduction to Calculus - Lecture Notes",
    course: "Mathematics",
    type: "PDF",
  },
  {
    title: "Data Structures & Algorithms Overview",
    course: "Computer Science",
    type: "Video",
  },
  {
    title: "Thermodynamics Practice Problems",
    course: "Physics",
    type: "PDF",
  },
];

export default function Home() {
  const [query, setQuery]       = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  // ── Auth form state ──
  const [authForm, setAuthForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [authError, setAuthError]     = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Switch modal tab and reset form ──
  const switchModal = (type) => {
    setAuthModal(type);
    setAuthForm({ name: "", email: "", password: "", confirm: "" });
    setAuthError("");
  };

  const closeModal = () => {
    setAuthModal(null);
    setAuthForm({ name: "", email: "", password: "", confirm: "" });
    setAuthError("");
  };

  // ── Handle search ──
  const handleGetRecommendations = () => {
    if (!query.trim()) return;
    // If already logged in, go straight to recommendations
    const user = localStorage.getItem("edureach_user");
    if (user) {
      window.location.href = `/recommendations?q=${encodeURIComponent(query)}`;
    } else {
      setAuthModal("login");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleGetRecommendations();
  };

  // ── Auth submit ──
  const handleAuthSubmit = async () => {
    setAuthError("");

    // Validation
    if (!authForm.email.trim() || !authForm.password.trim()) {
      setAuthError("Email and password are required."); return;
    }
    if (authModal === "signup" && !authForm.name.trim()) {
      setAuthError("Full name is required."); return;
    }
    if (authModal === "signup" && authForm.password !== authForm.confirm) {
      setAuthError("Passwords do not match."); return;
    }
    if (authForm.password.length < 6) {
      setAuthError("Password must be at least 6 characters."); return;
    }

    setAuthLoading(true);

    try {
      const endpoint = authModal === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

      const body = authModal === "login"
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };

      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message || "Something went wrong."); return;
      }

      // Store token and user in localStorage
      localStorage.setItem("edureach_token", data.token);
      localStorage.setItem("edureach_user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        // If there was a search query, carry it to recommendations
        if (query.trim()) {
          window.location.href = `/recommendations?q=${encodeURIComponent(query)}`;
        } else {
          window.location.href = "/recommendations";
        }
      }
    } catch (err) {
      setAuthError("Could not connect to server. Make sure the backend is running.");
      console.error(err);

    } finally {
      setAuthLoading(false);
      setAuthForm({ name: "", email: "", password: "", confirm: "" });
    }
  };

  // Allow submitting with Enter key in modal
  const handleModalKey = (e) => {
    if (e.key === "Enter") handleAuthSubmit();
  };

  return (
    <>
      {/* ── Navbar ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="/" className="nav-logo">Edu<span>Reach</span></a>
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={() => switchModal("login")}>Log in</button>
            <button className="btn-accent" onClick={() => switchModal("signup")}>Sign up</button>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <div className="mobile-drawer-actions">
          <button className="btn-ghost" onClick={() => { setMenuOpen(false); switchModal("login"); }}>Log in</button>
          <button className="btn-accent" onClick={() => { setMenuOpen(false); switchModal("signup"); }}>Sign up</button>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            Connected to AI Chatbot
          </div>
          <h1 className="hero-heading">
            Find resources <em>tailored</em><br />for your studies.
          </h1>
          <p className="hero-sub">
            Enter a topic or keyword and our AI engine will match you with
            lecture notes, PDFs, videos, and practice materials aligned with your course.
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
            {["500+\nResources", "20+\nCourses", "AI\nPowered"].map((s) => {
              const [val, label] = s.split("\n");
              return (
                <div key={label} className="stat-item">
                  <div className="stat-value">{val}</div>
                  <div className="stat-label">{label}</div>
                </div>
              );
            })}
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
            <p className="how-note">Login required to access full resource library.</p>
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
              Sign in to access the full library and get personalized recommendations.
            </p>
          </div>
          <div className="resource-grid">
            {PREVIEW_RESOURCES.map((r) => (
              <div key={r.title} className="resource-card glass">
                <div className="resource-top">
                  <span className={`resource-badge badge-${r.type.toLowerCase()}`}>{r.type}</span>
                  <span className="resource-course">{r.course}</span>
                </div>
                <div className="resource-title">{r.title}</div>
                <button className="resource-cta" onClick={() => switchModal("login")}>
                  Login to view
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section" id="about" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="section-eyebrow">About</div>
          <h2 className="section-heading">Part of a larger AI-powered academic system.</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: 520, lineHeight: 1.7, fontWeight: 300 }}>
            EduReach is the resource recommendation module of a university AI chatbot platform.
            When the chatbot identifies a topic you need help with, EduReach automatically surfaces
            the most relevant learning materials for your course.
          </p>
          <div className="about-grid">
            {[
              { icon: "⚡", title: "Keyword-driven matching", desc: "Resources are matched from keywords sent directly by the AI chatbot — no manual input needed." },
              { icon: "📚", title: "Curated academic content", desc: "PDFs, lecture notes, videos, and practice materials organised by course and topic." },
              { icon: "🔒", title: "Secure access", desc: "Students log in with their university credentials to access personalised recommendations." },
              { icon: "🧠", title: "Smart recommendation engine", desc: "Resources are ranked and scored based on relevance to your course, keyword match strength, and academic level." },
            ].map((c) => (
              <div key={c.title} className="about-card glass">
                <div className="about-icon">{c.icon}</div>
                <div className="about-title">{c.title}</div>
                <p className="about-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-band">
        <h2>Ready to find what you need?</h2>
        <p>Create an account to access the full resource library and get AI-powered recommendations.</p>
        <div className="cta-actions">
          <button className="btn-accent" style={{ padding: "0.65rem 1.75rem", fontSize: "0.9rem" }} onClick={() => switchModal("signup")}>
            Create account
          </button>
          <button className="btn-ghost" style={{ padding: "0.65rem 1.75rem", fontSize: "0.9rem" }} onClick={() => switchModal("login")}>
            Log in
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">Edu<span>Reach</span></div>
          <div className="footer-copy">© {new Date().getFullYear()} EduReach · Final Year Project · AI Academic Resource Platform</div>
        </div>
      </footer>

      {/* ── Auth Modal ── */}
      {authModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className="modal-logo">Edu<span>Reach</span></div>
            <p className="modal-sub">
              {authModal === "login" ? "Welcome back. Log in to continue." : "Create your student account."}
            </p>

            {/* Tabs */}
            <div className="modal-tabs">
              <button className={`modal-tab${authModal === "login" ? " active" : ""}`} onClick={() => switchModal("login")}>Log in</button>
              <button className={`modal-tab${authModal === "signup" ? " active" : ""}`} onClick={() => switchModal("signup")}>Sign up</button>
            </div>

            {/* Name — signup only */}
            {authModal === "signup" && (
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                  value={authForm.name}
                  onChange={(e) => setAuthForm((f) => ({ ...f, name: e.target.value }))}
                  onKeyDown={handleModalKey}
                />
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@university.edu"
                value={authForm.email}
                onChange={(e) => setAuthForm((f) => ({ ...f, email: e.target.value }))}
                onKeyDown={handleModalKey}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) => setAuthForm((f) => ({ ...f, password: e.target.value }))}
                onKeyDown={handleModalKey}
              />
            </div>

            {/* Confirm password — signup only */}
            {authModal === "signup" && (
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={authForm.confirm}
                  onChange={(e) => setAuthForm((f) => ({ ...f, confirm: e.target.value }))}
                  onKeyDown={handleModalKey}
                />
              </div>
            )}

            {/* Error message */}
            {authError && (
              <p style={{
                color: "#f06060", fontSize: "0.78rem",
                marginBottom: "0.75rem", padding: "0.45rem 0.75rem",
                background: "rgba(240,96,96,0.08)",
                border: "1px solid rgba(240,96,96,0.2)",
                borderRadius: "0.5rem"
              }}>
                {authError}
              </p>
            )}

            {/* Submit */}
            <button
              className="modal-submit"
              onClick={handleAuthSubmit}
              disabled={authLoading}
              style={{ opacity: authLoading ? 0.6 : 1, cursor: authLoading ? "not-allowed" : "pointer" }}
            >
              {authLoading ? "Please wait…" : authModal === "login" ? "Log in" : "Create account"}
            </button>

            {/* Switch link */}
            <div className="modal-switch">
              {authModal === "login" ? (
                <>Don't have an account?<button onClick={() => switchModal("signup")}>Sign up</button></>
              ) : (
                <>Already have an account?<button onClick={() => switchModal("login")}>Log in</button></>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}