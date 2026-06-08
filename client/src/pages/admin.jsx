import { useState, useEffect } from "react";
import './admin.css';

const COURSES = ["Mathematics", "Computer Science", "Physics", "Chemistry", "Biology", "English", "Economics"];
const TYPES   = ["PDF", "Video", "Link"];
const EMPTY_FORM = { title: "", course: COURSES[0], type: TYPES[0], link: "", keywords: "" };

const API = "http://localhost:5000";

function getUser() {
  try {
    const raw = localStorage.getItem("edureach_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getToken() {
  return localStorage.getItem("edureach_token") || "";
}

export default function Admin() {
  const [authorized, setAuthorized]     = useState(false);
  const [checking, setChecking]         = useState(true);
  const [resources, setResources]       = useState([]);
  const [loadingData, setLoadingData]   = useState(true);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formError, setFormError]       = useState("");
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState("All");
  const [apiError, setApiError]         = useState("");

  // Auth check
  useEffect(() => {
    setTimeout(() => {
      const user = getUser();
      if (!user || user.role !== "admin") { window.location.href = "/"; return; }
      setAuthorized(true);
      setChecking(false);
    }, 0);
  }, []);

  // Fetch all resources from backend
  useEffect(() => {
    if (!authorized) return;
    const load = async () => {
      setLoadingData(true);
      setApiError("");
      try {
        const res = await fetch(`${API}/api/resources`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to load resources");
        const data = await res.json();
        setResources(data.resources);
      } catch (err) {
        setApiError("Could not load resources. Make sure the backend is running.");
        setResources([]);
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [authorized]);

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                        r.course.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "All" || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const openAdd  = () => { setEditTarget(null); setForm(EMPTY_FORM); setFormError(""); setDrawerOpen(true); };
  const openEdit = (r) => {
    setEditTarget(r);
    setForm({ title: r.title, course: r.course, type: r.type, link: r.link, keywords: r.keywords || "" });
    setFormError("");
    setDrawerOpen(true);
  };
  const closeDrawer = () => { setDrawerOpen(false); setEditTarget(null); };

  // Save (Add or Edit)
  const handleSave = async () => {
    if (!form.title.trim()) { setFormError("Title is required."); return; }
    if (!form.link.trim())  { setFormError("Link is required."); return; }
    setFormError("");
    setSaving(true);
    try {
      if (editTarget) {
        const res = await fetch(`${API}/api/resources/${editTarget.id}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update");
        setResources((prev) => prev.map((r) => r.id === editTarget.id ? { ...r, ...form } : r));
      } else {
        const res = await fetch(`${API}/api/resources`, {
          method:  "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to add");
        const data = await res.json();
        setResources((prev) => [data.resource, ...prev]);
      }
      closeDrawer();
    } catch (err) {
      setFormError("Failed to save. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/resources/${deleteTarget.id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteTarget(null);
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("edureach_user");
    localStorage.removeItem("edureach_token");
    window.location.href = "/";
  };

  if (checking) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0d0f14;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'DM Sans',sans-serif;color:rgba(232,234,240,0.4);font-size:.875rem;}
      `}</style>
      <span>Verifying access…</span>
    </>
  );

  if (!authorized) return null;

  const stats = [
    { label: "Total Resources", value: resources.length },
    { label: "PDFs",   value: resources.filter(r => r.type === "PDF").length },
    { label: "Videos", value: resources.filter(r => r.type === "Video").length },
    { label: "Links",  value: resources.filter(r => r.type === "Link").length },
  ];

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="topbar-logo">Edu<span>Reach</span></a>
          <div className="topbar-sep" />
          <span className="topbar-pill">Admin</span>
          <div className="topbar-right">
            <span className="topbar-user">{getUser()?.name || "Administrator"}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="page-top">
          <div>
            <div className="page-eyebrow">Resource Management</div>
            <h1 className="page-heading">Admin Dashboard</h1>
            <p className="page-sub">Add, edit, and remove learning resources from the platform.</p>
          </div>
          <button className="btn btn-accent" onClick={openAdd}>+ Add Resource</button>
        </div>

        {apiError && (
          <div style={{
            background: "rgba(240,96,96,0.08)", border: "1px solid rgba(240,96,96,0.2)",
            borderRadius: "0.5rem", padding: "0.75rem 1rem",
            fontSize: "0.82rem", color: "#f06060", marginBottom: "1.5rem"
          }}>
            {apiError}
          </div>
        )}

        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <input className="toolbar-search" type="text" placeholder="Search by title or course…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {["All", ...TYPES].map((t) => (
            <button key={t} className={`chip${typeFilter === t ? " on" : ""}`} onClick={() => setTypeFilter(t)}>{t}</button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Course</th><th>Type</th><th>Link</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="sk" style={{ width: "65%" }} /></td>
                    <td><div className="sk" style={{ width: "50%" }} /></td>
                    <td><div className="sk" style={{ width: "40%" }} /></td>
                    <td><div className="sk" style={{ width: "55%" }} /></td>
                    <td><div className="sk" style={{ width: "45%" }} /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="tbl-empty">
                    <div className="tbl-empty-icon">📭</div>
                    <div className="tbl-empty-title">No resources found</div>
                    <p className="tbl-empty-sub">{search ? "Try a different search term." : "Add your first resource using the button above."}</p>
                  </div>
                </td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="td-title">{r.title}</td>
                    <td className="td-course">{r.course}</td>
                    <td><span className={`badge b-${r.type.toLowerCase()}`}>{r.type}</span></td>
                    <td className="td-link"><a href={r.link} target="_blank" rel="noopener noreferrer">{r.link} ↗</a></td>
                    <td>
                      <div className="td-actions">
                        <button className="act act-edit" onClick={() => openEdit(r)}>Edit</button>
                        <button className="act act-del" onClick={() => setDeleteTarget(r)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={closeDrawer} />
          <aside className="drawer">
            <div className="drawer-header">
              <div>
                <div className="drawer-title">{editTarget ? "Edit Resource" : "Add New Resource"}</div>
                <div className="drawer-sub">{editTarget ? "Update the resource details below." : "Fill in the details to add a new learning resource."}</div>
              </div>
              <button className="drawer-close" onClick={closeDrawer}>✕</button>
            </div>
            <div className="drawer-body">
              {formError && <div className="form-err">{formError}</div>}
              <div className="fg">
                <label className="fl">Resource Title</label>
                <input className="fi" type="text" placeholder="e.g. Introduction to Calculus"
                  value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="fg">
                  <label className="fl">Course</label>
                  <select className="fs" value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}>
                    {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Type</label>
                  <select className="fs" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg">
                <label className="fl">Resource Link</label>
                <input className="fi" type="url" placeholder="https://example.com/resource"
                  value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
              </div>
              <div className="fg">
                <label className="fl">Keywords <span style={{ color: "var(--muted)", fontWeight: 300 }}>(comma separated)</span></label>
                <input className="fi" type="text" placeholder="e.g. calculus, derivatives, integration"
                  value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
              </div>
            </div>
            <div className="drawer-footer">
              <button className="btn btn-ghost" onClick={closeDrawer}>Cancel</button>
              <button className="btn btn-accent" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Resource"}
              </button>
            </div>
          </aside>
        </>
      )}

      {deleteTarget && (
        <div className="del-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="del-modal">
            <div className="del-icon">🗑️</div>
            <div className="del-title">Delete this resource?</div>
            <p className="del-sub">"<strong>{deleteTarget.title}</strong>" will be permanently removed. This cannot be undone.</p>
            <div className="del-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}