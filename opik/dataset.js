const { Opik } = require("opik");
const { gemini } = require("../src/agent/llm");
const { BrowserController } = require("../src/agent/browser");

const opikClient = new Opik();

async function createEvaluationDataset() {
  const dataset = await opikClient.getOrCreateDataset("browser-automation-tasks");
  
  const testCases = [
    {
      input: "who is founder of ETH",
      expected_output: "Vitalik"
    },
    // {
    //   input: "btc vs eth which more USD price",
    //   expected_output: "btc"
    // }
  ];

  await dataset.insert(testCases);
  console.log(`Created dataset with ${testCases.length} test cases`);
  return dataset;
}

module.exports = { createEvaluationDataset };