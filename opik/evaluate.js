const { Opik, evaluate } = require("opik");
const { createEvaluationDataset } = require("./dataset");
const { browserEvaluationTask } = require("./task");
const { 
    ContainsMetric,
    AnswerQualityJudge
} = require("./metrics");
const { trackLLMCall, createEvaluationTrace, endEvaluationTrace } = require("./tracking");
const { gemini } = require("../src/agent/llm");

const opikClient = new Opik();

const trackedGemini = trackLLMCall(gemini, "gemini");

async function runEvaluation() {
    console.log("Starting Opik evaluation for OpenBrowserAI...");
    
    try {
        const dataset = await createEvaluationDataset();
        
        const metrics = [
            new ContainsMetric(),
            new AnswerQualityJudge()
        ];
        
        const evaluationTask = async (datasetItem) => {
            const trace = createEvaluationTrace("browser-automation", datasetItem);
            const startTime = Date.now();
            
            try {
                const result = await browserEvaluationTask(datasetItem);
                const executionTime = Date.now() - startTime;
                
                await endEvaluationTrace(trace, result, executionTime);
                return result;
                
            } catch (error) {
                const executionTime = Date.now() - startTime;
                const errorResult = {
                    output: `Evaluation failed: ${error.message}`,
                    success: false,
                    steps: 0,
                    error: error.message,
                    category: "error",
                    complexity: datasetItem.complexity || "unknown"
                };
                
                await endEvaluationTrace(trace, errorResult, executionTime);
                return errorResult;
            }
        };
        
        const result = await evaluate({
            dataset,
            task: evaluationTask,
            scoringMetrics: metrics,
            experimentName: "OpenBrowserAI Evaluation",
            projectName: "browser-automation",
            nbSamples: 2
        });
        
        console.log("Evaluation completed successfully!");
        console.log(`Experiment ID: ${result.experimentId}`);
        console.log(`Experiment Name: ${result.experimentName}`);
        console.log(`Total test cases: ${result.testResults.length}`);
        
        console.log("\n=== Evaluation Results ===");
        console.log("Test Results Summary:");
        result.testResults.forEach((testResult, index) => {
            console.log(`Test ${index + 1}:`);
            const datasetItem = testResult.datasetItem || testResult.input;
            const taskOutput = testResult.taskOutput || testResult.output;
            
            console.log(`  Input: ${datasetItem?.input || 'N/A'}`);
            console.log(`  Output: ${taskOutput?.output?.substring(0, 100) || 'N/A'}...`);
            if (testResult.scoreResults) {
                testResult.scoreResults.forEach(score => {
                    console.log(`  ${score.name}: ${score.value} - ${score.reason}`);
                });
            }
            console.log("");
        });
        
        console.log(`\nView detailed results in Opik UI: https://www.comet.com/opik`);
        
    } catch (error) {
        console.error("Evaluation failed:", error);
        throw error;
    }
}

async function runQuickTest() {
    console.log("Running quick evaluation test...");
    
    const testDatasetItem = {
        input: "Navigate to google.com and search for 'artificial intelligence'.",
        expected_category: "search_navigation",
        complexity: "simple",
        requires_vision: false
    };
    
    try {
        const result = await browserEvaluationTask(testDatasetItem);
        console.log("Quick test result:", {
            success: result.success,
            steps: result.steps,
            output: result.output?.substring(0, 200) + "...",
            category: result.category
        });
        return result;
    } catch (error) {
        console.error("Quick test failed:", error);
        throw error;
    }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes("--quick")) {
        runQuickTest().catch(console.error);
    } else if (args.includes("--help")) {
        console.log("Usage: node opik/evaluate.js [options]");
        console.log("Options:");
        console.log("  --quick    Run quick test instead of full evaluation");
        console.log("  --help     Show this help message");
    } else {
        runEvaluation().catch(console.error);
    }
}

module.exports = { runEvaluation, runQuickTest };