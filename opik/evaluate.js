const { Opik, evaluate, BaseMetric } = require("opik");
const { browserEvaluationTask } = require("./task");

class Contains extends BaseMetric {
    constructor() {
        super("contains");
    }

    score({ output, expected_output }) {
        const score = output.toLowerCase().includes(expected_output.toLowerCase()) ? 1.0 : 0.0;
        return {
            name: this.name,
            value: score,
            reason: score === 1.0 ? "Output contains expected text" : "Output does not contain expected text"
        };
    }
}

const opikClient = new Opik();

async function runEvaluation() {
    const dataset = await opikClient.getOrCreateDataset("browser-tasks-2");
    
    await dataset.insert([{
        input: "Founder of etherum",
        expected_output: "vitalik"
    }]);
    
    const result = await evaluate({
        dataset,
        task: browserEvaluationTask,
        scoringMetrics: [new Contains()],
        experimentName: "Browser AI Evaluation"
    });
    
    console.log(`Experiment: ${result.experimentName}`);
    console.log(`Tests: ${result.testResults.length}`);
    result.testResults.forEach((test, i) => {
        console.log(`\nTest ${i + 1}:` , test);
        const input = test.testCase?.scoringInputs?.input;
        const output = test.testCase?.taskOutput?.output || test.testCase?.scoringInputs?.output;
        const expected_output = test.testCase?.scoringInputs?.expected_output
        console.log(`  Input: ${input}`);
        console.log(`  Output: ${output}`);
        console.log(`  Expected Output: ${expected_output}`);
        test.scoreResults?.forEach(s => console.log(`  ${s.name}: ${s.value}`));
    });
}

runEvaluation().catch(console.error);
module.exports = { runEvaluation };
