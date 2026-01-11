# Wordy - Vocabulary SRS App

A spaced repetition flashcard web app for vocabulary practice, optimized for iOS and deployable on Vercel.

## Features

- 📚 Add and manage vocabulary words with translations
- 🧠 SM-2 spaced repetition algorithm (like WaniKani)
- 📱 PWA support for iOS - install as a native-like app
- 💾 Client-side storage with IndexedDB
- 📊 Progress tracking and statistics
- 🎨 Clean, mobile-optimized interface

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **IndexedDB** - Local storage
- **PWA** - Progressive Web App features

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Deploy to Vercel

The easiest way to deploy:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

Vercel will automatically detect Next.js and configure everything.

## Usage

1. **Add Words**: Click "Add New Word" to add vocabulary
2. **Review**: Click "Start Review" when words are due
3. **Rate Your Recall**: After reviewing, rate how well you knew the word:
   - ❌ Again - Forgot completely (resets the card)
   - 😐 Hard - Difficult to recall
   - 👍 Good - Recalled correctly
   - ✨ Easy - Perfect recall

## SRS Algorithm

The app uses the SM-2 spaced repetition algorithm:
- New words start with a 1-day interval
- Successful reviews increase the interval
- Failed reviews reset the card
- Each card has an ease factor that adjusts based on performance

## PWA Installation (iOS)

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will behave like a native app!

## Project Structure

```
app/
  ├── page.tsx          # Dashboard/home page
  ├── add/page.tsx      # Add new words
  ├── review/page.tsx   # Review flashcards
  └── layout.tsx        # Root layout
lib/
  ├── types.ts          # TypeScript types
  ├── db.ts             # IndexedDB wrapper
  └── srs.ts            # SRS algorithm
public/
  └── manifest.json     # PWA manifest
```

## Future Enhancements

- Import from WordReference API
- Multiple language pair support
- Export/import vocabulary lists
- Streak tracking
- Audio pronunciation
- Images for vocabulary cards

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
