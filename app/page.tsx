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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success message */}
        {showSuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            🎉 Review session complete!
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">📚 Wordy</h1>
          <p className="text-gray-600">Vocabulary SRS Flashcards</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600">{stats.totalWords}</div>
            <div className="text-gray-600 mt-2">Total Words</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-orange-600">{stats.dueToday}</div>
            <div className="text-gray-600 mt-2">Due Today</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600">{stats.reviewedToday}</div>
            <div className="text-gray-600 mt-2">Reviewed Today</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/review')}
            disabled={stats.dueToday === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-6 px-8 rounded-lg text-xl shadow-lg transition-colors"
          >
            {stats.dueToday > 0 ? `Start Review (${stats.dueToday})` : 'No Reviews Due'}
          </button>
          
          <button
            onClick={() => router.push('/add')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-lg text-xl shadow-lg transition-colors"
          >
            + Add New Word
          </button>
        </div>

        {/* Word List */}
        {allWords.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Vocabulary</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allWords
                .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
                .map((word) => {
                  const isDue = new Date(word.nextReview) <= new Date();
                  return (
                    <div
                      key={word.id}
                      className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                        isDue ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{word.word}</div>
                        <div className="text-sm text-gray-600">{word.translation}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Next review: {new Date(word.nextReview).toLocaleDateString()} | 
                          Reps: {word.repetitions}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="text-red-500 hover:text-red-700 ml-4 px-3 py-1"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {allWords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No words yet. Start building your vocabulary!</p>
            <button
              onClick={() => router.push('/add')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Add your first word →
            </button>
          </div>
        )}
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
