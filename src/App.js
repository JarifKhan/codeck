import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import MainDisplay from './components/MainDisplay/MainDisplay';
import ThumList from './components/ThumList/ThumList';
import AddThum from './components/AddThum/AddThum';
import AuthModal from './components/AuthModal/AuthModal';
import DecksModal from './components/DecksModal/DecksModal';
import { API_BASE_URL } from './config/api';

import { ReactComponent as CyanStar } from './BackgroundImages/cyan_star.svg';
import { ReactComponent as RedSpiral } from './BackgroundImages/red_spiral.svg';
import { ReactComponent as PinkZigzag } from './BackgroundImages/pink_zigzag.svg';

const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    title: 'Welcome',
    language: 'javascript',
    content: `// Welcome to Codeck!\n// Edit this slide or add more using the left panel.\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to Codeck.\`;\n}\n\nconsole.log(greet("Developer"));`,
  },
  {
    id: 'slide-2',
    title: 'Async Example',
    language: 'javascript',
    content: `// Asynchronous operations in JavaScript\nasync function fetchSnippet(id) {\n  try {\n    const response = await fetch(\`/api/snippets/\${id}\`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Error fetching:", error);\n  }\n}`,
  },
];

function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('codeck_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('codeck_token') || null);

  // Deck State
  const [deckId, setDeckId] = useState(null);
  const [deckTitle, setDeckTitle] = useState('My Code Presentation');
  const [pagesList, setPagesList] = useState(() => {
    try {
      const localPages = localStorage.getItem('codeck_pages');
      return localPages ? JSON.parse(localPages) : DEFAULT_SLIDES;
    } catch {
      return DEFAULT_SLIDES;
    }
  });
  const [activePageId, setActivePageId] = useState(() => {
    return pagesList.length > 0 ? pagesList[0].id : 'slide-1';
  });

  // Modals & UI State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDecksOpen, setIsDecksOpen] = useState(false);
  const [userDecks, setUserDecks] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [toast, setToast] = useState(null);

  // Show temporary toast message
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Check MongoDB Atlas status from server
  const checkDbStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/status`);
      if (res.ok) {
        const data = await res.json();
        setDbConnected(Boolean(data.database?.connected));
      } else {
        setDbConnected(false);
      }
    } catch {
      setDbConnected(false);
    }
  };

  useEffect(() => {
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync slides to localStorage as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem('codeck_pages', JSON.stringify(pagesList));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [pagesList]);

  // Auth Handlers
  const handleAuthSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('codeck_user', JSON.stringify(userData));
    localStorage.setItem('codeck_token', userToken);
    showToast(`Welcome back, ${userData.username}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('codeck_user');
    localStorage.removeItem('codeck_token');
    showToast('Signed out successfully', 'info');
  };

  // Deck Editing Handlers
  const handleSelectPage = (id) => {
    setActivePageId(id);
  };

  const handleAddPage = () => {
    const newId = `slide-${Date.now()}`;
    const newSlide = {
      id: newId,
      title: `Slide ${pagesList.length + 1}`,
      language: 'javascript',
      content: `// Slide ${pagesList.length + 1}\nfunction code() {\n  // Write snippet here\n}`,
    };
    setPagesList((prev) => [...prev, newSlide]);
    setActivePageId(newId);
  };

  const handleDeletePage = (idToDelete) => {
    if (pagesList.length <= 1) return;

    setPagesList((prev) => {
      const filtered = prev.filter((p) => p.id !== idToDelete);
      if (activePageId === idToDelete) {
        setActivePageId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  const handleUpdateContent = (newContent) => {
    setPagesList((prev) =>
      prev.map((page) =>
        page.id === activePageId ? { ...page, content: newContent } : page
      )
    );
  };

  const handleUpdateTitle = (newTitle) => {
    setPagesList((prev) =>
      prev.map((page) =>
        page.id === activePageId ? { ...page, title: newTitle } : page
      )
    );
  };

  const handleUpdateLanguage = (newLanguage) => {
    setPagesList((prev) =>
      prev.map((page) =>
        page.id === activePageId ? { ...page, language: newLanguage } : page
      )
    );
  };

  // Save Deck to MongoDB Atlas
  const handleSaveDeck = async () => {
    if (!user || !token) {
      setIsAuthOpen(true);
      showToast('Please sign in or register to save to MongoDB Atlas.', 'info');
      return;
    }

    setIsSaving(true);
    try {
      const method = deckId ? 'PUT' : 'POST';
      const endpoint = deckId ? `${API_BASE_URL}/api/decks/${deckId}` : `${API_BASE_URL}/api/decks`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: deckTitle,
          pages: pagesList,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save deck');
      }

      if (data.deck?._id) {
        setDeckId(data.deck._id);
      }

      showToast('Deck successfully saved to MongoDB Atlas!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast(err.message || 'Could not save deck to Atlas', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Load Decks from MongoDB Atlas
  const handleOpenDecks = async () => {
    if (!user || !token) {
      setIsAuthOpen(true);
      return;
    }

    setIsDecksOpen(true);
    setLoadingDecks(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/decks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUserDecks(data.decks || []);
      } else {
        throw new Error(data.message || 'Failed to fetch decks');
      }
    } catch (err) {
      showToast(err.message || 'Could not load decks', 'error');
    } finally {
      setLoadingDecks(false);
    }
  };

  const handleLoadDeck = (deck) => {
    setDeckId(deck._id);
    setDeckTitle(deck.title || 'Untitled Deck');
    if (deck.pages && deck.pages.length > 0) {
      setPagesList(deck.pages);
      setActivePageId(deck.pages[0].id);
    }
    showToast(`Loaded deck "${deck.title}"`, 'success');
  };

  const handleDeleteDeck = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to delete this deck from MongoDB Atlas?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/decks/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setUserDecks((prev) => prev.filter((d) => d._id !== idToDelete));
        if (deckId === idToDelete) {
          setDeckId(null);
        }
        showToast('Deck deleted from MongoDB Atlas', 'success');
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }
    } catch (err) {
      showToast(err.message || 'Could not delete deck', 'error');
    }
  };

  const handleNewDeck = () => {
    setDeckId(null);
    setDeckTitle('Untitled Deck');
    setPagesList(DEFAULT_SLIDES);
    setActivePageId(DEFAULT_SLIDES[0].id);
    showToast('Created new blank deck', 'info');
  };

  // Find active slide object and its 1-based index
  const activeIndex = pagesList.findIndex((p) => p.id === activePageId);
  const activePage = pagesList[activeIndex !== -1 ? activeIndex : 0];
  const currentSlideIndex = activeIndex !== -1 ? activeIndex + 1 : 1;

  return (
    <div>
      <Navbar
        deckTitle={deckTitle}
        onTitleChange={setDeckTitle}
        onSaveDeck={handleSaveDeck}
        onOpenDecks={handleOpenDecks}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        dbConnected={dbConnected}
        isSaving={isSaving}
      />

      <div className="wrapper">
        <div className="container">
          <div className="tumcontainer">
            <ThumList
              pages={pagesList}
              activePageId={activePageId}
              onSelectPage={handleSelectPage}
              onDeletePage={handleDeletePage}
            />
            <AddThum onAddThum={handleAddPage} />
          </div>

          <div className="main-display-wrapper">
            <MainDisplay
              activePage={activePage}
              onUpdateContent={handleUpdateContent}
              onUpdateTitle={handleUpdateTitle}
              onUpdateLanguage={handleUpdateLanguage}
              slideIndex={currentSlideIndex}
              totalSlides={pagesList.length}
            />
          </div>
        </div>

        {/* Decorative Background Graphics */}
        <div className="BackgroundImages">
          <div className="bg-shape bg-shape-1">
            <CyanStar width={120} height={120} />
          </div>
          <div className="bg-shape bg-shape-2">
            <RedSpiral width={140} height={140} />
          </div>
          <div className="bg-shape bg-shape-3">
            <PinkZigzag width={100} height={100} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <DecksModal
        isOpen={isDecksOpen}
        onClose={() => setIsDecksOpen(false)}
        decks={userDecks}
        onLoadDeck={handleLoadDeck}
        onDeleteDeck={handleDeleteDeck}
        onNewDeck={handleNewDeck}
        loading={loadingDecks}
      />

      {/* Notification Toast */}
      {toast && (
        <div className={`toast-banner toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
