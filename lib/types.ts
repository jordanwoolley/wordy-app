export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  example?: string;
  notes?: string;
  gender?: 'le' | 'la' | 'les' | "l'"; // French gender
  createdAt: Date;
  nextReview: Date;
  interval: number; // days until next review
  easeFactor: number; // SM-2 ease factor
  repetitions: number; // number of successful reviews
  lapses: number; // number of times forgotten
}

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0-5 quality rating for SM-2 algorithm
  // 0: complete blackout
  // 1: incorrect, but familiar
  // 2: incorrect, but almost correct
  // 3: correct with difficulty
  // 4: correct with hesitation
  // 5: perfect recall
}

export interface Stats {
  totalWords: number;
  dueToday: number;
  reviewedToday: number;
  streak: number;
}
