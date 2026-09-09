import React from 'react';
import './DecksModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrash, faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons';

function DecksModal({
  isOpen,
  onClose,
  decks,
  onLoadDeck,
  onDeleteDeck,
  onNewDeck,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="decks-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">My Saved Decks</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {loading ? (
          <div className="decks-empty">Loading your decks from MongoDB Atlas...</div>
        ) : decks.length === 0 ? (
          <div className="decks-empty">
            No saved decks found in MongoDB Atlas. Click "Save Deck" to save your current deck!
          </div>
        ) : (
          <div className="decks-list">
            {decks.map((deck) => (
              <div key={deck._id} className="deck-item">
                <div
                  className="deck-item-info"
                  onClick={() => {
                    onLoadDeck(deck);
                    onClose();
                  }}
                >
                  <div className="deck-item-title">{deck.title || 'Untitled Deck'}</div>
                  <div className="deck-item-meta">
                    {deck.pages?.length || 0} slide{deck.pages?.length === 1 ? '' : 's'} • Last updated{' '}
                    {new Date(deck.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="deck-item-actions">
                  <button
                    className="deck-action-btn deck-load-btn"
                    onClick={() => {
                      onLoadDeck(deck);
                      onClose();
                    }}
                    title="Load this deck"
                  >
                    <FontAwesomeIcon icon={faFolderOpen} /> Load
                  </button>
                  <button
                    className="deck-action-btn deck-delete-btn"
                    onClick={() => onDeleteDeck(deck._id)}
                    title="Delete this deck"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="new-deck-btn"
          type="button"
          onClick={() => {
            onNewDeck();
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Create New Blank Deck
        </button>
      </div>
    </div>
  );
}

export default DecksModal;
