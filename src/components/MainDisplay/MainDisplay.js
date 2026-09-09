import React, { useState, useRef, useEffect } from 'react';
import './MainDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faMinus,
  faUpRightAndDownLeftFromCenter,
  faCompress,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

function MainDisplay({
  activePage,
  onUpdateContent,
  onUpdateTitle,
  onUpdateLanguage,
  slideIndex,
  totalSlides,
}) {
  const [copied, setCopied] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const content = activePage ? activePage.content : '';
  const title = activePage ? activePage.title || `Slide ${slideIndex}` : `Slide ${slideIndex}`;
  const language = activePage ? activePage.language || 'javascript' : 'javascript';

  // Calculate line numbers
  const lines = (content || '').split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll between textarea and line gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab key for proper code indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  ';

      const updated = content.substring(0, start) + spaces + content.substring(end);
      onUpdateContent(updated);

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  // Copy to clipboard with visual feedback
  const handleCopy = async () => {
    if (!content) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback for non-secure contexts
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = content;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Red button: clear slide content
  const handleClear = () => {
    if (window.confirm('Clear all code in this slide?')) {
      onUpdateContent('');
    }
  };

  // Yellow button: reset slide to starter template
  const handleReset = () => {
    const starterSnippet = `// Slide ${slideIndex} - Codeck Snippet\nfunction demo() {\n  const message = "Hello from Codeck!";\n  console.log(message);\n  return message;\n}\n\ndemo();`;
    onUpdateContent(starterSnippet);
  };

  // Listen for Escape key to exit fullscreen/maximized mode
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' && maximized) {
        setMaximized(false);
      }
    };

    if (maximized) {
      window.addEventListener('keydown', handleGlobalKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [maximized]);

  // Green button: toggle maximize
  const handleToggleMaximize = () => {
    setMaximized((prev) => !prev);
  };

  return (
    <>
      {maximized && (
        <div
          className="fullscreen-backdrop"
          onClick={() => setMaximized(false)}
          title="Click to exit fullscreen"
        />
      )}
      <div className="area">
        <div className={`innerarea ${maximized ? 'maximized' : ''}`}>
          <div className="window-topbar">
            <div className="window-meta">
              <span className="slide-badge">
                Slide {slideIndex} of {totalSlides}
              </span>
              <input
                type="text"
                className="slide-title-input"
                value={title}
                onChange={(e) => onUpdateTitle && onUpdateTitle(e.target.value)}
                placeholder="Slide title..."
                title="Click to rename slide"
              />
              <select
                className="language-select"
                value={language}
                onChange={(e) => onUpdateLanguage && onUpdateLanguage(e.target.value)}
                title="Select programming language"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="sql">SQL</option>
                <option value="markdown">Markdown</option>
                <option value="text">Plain Text</option>
              </select>
            </div>

            <div className="btn">
              <button
                className="redbtn"
                type="button"
                onClick={handleClear}
                title="Clear slide content"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <button
                className="yellowbtn"
                type="button"
                onClick={maximized ? () => setMaximized(false) : handleReset}
                title={maximized ? 'Minimize window' : 'Reset to template'}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <button
                className="greenbtn"
                type="button"
                onClick={handleToggleMaximize}
                title={maximized ? 'Minimize / Restore window size (Esc)' : 'Expand / Fullscreen'}
              >
                <FontAwesomeIcon
                  icon={maximized ? faCompress : faUpRightAndDownLeftFromCenter}
                />
              </button>
            </div>
          </div>

        <div className="textHolder">
          <div className="editor-wrapper">
            <div className="line-gutter" ref={gutterRef}>
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i + 1} className="gutter-number">
                  {i + 1}
                </span>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="code-textarea"
              value={content}
              onChange={(e) => onUpdateContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              placeholder="// Type or paste your code here..."
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>

          <div className="side-actions">
            <div className="cbtncontainer">
              <button
                className={`copybtn ${copied ? 'copied' : ''}`}
                type="button"
                onClick={handleCopy}
                title={copied ? 'Copied to clipboard!' : 'Copy slide code'}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              </button>
              <span className="copy-label">{copied ? 'copied!' : 'copy'}</span>
            </div>
            <div className="char-counter">
              {content.length} chars<br />
              {lineCount} lines
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
}

export default MainDisplay;