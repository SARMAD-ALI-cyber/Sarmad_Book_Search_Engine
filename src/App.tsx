import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/theme-provider';
import BookSearch from './components/BookSearch';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <BookSearch />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;