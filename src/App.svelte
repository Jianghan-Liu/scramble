<script>
  // 1. Data Imports
  import words5 from './lib/data/words-5.json';
  import words6 from './lib/data/words-6.json';
  import words7 from './lib/data/words-7.json';

  // 2. Application State
  let currentLength = $state(5);
  let targetWord = $state("");
  let scrambledWord = $state("");
  let userGuess = $state("");
  let score = $state(0);
  let feedbackMessage = $state("Press Enter to submit!");

  // 3. Core Logic
  function scrambleText(word) {
    let letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const scrambled = letters.join('');
    
    // Prevent the word from randomly shuffling into its original form
    if (scrambled === word) {
      return scrambleText(word);
    }
    return scrambled;
  }

  function startNewRound() {
    let activeDict;
    if (currentLength === 5) activeDict = words5;
    else if (currentLength === 6) activeDict = words6;
    else if (currentLength === 7) activeDict = words7;

    const randomIndex = Math.floor(Math.random() * activeDict.length);
    targetWord = activeDict[randomIndex];
    
    scrambledWord = scrambleText(targetWord).toUpperCase();
    userGuess = "";
    feedbackMessage = "Press Enter to submit!";
  }

  function handleLengthChange(length) {
    currentLength = length;
    score = 0; 
    startNewRound();
  }

  function checkGuess(event) {
    if (event.key === 'Enter') {
      const cleanGuess = userGuess.trim().toLowerCase();

      if (cleanGuess === targetWord) {
        score += 1;
        feedbackMessage = "Correct!";
        startNewRound();
      } else {
        feedbackMessage = "Incorrect. Try again!";
        event.target.select(); 
      }
    }
  }

  // Start the very first round when the component mounts
  startNewRound();
</script>

<main class="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center pt-20 px-4 font-sans">
  
  <header class="w-full max-w-md flex justify-between items-end mb-10 border-b border-neutral-700 pb-4">
    <h1 class="text-3xl font-bold tracking-tight text-white">Scramble</h1>
    <div class="text-lg font-medium text-neutral-400">
      Score: <span class="text-white">{score}</span>
    </div>
  </header>

  <div class="flex gap-2 mb-12 bg-neutral-800 p-1 rounded-lg">
    {#each [5, 6, 7] as length}
      <button 
        onclick={() => handleLengthChange(length)}
        class="px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-200 
               {currentLength === length ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-700'}"
      >
        {length} Letters
      </button>
    {/each}
  </div>

  <div class="mb-12 h-24 flex items-center justify-center">
    <h2 class="text-5xl sm:text-6xl font-black tracking-[0.25em] text-white select-none">
      {scrambledWord || "LOADING"}
    </h2>
  </div>

  <div class="w-full max-w-md flex flex-col items-center gap-4">
    <input 
      type="text" 
      bind:value={userGuess}
      onkeydown={checkGuess}
      placeholder="Type your answer..."
      class="w-full bg-neutral-800 border-2 border-neutral-700 text-white text-center text-2xl py-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600 uppercase tracking-widest"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      autofocus
    />
    
    <p class="text-sm font-medium text-neutral-400 h-6">
      {feedbackMessage}
    </p>
  </div>

</main>