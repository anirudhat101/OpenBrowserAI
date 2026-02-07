#!/usr/bin/env node

const { OpenBrowserAI } = require('./openBrowserai');
const readline = require('readline');

const LOGO = `
╔═══════════════════════════════════════╗
║     🤖 OpenBrowserAI Chat v1.0        ║
║   AI-Powered Browser Automation       ║
╚═══════════════════════════════════════╝
`;

const COMMANDS = {
  exit: ['exit', 'quit', 'q'],
  clear: ['clear', 'cls'],
  help: ['help', 'h', '?']
};

function showHelp() {
  console.log('\n📖 Commands:');
  console.log('  <task>     - Execute a browser task');
  console.log('  exit/quit  - Exit the application');
  console.log('  clear      - Clear the screen');
  console.log('  help       - Show this help\n');
}

function clearScreen() {
  console.clear();
  console.log(LOGO);
}

function isCommand(input, cmds) {
  return cmds.includes(input.toLowerCase().trim());
}

async function runTask(task, rl) {
  console.log('\n🚀 Executing:', task);
  console.log('─'.repeat(50));
  
  try {
    const result = await OpenBrowserAI(task);
    console.log('─'.repeat(50));
    console.log('✅ Result:', result);
    console.log('');
  } catch (error) {
    console.log('─'.repeat(50));
    console.error('❌ Error:', error.message);
    console.log('');
  }
}

function prompt(rl) {
  rl.question('💬 > ', async (input) => {
    const trimmed = input.trim();
    
    if (!trimmed) {
      prompt(rl);
      return;
    }
    
    if (isCommand(trimmed, COMMANDS.exit)) {
      console.log('\n👋 Goodbye!');
      rl.close();
      process.exit(0);
    }
    
    if (isCommand(trimmed, COMMANDS.clear)) {
      clearScreen();
      prompt(rl);
      return;
    }
    
    if (isCommand(trimmed, COMMANDS.help)) {
      showHelp();
      prompt(rl);
      return;
    }
    
    await runTask(trimmed, rl);
    prompt(rl);
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(LOGO);
    showHelp();
    console.log('Usage: openbrowserai [task]');
    console.log('       openbrowserai         (interactive mode)\n');
    process.exit(0);
  }
  
  // Single task mode
  if (args.length > 0) {
    const task = args.join(' ');
    console.log(LOGO);
    await runTask(task, null);
    process.exit(0);
  }
  
  // Interactive chat mode
  console.log(LOGO);
  console.log('Type your task or "help" for commands\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  prompt(rl);
}

main();
