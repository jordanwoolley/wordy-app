'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { vocabularyDB } from '@/lib/db';
import { createNewVocabulary } from '@/lib/srs';
import { parseWordReferenceData, SCRAPER_INSTRUCTIONS } from '@/lib/wordreference';

export default function AddWord() {
  const router = useRouter();
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [example, setExample] = useState('');
  const [notes, setNotes] = useState('');
  const [gender, setGender] = useState<'le' | 'la' | 'les' | "l'" | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  const handleImport = () => {
    const data = parseWordReferenceData(importData);
    if (data) {
      setWord(data.word);
      setTranslation(data.translation);
      setExample(data.example || '');
      setGender(data.gender || '');
      setImportData('');
      setShowImport(false);
      alert('Data imported! Review and submit.');
    } else {
      alert('Invalid data format. Please check and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newVocab = createNewVocabulary(
        word,
        translation,
        example || undefined,
        notes || undefined,
        gender || undefined
      );

      await vocabularyDB.addWord(newVocab);
      
      // Reset form
      setWord('');
      setTranslation('');
      setExample('');
      setNotes('');
      setGender('');
      
      // Show success briefly
      alert('Word added! ✓');
    } catch (error) {
      console.error('Error adding word:', error);
      alert('Failed to add word. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.push('/?admin=true')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
          >
            ← Back
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            {showImport ? 'Manual Entry' : 'Import from WordReference'}
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Add Word</h1>
        <p className="text-gray-400 mb-8">French → English</p>

        {showImport && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-3">Import from WordReference</h3>
            <p className="text-gray-400 text-sm mb-4">
              Use the bookmarklet while browsing WordReference, then paste the JSON here.
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder='{"word":"maison","translation":"house","example":"...","gender":"la"}'
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm mb-3"
            />
            <button
              onClick={handleImport}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Import Data
            </button>
            <details className="mt-4">
              <summary className="text-cyan-400 text-sm cursor-pointer">Show bookmarklet instructions</summary>
              <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap">{SCRAPER_INSTRUCTIONS}</pre>
            </details>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-gray-300 mb-2">
              French Word *
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="maison"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
              Gender (Optional)
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="le">le (masculine)</option>
              <option value="la">la (feminine)</option>
              <option value="les">les (plural)</option>
              <option value="l'">l' (vowel start)</option>
            </select>
          </div>

          <div>
            <label htmlFor="translation" className="block text-sm font-medium text-gray-300 mb-2">
              English Translation *
            </label>
            <input
              type="text"
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="house"
            />
          </div>

          <div>
            <label htmlFor="example" className="block text-sm font-medium text-gray-300 mb-2">
              Example Sentence (Optional)
            </label>
            <textarea
              id="example"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="J'habite dans une grande maison."
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Add context or mnemonics..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? 'Adding...' : 'Add Word'}
          </button>
        </form>
      </div>
    </div>
  );
}
