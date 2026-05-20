import React from 'react';
import './ResourceCard.css';

export default function ResourceCard({ resource }) {
  const { title, subject, type, rating, downloads, description, image } = resource;

  return (
    <div className="resource-card">
      <div className="card-header">
        <div className="card-icon">{image}</div>
        <span className="card-badge">{type}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-subject">{subject}</p>
        <p className="card-description">{description}</p>
      </div>

      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Rating</span>
          <span className="meta-value">
            ⭐ {rating}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Downloads</span>
          <span className="meta-value">{downloads.toLocaleString()}</span>
        </div>
      </div>

      <div className="card-footer">
        <button className="card-btn btn-primary">View Resource</button>
        <button className="card-btn btn-secondary">Save</button>
      </div>
    </div>
  );
}
