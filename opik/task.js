const { gemini } = require("../src/agent/llm");
const { 
    BrowserController,
    getCompressedElements,
    executeActions,
    markBoundingBoxes,
    elementsToPromptCSVChunks,
    getDimentionOfElement,
    getPrivateData,
    highlightBox,
    captchaWaitcli
} = require("../src/agent/browser");

const { createPrompt } = require("../src/agent/prompt");

async function browserEvaluationTask(datasetItem) {
    const task = datasetItem.input;
    const useVision = datasetItem.requires_vision || false;
    
    let isDone = false;
    const privateData = {};
    let pageData = "";
    let information_gather_so_far = "";
    let previousTaskOutcome = "";
    let summary = "";
    let tabSummary = "Currently 0 tabs are open.";
    let pageNo = null;
    
    const b = new BrowserController();
    await b.initialize();
    
    let current_tab = b.pages.length;
    let stepsCounter = 0;
    const pageDataList = [];
    let currentUrl = "";
    
    let firstRes = await executeActions([{type: "openNewTab"}], b);
    let browserState = b.getBrowserState();
    let actionsLog = firstRes.actionLog;
    pageNo = 1;
    let compressedElement;
    
    let currentPageOfAgent;
    let askedChunk = 0;
    let isChunkActionAvailable = false;
    
    let visionData = {
        useVision: false,
        image: null 
    };
    
    const executionLog = [];
    let finalResult = "";
    let success = false;
    let error = null;
    
    try {
        const maxSteps = 25;
        while (!isDone && stepsCounter < maxSteps) {
            stepsCounter++;
            
            if (stepsCounter == 1) {
                compressedElement = await getCompressedElements(b.pages[pageNo-1]);
            }
            
            const prompt = createPrompt(
                pageData, task, information_gather_so_far, previousTaskOutcome, 
                summary, pageNo, tabSummary, getPrivateData(privateData), 
                currentUrl, actionsLog, stepsCounter, isChunkActionAvailable, 
                useVision, browserState
            );
            
            const res = await gemini(prompt, visionData);
            
            if (res.isWholegoalFinish) {
                isDone = true;
                finalResult = res.answer || "Task completed successfully";
                success = true;
                break;
            }
            
            if (res.isCaptcha) {
                await captchaWaitcli();
            } else {
                if (res.actions[0]?.x) {
                    await highlightBox(b.pages[pageNo-1], { 
                        x: res.actions[0].x, y: res.actions[0].y, 
                        w: res.actions[0].w, h: res.actions[0].h 
                    });
                }
                
                for (let i = 0; i < res.actions.length; i++) {
                    const _action = res.actions[i];
                    if (_action.type.toLowerCase() === "click" || _action.type.toLowerCase() === "type") {
                        const {x, y, w, h} = getDimentionOfElement(_action.id, compressedElement);
                        res.actions[i] = {...res.actions[i], x, y, w, h};
                    }
                }
                
                if (res.actions[0].type === "Screenshot") {
                    if (useVision) {
                        visionData.useVision = true;
                        const _PageNo = pageNo ? pageNo : 1;
                        visionData.image = await b.screenshotBase63(b.pages[_PageNo-1]);
                        const visionActionLog = "attached is the screenshot of the current page which you asked for in last step.";
                        actionsLog.push(visionActionLog);
                        information_gather_so_far += " " + res.information_gather_so_far;
                        summary += " " + res.Summary;
                        continue;
                    } else {
                        throw new Error("vision is not enabled but llm asked for it.");
                    }
                } else {
                    visionData.image = null;
                    visionData.useVision = false;
                }
                
                let exeRes = await executeActions(res.actions, b, privateData);
                askedChunk = exeRes.chunk;
                let _pageno = exeRes.pageNo ? exeRes.pageNo : pageNo;
                let _actionLog = exeRes.actionLog;
                actionsLog.push(..._actionLog);
                pageNo = _pageno;
                
                await b.pages[pageNo-1].bringToFront();
            }
            
            compressedElement = await getCompressedElements(b.pages[pageNo-1]);
            let pageDataInCsv = elementsToPromptCSVChunks(compressedElement, askedChunk);
            currentPageOfAgent = pageDataInCsv;
            
            function createPageDataPrompt(_pageDataCsv, chunk = 0) {
                let totalChunkInfo = "";
                let chunkPrompt = "if you want to see other chunk of current page then use the getPageDataChunk action. chunk number starts from 0. only use this when you think the data to answer or solve the main task can be in next chunk of page.";
                let isChunkActionAvailable = false;
                
                if (_pageDataCsv.totalChunks > 1) {
                    isChunkActionAvailable = true;
                    totalChunkInfo = chunkPrompt + " " + `The page data is big. SO attached page data is ${chunk}th of whole page data of current page. total chunks in page are ${_pageDataCsv.totalChunks} (which is 0 to ${_pageDataCsv.totalChunks - 1}). the ${chunk}th chunk page data is here:`;
                }
                
                const _pageDataStr = totalChunkInfo + _pageDataCsv.requestedChunk;
                return { pageDataStr: _pageDataStr, isChunkActionAvailable };
            }
            
            await markBoundingBoxes(b.pages[pageNo-1], compressedElement);
            pageDataList.push(pageDataInCsv.completePageData);
            
            const pageDataRes = createPageDataPrompt(pageDataInCsv, askedChunk);
            pageData = pageDataRes.pageDataStr;
            
            isChunkActionAvailable = pageDataRes.isChunkActionAvailable;
            information_gather_so_far += " " + res.information_gather_so_far;
            previousTaskOutcome = res.previousTaskOutcome;
            summary += " " + res.Summary;
            browserState = b.getBrowserState();
            currentUrl = b.pages[pageNo-1].url();
            
            executionLog.push({
                step: stepsCounter,
                action: res.actions,
                summary: res.Summary,
                information: res.information_gather_so_far
            });
        }
        
        if (!isDone && stepsCounter >= maxSteps) {
            finalResult = "Task did not complete within maximum steps";
            success = false;
        }
        
    } catch (err) {
        error = err.message;
        success = false;
        finalResult = `Error: ${err.message}`;
    } finally {
        await b.close();
    }
    
    return {
        output: finalResult,
        success,
        steps: stepsCounter,
        execution_log: executionLog,
        error,
        category: datasetItem.expected_category,
        complexity: datasetItem.complexity
    };
}

module.exports = { browserEvaluationTask };