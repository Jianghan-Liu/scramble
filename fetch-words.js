const fs = require('fs');
const path = require('path');

// Using the top 10,000 most common English words (curated, no swearing) to ensure high-quality, recognizable targets.
const SOURCE_URL = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt';
const TARGET_DIR = path.join(__dirname, 'src', 'lib', 'data');

async function generateWordLists() {
    console.log('Fetching curated word list...');
    
    try {
        // Node 18+ has native fetch
        const response = await fetch(SOURCE_URL);
        const text = await response.text();
        
        // Split the text file into an array and clean up any stray whitespace
        const allWords = text.split('\n').map(word => word.trim().toLowerCase());
        
        // Filter into our specific game lengths
        const words5 = allWords.filter(w => w.length === 5);
        const words6 = allWords.filter(w => w.length === 6);
        const words7 = allWords.filter(w => w.length === 7);

        // Ensure the Svelte data directory exists
        if (!fs.existsSync(TARGET_DIR)) {
            fs.mkdirSync(TARGET_DIR, { recursive: true });
        }

        // Write to flat JSON arrays
        fs.writeFileSync(path.join(TARGET_DIR, 'words-5.json'), JSON.stringify(words5));
        fs.writeFileSync(path.join(TARGET_DIR, 'words-6.json'), JSON.stringify(words6));
        fs.writeFileSync(path.join(TARGET_DIR, 'words-7.json'), JSON.stringify(words7));

        console.log(`Success! Saved to ${TARGET_DIR}:`);
        console.log(`- words-5.json (${words5.length} words)`);
        console.log(`- words-6.json (${words6.length} words)`);
        console.log(`- words-7.json (${words7.length} words)`);
        
    } catch (error) {
        console.error('Error fetching or saving words:', error);
    }
}

generateWordLists();