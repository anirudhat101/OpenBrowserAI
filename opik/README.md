# Opik Evaluation for OpenBrowserAI

This folder contains the integration of Opik evaluation framework for the OpenBrowserAI browser automation agent.

## Files

- `dataset.js` - Defines evaluation test cases and dataset creation
- `task.js` - Implements the browser evaluation task logic
- `metrics.js` - Custom metrics for evaluating browser automation tasks
- `tracking.js` - Opik tracing integration for LLM calls
- `evaluate.js` - Main evaluation runner script

## Usage

### Run Full Evaluation
```bash
node opik/evaluate.js
```

### Run Quick Test
```bash
node opik/evaluate.js --quick
```

## Metrics

1. **Task Success Rate** - Measures if the browser task was completed successfully
2. **Step Efficiency** - Evaluates if the task was completed in an efficient number of steps
3. **Category Accuracy** - Checks if the task was classified correctly
4. **Error Rate** - Measures if any errors occurred during execution
5. **Execution Quality** - Overall quality score combining multiple factors

## Integration Notes

- The evaluation integrates with existing OpenBrowserAI code without major modifications
- Uses Opik tracing to monitor LLM calls and evaluation execution
- Metrics are tailored for browser automation tasks
- Supports both vision and non-vision based tasks

## Requirements

- Opik package installed (already in package.json)
- Valid environment variables for LLM providers
- Browser dependencies (Playwright)