# Wordy - French Vocabulary SRS App

A minimal, WaniKani-inspired spaced repetition flashcard web app for mastering French vocabulary. Optimized for iOS with PWA support, deployable on Vercel.

## ✨ Features

- 🎯 **Auto-Launch Reviews** - Opens directly to your daily reviews
- 🧠 **SM-2 Spaced Repetition** - Intelligent review scheduling like WaniKani
- 🇫🇷 **French-English Focus** - Specialized for French learners with gender support
- 📱 **PWA for iOS** - Install as a native-like app on your iPhone
- 💾 **IndexedDB Storage** - Persistent local storage, works offline
- 🎨 **Minimal Dark UI** - Clean, distraction-free design with vibrant accents
- 📊 **Progress Tracking** - View stats and review history
- 🔧 **Admin Panel** - Top-right settings button for managing vocabulary
- 📖 **WordReference Import** - Bookmarklet to quickly extract words from WordReference

## 🎨 Design Philosophy

Inspired by WaniKani's minimal aesthetic:
- Dark background (#16213e) for reduced eye strain
- Vibrant cyan-blue gradient accents
- Large, readable flashcards
- Simple, focused interface
- Auto-lowercase for consistency

## 🚀 Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - if you have reviews, it'll launch straight into them!

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Deploy! Vercel auto-detects Next.js

## 📖 Usage

### Daily Workflow

1. Open the app - **automatically launches into reviews** if words are due
2. Review each word and rate your recall:
   - **Again** - Forgot completely (resets interval)
   - **Hard** - Difficult recall
   - **Good** - Correct recall
   - **Easy** - Perfect recall
3. Complete your reviews and come back tomorrow!

### Adding Words

1. Click the **⚙️ admin button** (top-right)
2. Click "Add New Word"
3. **Manual Entry**: Fill in the form
4. **WordReference Import**: 
   - Visit `http://localhost:3000/bookmarklet.html` for the bookmarklet
   - Use it while browsing WordReference
   - Paste extracted JSON into the import field

### Admin Panel

Access via the top-right settings icon:
- Add new words
- View all vocabulary
- Delete words
- See review schedules and stats

## 🔤 French Features

- **Gender Support**: Specify le/la/les/l' for nouns
- **Example Sentences**: Add context for better memorization
- **Automatic Lowercasing**: Maintains consistency
- **Gender Display**: Shows gender hint during review

## 📱 PWA Installation (iOS)

1. Open the app in Safari on your iPhone
2. Tap the Share button
3. Select "Add to Home Screen"
4. App behaves like a native app with offline support!

## 💾 Database & Persistence

Wordy uses **IndexedDB** for storage:
- ✅ Data persists in your browser
- ✅ Works completely offline
- ✅ SRS scores and history saved
- ⚠️ Browser-specific (no cloud sync yet)
- 💡 Clear browser data = lost vocabulary

See [DATABASE.md](./DATABASE.md) for more details.

## 🎯 SRS Algorithm

SM-2 (SuperMemo 2) algorithm:
- New words: 1 day interval
- Successful reviews: Interval increases (1d → 6d → ~2w → ~1m...)
- Failed reviews: Reset to 1 day
- Ease factor adjusts based on performance
- Minimum ease factor: 1.3

## 📁 Project Structure

```
app/
  ├── page.tsx          # Dashboard (auto-launches reviews)
  ├── add/page.tsx      # Add new words (manual + import)
  ├── review/page.tsx   # Flashcard review interface
  └── layout.tsx        # Root layout with dark theme
lib/
  ├── types.ts          # TypeScript types (French-focused)
  ├── db.ts             # IndexedDB wrapper
  ├── srs.ts            # SM-2 algorithm
  └── wordreference.ts  # WordReference scraper utilities
public/
  ├── manifest.json     # PWA manifest
  ├── bookmarklet.html  # Import tool instructions
  └── icon-*.svg        # PWA icons
```

## 🔮 Future Enhancements

- [ ] Cloud sync with backend database
- [ ] Export/import vocabulary JSON
- [ ] Streak tracking & gamification
- [ ] Audio pronunciation
- [ ] Images for vocabulary cards
- [ ] Multiple language pairs
- [ ] Conjugation support for verbs
- [ ] More granular statistics

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
