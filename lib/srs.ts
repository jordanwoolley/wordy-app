import { Vocabulary, ReviewResult } from './types';

/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 algorithm
 */
export function calculateNextReview(
  vocab: Vocabulary,
  result: ReviewResult
): Vocabulary {
  const { quality } = result;
  
  // Update ease factor
  let newEaseFactor = vocab.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Minimum ease factor is 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  let newInterval: number;
  let newRepetitions: number;
  let newLapses = vocab.lapses;

  // If quality is less than 3, reset the card
  if (quality < 3) {
    newInterval = 1;
    newRepetitions = 0;
    newLapses += 1;
  } else {
    // Successful review
    if (vocab.repetitions === 0) {
      newInterval = 1;
    } else if (vocab.repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(vocab.interval * newEaseFactor);
    }
    newRepetitions = vocab.repetitions + 1;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    ...vocab,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    lapses: newLapses,
    nextReview: nextReviewDate,
  };
}

/**
 * Create a new vocabulary entry with default SRS values
 */
export function createNewVocabulary(
  word: string,
  translation: string,
  example?: string,
  notes?: string,
  gender?: 'le' | 'la' | 'les' | "l'"
): Vocabulary {
  const now = new Date();
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    word: word.toLowerCase().trim(),
    translation: translation.toLowerCase().trim(),
    example,
    notes,
    gender,
    createdAt: now,
    nextReview: now, // Available for review immediately
    interval: 0,
    easeFactor: 2.5, // Default ease factor
    repetitions: 0,
    lapses: 0,
  };
}

/**
 * Get stats about vocabulary progress
 */
export function getStats(allWords: Vocabulary[]): {
  totalWords: number;
  dueToday: number;
  reviewedToday: number;
} {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return {
    totalWords: allWords.length,
    dueToday: allWords.filter(w => new Date(w.nextReview) <= now).length,
    reviewedToday: allWords.filter(w => {
      // If interval is 0, hasn't been reviewed yet
      if (w.interval === 0) return false;
      // Check if nextReview was set today or later (meaning it was reviewed today)
      const reviewDate = new Date(w.nextReview);
      reviewDate.setDate(reviewDate.getDate() - w.interval);
      return reviewDate >= todayStart;
    }).length,
  };
}
