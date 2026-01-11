# Database & Persistence in Wordy

## How Data is Stored

Wordy uses **IndexedDB** for client-side storage. This means:

✅ **Your data IS persistent** - it stays in the browser even after closing
✅ **Works offline** - no internet needed after initial load
✅ **SRS scores are tracked** - all review history and intervals are saved
✅ **Fast and responsive** - no server roundtrips

## IndexedDB Details

- **Database Name**: `WordyDB`
- **Store Name**: `vocabulary`
- **Indexes**: 
  - `nextReview` - for querying due words
  - `createdAt` - for sorting by creation date

## Data Stored Per Word

Each vocabulary entry includes:
- Word & translation (automatically lowercased)
- Gender (for French nouns)
- Example sentences & notes
- SRS data: easeFactor, interval, repetitions, lapses
- Review schedule: nextReview date

## Important Notes

### ⚠️ Browser Storage Limitations

IndexedDB is **browser-specific and device-specific**:
- Data is tied to your browser on this device only
- Clearing browser data will delete vocabulary
- Different browsers have separate databases
- No sync between devices (yet)

### 💡 For Production Use

If you want cloud backup or multi-device sync, consider:

1. **Backend Database Option**:
   - Add Vercel Postgres or Supabase
   - Requires authentication
   - Enables cloud backup & sync

2. **Export/Import Feature** (Future):
   - Export vocabulary as JSON
   - Import on other devices
   - Manual backup option

3. **Current Setup is Great For**:
   - Single-device usage
   - Privacy (no data sent to servers)
   - Fast, offline-first experience
   - PWA/mobile app feel

## Testing Persistence

To verify data is saving:
1. Add a word
2. Close the tab completely
3. Reopen http://localhost:3000
4. Your word should still be there!

The SRS system tracks all your review history and automatically schedules next reviews based on the SM-2 algorithm.
