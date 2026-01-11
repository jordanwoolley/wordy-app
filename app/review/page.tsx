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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (dueWords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-white mb-4">All Done!</h1>
          <p className="text-gray-400 mb-8">No words due for review right now.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl"
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{reviewedCount} / {dueWords.length}</span>
            <button
              onClick={() => router.push('/')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Exit
            </button>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-12 min-h-[500px] flex flex-col justify-between shadow-2xl">
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {/* Show gender if available and answer not shown */}
            {!showAnswer && currentWord.gender && (
              <div className="text-cyan-400 text-lg mb-4 font-semibold">
                {currentWord.gender}
              </div>
            )}
            
            <h2 className="text-6xl font-bold text-white mb-6">
              {currentWord.word}
            </h2>
            
            {showAnswer && (
              <div className="space-y-6 animate-fade-in w-full">
                <p className="text-4xl text-cyan-400 font-semibold">
                  {currentWord.translation}
                </p>
                
                {currentWord.example && (
                  <p className="text-gray-300 text-lg italic mt-6 max-w-xl">
                    &ldquo;{currentWord.example}&rdquo;
                  </p>
                )}
                
                {currentWord.notes && (
                  <p className="text-sm text-gray-500 mt-4">
                    {currentWord.notes}
                  </p>
                )}
              </div>
            )}
          </div>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-5 px-6 rounded-2xl text-xl transition-all transform hover:scale-105"
            >
              Show Answer
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center mb-4">How well did you know it?</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReview(1)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors"
                >
                  Again
                </button>
                <button
                  onClick={() => handleReview(3)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors"
                >
                  Hard
                </button>
                <button
                  onClick={() => handleReview(4)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors"
                >
                  Good
                </button>
                <button
                  onClick={() => handleReview(5)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors"
                >
                  Easy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Word stats */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Stage {currentWord.repetitions + 1} | {currentWord.lapses > 0 ? `${currentWord.lapses} lapse${currentWord.lapses > 1 ? 's' : ''}` : 'No lapses'}</p>
        </div>
      </div>
    </div>
  );
}
