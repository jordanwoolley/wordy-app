'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { vocabularyDB } from '@/lib/db';
import { getStats } from '@/lib/srs';
import { Vocabulary } from '@/lib/types';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stats, setStats] = useState({ totalWords: 0, dueToday: 0, reviewedToday: 0 });
  const [allWords, setAllWords] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    loadData();
    
    if (searchParams.get('reviewed') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      const words = await vocabularyDB.getAllWords();
      setAllWords(words);
      const statsData = getStats(words);
      setStats(statsData);
      setIsLoading(false);
      
      // Auto-launch reviews if words are due and not coming back from review
      if (statsData.dueToday > 0 && !searchParams.get('reviewed') && !searchParams.get('admin')) {
        router.push('/review');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (confirm('Are you sure you want to delete this word?')) {
      try {
        await vocabularyDB.deleteWord(id);
        loadData();
      } catch (error) {
        console.error('Error deleting word:', error);
        alert('Failed to delete word');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Admin Button - Top Right */}
      <button
        onClick={() => setShowAdmin(!showAdmin)}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition-colors"
        title="Admin Panel"
      >
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {/* Admin Panel Overlay */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4" onClick={() => setShowAdmin(false)}>
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
              <button onClick={() => setShowAdmin(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => {
                setShowAdmin(false);
                router.push('/add');
              }}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-xl mb-4 transition-colors"
            >
              + Add New Word
            </button>

            {/* Word List */}
            {allWords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Vocabulary ({allWords.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allWords
                    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
                    .map((word) => {
                      const isDue = new Date(word.nextReview) <= new Date();
                      return (
                        <div
                          key={word.id}
                          className={`flex justify-between items-center p-4 rounded-lg ${
                            isDue ? 'bg-orange-500 bg-opacity-20 border border-orange-500' : 'bg-gray-700 border border-gray-600'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-white">{word.word}</div>
                            <div className="text-sm text-gray-400">{word.translation}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Next: {new Date(word.nextReview).toLocaleDateString()} | Reps: {word.repetitions}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteWord(word.id)}
                            className="text-red-400 hover:text-red-300 ml-4 px-2 py-1"
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-6 py-4 rounded-xl animate-fade-in">
            🎉 Review session complete!
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Wordy
            </span>
          </h1>
          <p className="text-gray-400 text-lg">French Vocabulary Mastery</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400">{stats.totalWords}</div>
            <div className="text-gray-400 mt-2 text-sm">Total</div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400">{stats.dueToday}</div>
            <div className="text-gray-400 mt-2 text-sm">Due Today</div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400">{stats.reviewedToday}</div>
            <div className="text-gray-400 mt-2 text-sm">Reviewed</div>
          </div>
        </div>

        {/* Main Action */}
        <div className="flex flex-col items-center">
          {stats.dueToday > 0 ? (
            <button
              onClick={() => router.push('/review')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-2xl shadow-cyan-500/50 transition-all transform hover:scale-105"
            >
              Start Reviews ({stats.dueToday})
            </button>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-white mb-4">All Caught Up!</h2>
              <p className="text-gray-400 mb-8">No reviews due right now. Check back later!</p>
              <button
                onClick={() => {
                  router.push('/?admin=true');
                  setShowAdmin(true);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Add more words →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
