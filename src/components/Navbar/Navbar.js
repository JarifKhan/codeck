import React from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faCloudArrowUp,
  faFolderOpen,
  faUser,
  faRightFromBracket,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';

function Navbar({
  deckTitle,
  onTitleChange,
  onSaveDeck,
  onOpenDecks,
  onOpenAuth,
  user,
  onLogout,
  dbConnected,
  isSaving,
}) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <FontAwesomeIcon icon={faCode} />
          <span>CODECK</span>
        </div>
        <div
          className={`db-pill ${dbConnected ? 'connected' : 'disconnected'}`}
          title={
            dbConnected
              ? 'Connected to MongoDB Atlas'
              : 'MongoDB Atlas not connected (Operating in local/guest mode)'
          }
        >
          <FontAwesomeIcon icon={faDatabase} />
          <span>{dbConnected ? 'Atlas Connected' : 'Local Mode'}</span>
        </div>
      </div>

      <div className="navbar-deck-info">
        <input
          type="text"
          className="deck-title-input"
          value={deckTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Deck Title..."
          title="Click to rename deck"
        />
      </div>

      <div className="navbar-actions">
        <button
          className="nav-btn save-btn"
          onClick={onSaveDeck}
          disabled={isSaving}
          title="Save deck to MongoDB Atlas"
        >
          <FontAwesomeIcon icon={faCloudArrowUp} />
          <span>{isSaving ? 'Saving...' : 'Save Deck'}</span>
        </button>

        {user && (
          <button
            className="nav-btn decks-btn"
            onClick={onOpenDecks}
            title="View your saved decks"
          >
            <FontAwesomeIcon icon={faFolderOpen} />
            <span>My Decks</span>
          </button>
        )}

        {user ? (
          <div className="user-badge">
            <FontAwesomeIcon icon={faUser} />
            <span>{user.username}</span>
            <button
              className="logout-btn"
              onClick={onLogout}
              title="Sign Out"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </div>
        ) : (
          <button className="nav-btn auth-btn" onClick={onOpenAuth}>
            <FontAwesomeIcon icon={faUser} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
