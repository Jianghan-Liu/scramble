import json
import requests
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet

# Download necessary NLTK data
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('punkt_tab')

def get_wordnet_pos(treebank_tag):
    """Map POS tag to WordNet tag"""
    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN

def is_wordle_standard(word, tag):
    """
    Wordle logic:
    1. No simple plurals (Noun + 's' where lemma is the same)
    2. No simple past tense (Verb + 'ed' where lemma is different)
    """
    lemmatizer = WordNetLemmatizer()
    pos = get_wordnet_pos(tag)
    lemma = lemmatizer.lemmatize(word, pos)

    # Filter out past tense verbs ending in 'ed' (e.g., jumped -> jump)
    if pos == wordnet.VERB and word.endswith('ed') and lemma != word:
        return False
    
    # Filter out simple plurals (e.g., boats -> boat)
    if pos == wordnet.NOUN and word.endswith('s') and lemma != word:
        # Protect words where the lemma also ends in 's' (e.g., glass, chess)
        if not lemma.endswith('s'):
            return False

    return True

def main():
    # 1. Fetch Google 10,000 English list
    url = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt"
    response = requests.get(url)
    all_words = response.text.splitlines()

    # 2. Structure for our lists
    dictionaries = {5: [], 6: [], 7: []}

    print("Analyzing words...")
    
    # Process words by length and standard
    for word in all_words:
        word = word.lower()
        length = len(word)
        
        if length in [5, 6, 7]:
            # POS Tagging (needs a list, so we wrap the word)
            tokens = nltk.word_tokenize(word)
            tag = nltk.pos_tag(tokens)[0][1]

            if is_wordle_standard(word, tag):
                dictionaries[length].append(word)

    # 3. Save to JSON files
    for length, words in dictionaries.items():
        # Truncate to a reasonable number of common words (e.g., top 1500)
        # Wordle solutions are usually chosen from a pool of ~2,300.
        final_list = words[:1500] 
        file_path = f"src/lib/data/words-{length}.json"
        
        with open(file_path, 'w') as f:
            json.dump(final_list, f)
        
        print(f"Saved {len(final_list)} words to {file_path}")

if __name__ == "__main__":
    main()