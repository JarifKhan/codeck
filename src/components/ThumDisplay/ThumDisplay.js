import React from 'react';
import './ThumDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function ThumDisplay({
  page,
  index,
  isActive,
  onSelect,
  onDelete,
  canDelete,
}) {
  const content = page?.content || '// empty slide';
  const title = page?.title || `Slide ${index + 1}`;

  return (
    <div className="areatd">
      <div
        className={`innerareatd ${isActive ? 'active' : ''}`}
        onClick={onSelect}
        title={`Click to view Slide ${index + 1}`}
      >
        <div className="thum-topbar">
          <span className="thum-index-badge">#{index + 1}</span>
          <span className="thum-title">{title}</span>
          {canDelete && (
            <button
              className="thum-delete-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(page.id);
              }}
              title="Delete slide"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <div className="thum-preview">{content}</div>
      </div>
    </div>
  );
}

export default ThumDisplay;