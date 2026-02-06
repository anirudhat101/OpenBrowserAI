const { Opik } = require("opik");

const opikClient = new Opik();

function trackLLMCall(originalLLMFunction, functionName) {
    return async function(prompt, visionData) {
        const trace = opikClient.trace({
            name: `${functionName} LLM Call`,
            input: { 
                prompt: prompt.substring(0, 1000), 
                useVision: visionData.useVision,
                prompt_length: prompt.length
            },
        });

        try {
            const result = await originalLLMFunction.call(this, prompt, visionData);
            
            trace.end({
                output: { 
                    response: result, 
                    function_name: functionName,
                    response_type: typeof result
                },
            });

            return result;
        } catch (error) {
            trace.end({
                output: { 
                    error: error.message,
                    function_name: functionName
                },
            });
            throw error;
        } finally {
            await opikClient.flush();
        }
    };
}

function createEvaluationTrace(taskName, datasetItem) {
    return opikClient.trace({
        name: `Evaluation: ${taskName}`,
        input: {
            task: datasetItem.input,
            expected_category: datasetItem.expected_category,
            complexity: datasetItem.complexity
        },
        tags: ["evaluation", taskName, datasetItem.complexity]
    });
}

async function endEvaluationTrace(trace, result, executionTime) {
    trace.end({
        output: {
            success: result.success,
            steps: result.steps,
            execution_time_ms: executionTime,
            output: result.output,
            category: result.category,
            error: result.error
        }
    });
    await opikClient.flush();
}

module.exports = {
    trackLLMCall,
    createEvaluationTrace,
    endEvaluationTrace
};