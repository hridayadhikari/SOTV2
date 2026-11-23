import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { SearchModal } from './components/SearchModal';
import { AdminCMSModal } from './components/AdminCMSModal';

import { HomeView } from './views/HomeView';
import { GalleryView } from './views/GalleryView';
import { EventsView } from './views/EventsView';
import { PhotowalksView } from './views/PhotowalksView';
import { MagazineView } from './views/MagazineView';
import { CollaborationsView } from './views/CollaborationsView';
import { AboutView } from './views/AboutView';
import { PressView } from './views/PressView';
import { ContactView } from './views/ContactView';
import { JoinView } from './views/JoinView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    if (currentPath === '/') {
      return <HomeView onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/gallery/stories')) {
      const parts = currentPath.split('/gallery/stories/').filter(Boolean);
      const slug = parts[0] || undefined;
      return <GalleryView initialTab="stories" storySlug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/gallery')) {
      return <GalleryView initialTab="photos" onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/stories')) {
      const parts = currentPath.split('/stories/').filter(Boolean);
      const slug = parts[0] || undefined;
      return <GalleryView initialTab="stories" storySlug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/events')) {
      const parts = currentPath.split('/events/').filter(Boolean);
      const slug = parts[0] || undefined;
      return <EventsView slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/photowalks')) {
      const parts = currentPath.split('/photowalks/').filter(Boolean);
      const slug = parts[0] || undefined;
      return <PhotowalksView slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/magazine')) {
      const parts = currentPath.split('/magazine/').filter(Boolean);
      const id = parts[0] || undefined;
      return <MagazineView id={id} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/collaborations')) {
      const parts = currentPath.split('/collaborations/').filter(Boolean);
      const slug = parts[0] || undefined;
      return <CollaborationsView slug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/about' || currentPath === '/team') {
      return <AboutView />;
    }

    if (currentPath === '/press') {
      return <PressView />;
    }

    if (currentPath === '/contact') {
      return <ContactView />;
    }

    if (currentPath === '/join') {
      return <JoinView />;
    }

    if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
      return <AdminView onNavigate={navigate} />;
    }

    // Default Fallback to Home
    return <HomeView onNavigate={navigate} />;
  };

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans selection:bg-[#1a1918] selection:text-[#faf8f5]">
        {!isAdminRoute && <Navigation currentPath={currentPath} onNavigate={navigate} />}

        <main className="flex-1">
          {renderCurrentView()}
        </main>

        {!isAdminRoute && <Footer onNavigate={navigate} />}

        {/* Global Modals */}
        <LightboxModal />
        <SearchModal onNavigate={navigate} />
        {!isAdminRoute && <AdminCMSModal />}
      </div>
    </DataProvider>
  );
}
