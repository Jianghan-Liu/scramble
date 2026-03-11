function pickChunkLengths(length, difficulty) {
    const rand = Math.random();
    
    if (length === 5) {
        if (difficulty === 'Easy') return rand < 0.5 ? [3] : [2, 2];
        return []; // Normal
    }
    
    if (length === 6) {
        if (difficulty === 'Easy') {
            if (rand < 0.4) return [2, 2, 2];
            if (rand < 0.8) return [3];
            return [2, 2];
        }
        return []; // Normal
    }
    
    if (length === 7) {
        if (difficulty === 'Easy') {
            if (rand < 0.3) return [4];
            if (rand < 0.7) return [3, 2];
            return [2, 2, 2];
        }
        return []; // Normal
    }
    
    return [];
}

function violatesNormalMode(word, scrambled, length) {
    const getOriginals = (len) => {
        let subs = new Set();
        for (let i = 0; i <= word.length - len; i++) {
            subs.add(word.substring(i, i + len));
        }
        return Array.from(subs);
    };

    const hasChunk = (str, chunks) => chunks.find(c => str.includes(c));

    if (length === 5) {
        return !!hasChunk(scrambled, getOriginals(3));
    }
    
    if (length === 6) {
        if (hasChunk(scrambled, getOriginals(4))) return true;
        
        const subs3 = getOriginals(3);
        const subs2 = getOriginals(2);
        
        for (let c3 of subs3) {
            if (scrambled.includes(c3)) {
                let replaced = scrambled.replace(c3, " ");
                if (hasChunk(replaced, subs2)) return true;
            }
        }
        return false;
    }
    
    if (length === 7) {
        if (hasChunk(scrambled, getOriginals(4))) return true;
        
        const subs3 = getOriginals(3);
        for (let c3 of subs3) {
            if (scrambled.includes(c3)) {
                let replaced = scrambled.replace(c3, " ");
                if (hasChunk(replaced, subs3)) return true;
            }
        }
        return false;
    }
    
    return false;
}

export function generateScramble(word, length, difficulty) {
    // 1. Roll the front-lock probability once per round
    let shouldLockFront = false;
    if (difficulty === 'Easy') {
        const prob = length === 5 ? 0.40 : length === 6 ? 0.60 : 0.80;
        shouldLockFront = Math.random() < prob;
    }

    const createScramble = (chunkLengths) => {
        let chunks = [];
        let attempts = 0;
        
        while (attempts < 50) {
            attempts++;
            let used = Array(word.length).fill(false);
            let success = true;
            let tempChunks = []; // Will hold objects: { text: String, isFront: Boolean }
            
            for (let L of chunkLengths) {
                let validIndices = [];
                for (let i = 0; i <= word.length - L; i++) {
                    if (!used.slice(i, i + L).includes(true)) {
                        validIndices.push(i);
                    }
                }
                
                if (validIndices.length === 0) {
                    success = false;
                    break;
                }
                
                let pick = validIndices[Math.floor(Math.random() * validIndices.length)];
                for (let k = pick; k < pick + L; k++) used[k] = true;
                
                // Track if this chunk starts at index 0
                tempChunks.push({ text: word.substring(pick, pick + L), isFront: pick === 0 });
            }
            
            if (success) {
                for (let i = 0; i < word.length; i++) {
                    // Track if a single unchunked letter starts at index 0
                    if (!used[i]) tempChunks.push({ text: word[i], isFront: i === 0 });
                }
                chunks = tempChunks;
                break;
            }
        }
        
        if (chunks.length === 0) {
            chunks = word.split('').map((char, i) => ({ text: char, isFront: i === 0 }));
        }
        
        // 2. Separate the front chunk if we are locking it
        let frontChunk = null;
        let restChunks = [];
        
        if (shouldLockFront) {
            frontChunk = chunks.find(c => c.isFront);
            restChunks = chunks.filter(c => !c.isFront);
        } else {
            restChunks = [...chunks];
        }

        // 3. Shuffle the remaining bag
        for (let i = restChunks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [restChunks[i], restChunks[j]] = [restChunks[j], restChunks[i]];
        }
        
        // 4. Re-attach the front chunk if locked
        if (shouldLockFront && frontChunk) {
            restChunks.unshift(frontChunk);
        }
        
        return restChunks.map(c => c.text).join('');
    };

    let chunkLengths = pickChunkLengths(length, difficulty);
    let scrambled = createScramble(chunkLengths);

    // Ensure the final scramble isn't accidentally the original word
    while (scrambled === word) {
        scrambled = createScramble(chunkLengths);
    }

    // Normal Mode strict reshuffle check
    if (difficulty === 'Normal' && violatesNormalMode(word, scrambled, length)) {
        let reshuffled = createScramble(chunkLengths);
        if (reshuffled !== word) {
            scrambled = reshuffled;
        }
    }

    return scrambled;
}