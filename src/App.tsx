import { useState } from 'react';
import type { Participant } from './types';
import TournamentPage from './pages/TournamentPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';

type Page = 'tournament' | 'signup';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('tournament');
  const [newParticipant, setNewParticipant] = useState<Omit<Participant, 'id'> | null>(null);

  function handleSignUp(participant: Omit<Participant, 'id'>) {
    setNewParticipant(participant);
  }

  return (
    <div className="app">
      <nav className="nav">
        <h1 className="nav-title">Tournament Manager</h1>
        <div>
          <button onClick={() => setCurrentPage('tournament')}>All Sign-Ups</button>
          <button onClick={() => setCurrentPage('signup')}>Sign Up</button>
        </div>
      </nav>
      <main>
        {currentPage === 'tournament' ? (
          <TournamentPage
            onNavigateToSignUp={() => setCurrentPage('signup')}
            newParticipant={newParticipant}
          />
        ) : (
          <SignUpPage
            onSignUp={handleSignUp}
            onNavigateToTournament={() => setCurrentPage('tournament')}
          />
        )}
      </main>
    </div>
  );
}
