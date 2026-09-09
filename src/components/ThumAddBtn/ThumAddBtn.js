import React from 'react';
import './ThumAddBtn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function ThumAddBtn({ onClick }) {
  return (
    <div className="areatdb">
      <button
        className="innerareatdb"
        type="button"
        onClick={onClick}
        title="Add a new slide to the deck"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>Add Slide</span>
      </button>
    </div>
  );
}

export default ThumAddBtn;