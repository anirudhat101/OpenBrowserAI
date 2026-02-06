const { BaseMetric, Hallucination } = require("opik");

class ContainsMetric extends BaseMetric {
    constructor() {
        super("contains");
    }

    score(taskOutput, datasetItem) {
        const expected = datasetItem.expected_output;
        const actual = taskOutput.output;
        
        const score = actual.toLowerCase().includes(expected.toLowerCase()) ? 1.0 : 0.0;
        
        return {
            name: this.name,
            value: score,
            reason: `Expected to contain "${expected}" in output "${actual}"`
        };
    }
}

class AnswerQualityJudge extends BaseMetric {
    constructor() {
        super("answer_quality_judge");
    }

    async score(taskOutput, datasetItem) {
        hallucinationMetric = new Hallucination();
        
        const result = await hallucinationMetric.score({
            input: datasetItem.input,
            output: taskOutput.output,
            context: `Expected output should contain: ${datasetItem.expected_output}`
        });
        
        return result;
    }
}

module.exports = {
    ContainsMetric,
    AnswerQualityJudge
};