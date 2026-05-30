import { useEffect, useState } from "react";
import "./NotFound.css";

export default function NotFound() {
  const [counted, setCounted] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounted((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* topbar */}
      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="topbar-logo">Edu<span>Reach</span></a>
        </div>
      </header>

      <main className="page">
        <div className="big-number">404</div>

        <div className="divider" />

        <h1 className="heading">Page not found.</h1>
        <p className="subtext">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="actions">
          <a href="/" className="btn-accent">← Back to Home</a>
          <a href="/recommendations" className="btn-ghost">Browse Resources</a>
        </div>

        {/* countdown */}
        <div className="countdown-wrap">
          <div className="countdown-bar-bg">
            <div
              className="countdown-bar-fill"
              style={{ width: `${(counted / 10) * 100}%` }}
            />
          </div>
          <p className="countdown-text">
            Redirecting in <span>{counted}s</span>
          </p>
        </div>
      </main>
    </>
  );
}