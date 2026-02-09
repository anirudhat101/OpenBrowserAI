# OpenBrowserAI - Open Source Browser AI Agent For volunteer matching

OpenBrowserAI is an AI agent that uses real browser automation to help people / volunteer discover, connect with, and take action on causes that matter to them.

<img width="1869" height="809" alt="image" src="https://github.com/user-attachments/assets/7c37ad2b-f5c4-418f-acaf-cff1b1ac5295" />


## Demo

Watch the demo video: [OpenBrowserAI Demo](https://drive.google.com/file/d/1H8ocpMhVtr5twvEHcH1OkLC8-s3eQDKa/view?usp=sharing)

## Installation

### Option 1: Install Globally via npm

```bash
 npm install -g openbrowseraicli@latest
```

```bash
npx playwright install  
```

### Using Global CLI (if installed globally)

After global installation, you can run:

```bash
openbrowserai "find education wellness volunteer program in US"
```

### Option 2: Clone and Install Locally

```bash
git clone https://github.com/anirudhat101/OpenBrowserAI.git
cd OpenBrowserAI
npm install
```

```bash
npx playwright install  
```

Environment Variables (optional: unless you want to run opik integration and its evalution)

Create a `.env` file in the root directory as per .env.example file.

```
LLM_PROVIDER="cera" 

OPIK_URL_OVERRIDE=
OPIK_PROJECT_NAME=
OPIK_API_KEY=
OPIK_WORKSPACE=

OPIK_DISABLED=
```


If you cloned the repository:

```bash
# Run directly
node agent/cli.js "find education wellness volunteer program in US"
```


## Example Commands

```bash
# Find volunteer opportunities
openbrowserai "find education wellness volunteer program in US"

# Search for environmental causes
openbrowserai "find environmental conservation projects near me"

# Look for community initiatives
openbrowserai "find community service opportunities in New York"

# Discover social causes
openbrowserai "find food bank volunteer opportunities"
```

## Encode Track participation

1. Social & Community Impact
2. Best Use of Opik

## Architecture
```
User Task → Agent Loop → LLM → Browser Actions → Output
                ↑_________________↓
                    (feedback loop)
```

## How It Works

### 1. Task Input
User provides a natural language task (e.g., *"find education wellness volunteer program in US"*)

### 2. Agent Loop
The agent runs an iterative loop until the task is complete:
- **Observe**: Captures current page state (elements, text, URL)
- **Reason**: LLM analyzes the page and decides next actions
- **Act**: Executes actions (click, type, navigate, screenshot)
- **Learn**: Updates context with gathered information

### 3. Browser Actions
- Navigate to URLs
- Click elements by ID
- Type text into forms
- Take screenshots (vision mode)
- Open/manage multiple tabs
- Extract page data in chunks

### 4. Multi-LLM Support
Works with Gemini, Cerebras, OpenRouter, and HuggingFace models

## Opik Integration

### Tracing
Opik tracks the entire browser session:
- **Trace**: One trace per browser task with input/output
- **Spans**: Each step of the agent loop is a span
- **LLM Spans**: Every LLM call is tracked with prompt and response

```javascript
const trace = opikClient.trace({
  name: "Browser Task",
  input: { task },
  tags: ["browser-automation"]
});
```

### Evaluation
Run automated evaluations:
```bash
node opik/evaluate.js
```

Metrics tracked:
- Task Success Rate
- Step Efficiency
- Execution Quality

### Configuration
Set environment variables to enable:
```
OPIK_API_KEY=your_key
OPIK_WORKSPACE=your_workspace
OPIK_PROJECT_NAME=OpenBrowserAI
```

## Why This Matters

Millions of people want to volunteer or contribute to social and environmental
causes, but discovering trustworthy, relevant opportunities is time-consuming
and fragmented across multiple platforms.

OpenBrowserAI removes this friction by automatically browsing verified volunteer
platforms and connecting people to real opportunities they can act on
immediately.


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
[note : you need to add opik env and configuration if you want to do the evalution].
```bash
node opik/evaluate.js

```
