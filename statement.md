## Project Statement: Scramble Practice

### Overview & Objectives

* **Goal:** Build a fast, highly functional, personal practice tool for unscrambling words.
* **Scope:** A lightweight, client-side-only web application. No backend, no database, and no social/multiplayer features.
* **Local Environment:** macOS, working out of the `scramble/` directory.

### Core Game Mechanics

* **Word Lengths:** The game will focus on 5-letter, 6-letter, and 7-letter words.
* **Interaction Model:** The user is presented with a scrambled word and must type the correct answer into a text input box.
* **Dictionary Standards:** Word lists will adhere to "Wordle standards"—strictly curated to exclude plurals, obscure terms, and highly technical jargon. I want a flat array of strings.
JSON word lists are found and stored in `/src/lib/data/words-5.json`, `/src/lib/data/words-6.json`, and `/src/lib/data/words-7.json`. Example:
```
["about","other","which","their","there","first","would","these","click","price"]
```

### Tech Stack & Architecture

* **Frontend Framework:** **Svelte (via Vite)**. Chosen for its extremely low boilerplate, absence of a virtual DOM, and highly readable syntax, allowing for the fastest possible setup and execution.
* **Styling:** **Tailwind CSS**. Chosen for rapid, utility-first UI design directly within Svelte components without needing separate stylesheets.
* **Data Storage:** **Static JSON**. Pre-filtered, open-source word lists will be downloaded and stored locally in the project as static `.json` files. These will be bundled directly into the app for instant, zero-latency access.
* **Hosting & CI/CD:** **Cloudflare Pages (Free Tier)**. Chosen for seamless, automated deployments to your purchased custom domains.

### Development Environment & Tooling

* **IDE:** VSCode.
* **Version Control:** Git and GitHub.
* **AI Integration:** * **GitHub Copilot (Free Tier):** Used within VSCode for inline autocomplete, generating repetitive Tailwind classes, and scaffolding basic functions.
* **Google Gemini (Premium Web Interface):** Used as the primary architectural partner for game loop logic, complex debugging, and workflow refinement. Google Gemini should provide keyboard shortcuts because the user wants to avoid as much mouse input as possible.

Before the AI makes any response, it should ask me a few clarification questions to make sure my intentions are clear to you. Your goal is not to spit out the perfect solution in one go, but an intelligent engineer who understands the client's (my) needs and willing to iteratively communicate to refine our mutual understanding. 

Use your maximum effort to think and research before responding to my questions.


### Deployment Workflow

1. Develop features locally in VSCode using Svelte and Tailwind.
2. Commit and push code to the `main` branch of the connected GitHub repository.
3. Cloudflare Pages intercepts the push, automatically runs the build command, and deploys the static files to the live custom domain.