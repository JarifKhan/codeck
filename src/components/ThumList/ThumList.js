import React from 'react';
import ThumDisplay from '../ThumDisplay/ThumDisplay';

function ThumList({ pages, activePageId, onSelectPage, onDeletePage }) {
  const canDelete = pages.length > 1;

  return (
    <div className="thum-list-container">
      {pages.map((page, index) => (
        <ThumDisplay
          key={page.id}
          page={page}
          index={index}
          isActive={page.id === activePageId}
          onSelect={() => onSelectPage(page.id)}
          onDelete={onDeletePage}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

export default ThumList;