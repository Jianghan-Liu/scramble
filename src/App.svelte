<script>
  import words5 from './lib/data/words-5.json';
  import words6 from './lib/data/words-6.json';
  import words7 from './lib/data/words-7.json';

  // State
  let currentLength = $state(5);
  let targetWord = $state("");
  let scrambledWord = $state("");
  let userGuess = $state("");
  let score = $state(0);
  let hintsUsed = $state(0); // Total hints in session
  let revealedCount = $state(0); // Letters revealed for CURRENT word
  let feedbackMessage = $state("Press Enter to submit!");
  let inputElement = $state(); // Reference for auto-focus

  // Logic
  function scrambleText(word) {
    let letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const scrambled = letters.join('');
    return scrambled === word ? scrambleText(word) : scrambled;
  }

  function startNewRound() {
    let activeDict = currentLength === 5 ? words5 : currentLength === 6 ? words6 : words7;
    const randomIndex = Math.floor(Math.random() * activeDict.length);
    
    targetWord = activeDict[randomIndex];
    scrambledWord = scrambleText(targetWord).toUpperCase();
    userGuess = "";
    revealedCount = 0; // Reset hints for new word
    feedbackMessage = "Press Enter to submit!";
  }

  function giveHint() {
      if (revealedCount < targetWord.length) {
        revealedCount += 1;
        hintsUsed += 1;
        
        // Auto-refocus the input after clicking the button
        // syntax for Svelte 5 to ensure DOM is ready
        setTimeout(() => inputElement?.focus(), 0);
      }
    }

  function handleLengthChange(length) {
    currentLength = length;
    score = 0;
    hintsUsed = 0; 
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

  startNewRound();
</script>

<main class="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center pt-20 px-4 font-sans">
  
  <header class="w-full max-w-md flex justify-between items-end mb-10 border-b border-neutral-700 pb-4">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-white">Scramble</h1>
      <p class="text-xs text-neutral-500 uppercase tracking-widest mt-1">Hints Used: {hintsUsed}</p>
    </div>
    <div class="text-lg font-medium text-neutral-400">
      Score: <span class="text-white">{score}</span>
    </div>
  </header>

  <div class="flex gap-2 mb-12 bg-neutral-800 p-1 rounded-lg">
    {#each [5, 6, 7] as length}
      <button 
        onclick={() => handleLengthChange(length)}
        class="px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-200 
               {currentLength === length ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}"
      >
        {length}L
      </button>
    {/each}
  </div>

  <div class="mb-8 h-24 flex flex-col items-center justify-center">
    <h2 class="text-5xl sm:text-6xl font-black tracking-[0.25em] text-white select-none">
      {scrambledWord}
    </h2>
    
    <div class="mt-4 flex gap-2 h-8">
      {#if revealedCount > 0}
        <span class="text-indigo-400 font-mono text-xl tracking-[0.3em] uppercase">
          {targetWord.slice(0, revealedCount)}
          <span class="text-neutral-700">{"_".repeat(targetWord.length - revealedCount)}</span>
        </span>
      {/if}
    </div>
  </div>

  <div class="w-full max-w-md flex flex-col gap-6">
    <input 
      bind:this={inputElement}
      type="text" 
      bind:value={userGuess}
      onkeydown={checkGuess}
      placeholder="Type answer..."
      class="w-full bg-neutral-800 border-2 border-neutral-700 text-white text-center text-2xl py-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase tracking-widest"
      autocomplete="off"
      autofocus
    />
    
    <div class="flex items-center justify-between min-h-[44px]">
      <p class="text-sm font-medium text-neutral-400 italic">
        {feedbackMessage}
      </p>

      <button 
        onclick={giveHint}
        disabled={revealedCount >= targetWord.length}
        class="group flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all
              disabled:opacity-30 disabled:cursor-not-allowed
              bg-amber-500/10 text-amber-500 border border-amber-500/20 
              hover:bg-amber-500 hover:text-neutral-900 active:scale-95"
      >
        <span>Get Hint</span>
      </button>
    </div>
  </div>
</main>