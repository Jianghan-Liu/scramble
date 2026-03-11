# Scramble Practice

A fast, highly functional, client-side web application for practicing anagrams and unscrambling words. Built for speed and zero-latency practice with curated dictionaries.

## 🚀 Current Features
* **Zero-Latency Gameplay:** 100% client-side logic with bundled static JSON dictionaries.
* **Curated Word Lists:** Adheres to strict dictionary standards (no obscure jargon or plurals), available in 5, 6, and 7-letter lengths.
* **Instant Feedback Loop:** Auto-highlighting on incorrect guesses for instant re-typing.
* **Modern Stack:** Built entirely with Svelte 5 and Tailwind CSS v4.

## 🛠️ Roadmap & Future Development
* **Hint System:** A "Get Hint" button that reveals the next correct letter from the start of the word. Hints will not penalize the score but will be tracked via a separate "Hints Used" counter.
* **Distinct Game Modes:**
  * **Time-Bound Mode:** e.g., A 60-second blitz to solve as many words as possible.
  * **Count-Bound Mode:** e.g., A 10-word sprint measured by how fast you can complete the set.
* **Shareable Results:** A Wordle-style clipboard export feature that generates a clean summary string of your run. 
  * *Example:* `Scramble (5 Letters) - 10 Word Sprint ⏱️ 45s | 🎯 Score: 10/10 | 💡 Hints: 2`

## 💻 Local Development

### Prerequisites
* Node.js installed

### Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install

```

3. Start the local development server:
```bash
npm run dev

```


4. Build for production:
```bash
npm run build

```