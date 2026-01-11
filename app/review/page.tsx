'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { vocabularyDB } from '@/lib/db';
import { calculateNextReview } from '@/lib/srs';
import { Vocabulary, ReviewResult } from '@/lib/types';

export default function Review() {
  const router = useRouter();
  const [dueWords, setDueWords] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    loadDueWords();
  }, []);

  const loadDueWords = async () => {
    try {
      const words = await vocabularyDB.getDueWords();
      // Shuffle the words
      const shuffled = words.sort(() => Math.random() - 0.5);
      setDueWords(shuffled);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading words:', error);
      setIsLoading(false);
    }
  };

  const handleReview = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    const currentWord = dueWords[currentIndex];
    if (!currentWord) return;

    const result: ReviewResult = { quality };
    const updatedWord = calculateNextReview(currentWord, result);

    try {
      await vocabularyDB.updateWord(updatedWord);
      setReviewedCount(prev => prev + 1);

      // Move to next word
      if (currentIndex + 1 < dueWords.length) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Review session complete
        router.push('/?reviewed=true');
      }
    } catch (error) {
      console.error('Error updating word:', error);
      alert('Failed to save review. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (dueWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 All Done!</h1>
          <p className="text-gray-600 mb-8">No words due for review right now.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentWord = dueWords[currentIndex];
  const progress = ((reviewedCount) / dueWords.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{reviewedCount} / {dueWords.length} reviewed</span>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              Exit
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentWord.word}
            </h2>
            
            {showAnswer && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-2xl text-blue-600 font-semibold">
                  {currentWord.translation}
                </p>
                
                {currentWord.example && (
                  <p className="text-gray-600 italic mt-4">
                    &ldquo;{currentWord.example}&rdquo;
                  </p>
                )}
                
                {currentWord.notes && (
                  <p className="text-sm text-gray-500 mt-2">
                    Note: {currentWord.notes}
                  </p>
                )}
              </div>
            )}
          </div>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg"
            >
              Show Answer
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center mb-2">How well did you know it?</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReview(1)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg"
                >
                  ❌ Again
                </button>
                <button
                  onClick={() => handleReview(3)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg"
                >
                  😐 Hard
                </button>
                <button
                  onClick={() => handleReview(4)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg"
                >
                  👍 Good
                </button>
                <button
                  onClick={() => handleReview(5)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
                >
                  ✨ Easy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Word info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Repetitions: {currentWord.repetitions} | Lapses: {currentWord.lapses}</p>
        </div>
      </div>
    </div>
  );
}
