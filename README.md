# OpenBrowserAI - Open Source Browser AI Agent

OpenBrowserAI is an AI agent that uses real browser automation to help people / volunteer discover, connect with, and take action on causes that matter to them.

## Demo

Watch the demo video: [OpenBrowserAI Demo](https://drive.google.com/file/d/1H8ocpMhVtr5twvEHcH1OkLC8-s3eQDKa/view?usp=sharing)

## Installation

### Option 1: Install Globally via npm

```bash
npm install -g https://github.com/anirudhat101/OpenBrowserAI.git
```

### Option 2: Clone and Install Locally

```bash
git clone https://github.com/anirudhat101/OpenBrowserAI.git
cd OpenBrowserAI
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

## Usage

### Using Global CLI (if installed globally)

After global installation, you can run:

```bash
OpenBrowserAI "find education wellness volunteer program in US"
```

### Using Local Installation

If you cloned the repository:

```bash
# Run directly
node agent/cli.js "find education wellness volunteer program in US"

# Or use npm
npm start -- "find education wellness volunteer program in US"
```

## Example Commands

```bash
# Find volunteer opportunities
OpenBrowserAI "find education wellness volunteer program in US"

# Search for environmental causes
OpenBrowserAI "find environmental conservation projects near me"

# Look for community initiatives
OpenBrowserAI "find community service opportunities in New York"

# Discover social causes
OpenBrowserAI "find food bank volunteer opportunities"
```

## Features

- **Real Browser Automation**: The AI agent browses real websites to find local and global community initiatives
- **Smart Cause Matching**: Matches users with causes based on interests, skills, location, and availability
- **Automated Action**: Automatically fills applications, submits forms, and initiates connections
- **Multi-LLM Support**: Works with OpenAI, Google Gemini, Cerebras, OpenRouter, and more

## Project Structure

```
OpenBrowserAI/
├── agent/              # Core agent code
│   ├── cli.js         # Command-line interface
│   ├── openBrowserai.js # Main agent logic
│   ├── browser.js     # Browser automation
│   ├── llm.js         # LLM integrations
│   └── prompt.js      # Prompts
├── opik/              # Opik evaluation framework
├── frontend/          # Next.js frontend
└── package.json
```

## Evaluation

To run the evaluation suite:

```bash
node opik/evaluate.js
```