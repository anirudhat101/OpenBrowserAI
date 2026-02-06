#!/usr/bin/env node

const { OpenBrowserAI } = require('./openBrowserai');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: openbrowserai <task>');
    console.log('');
    console.log('Examples:');
    console.log('  openbrowserai "check the price of ETH on coingecko"');
    console.log('  openbrowserai "search for weather in New York"');
    process.exit(args.length === 0 ? 1 : 0);
  }
  
  const task = args.join(' ');
  
  try {
    console.log('Starting OpenBrowserAI...');
    console.log('Task:', task);
    console.log('');
    
    const result = await OpenBrowserAI(task);
    
    console.log('');
    console.log('=== Task Complete ===');
    console.log('Result:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
