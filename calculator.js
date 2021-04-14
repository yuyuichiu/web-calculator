// Global Variable Declarations
var dark = false;

// Shortcut Manager
document.addEventListener("keyup", function(e){
    switch(e.key){
        case 'Enter':
            calCheck();
            break;
        case 'Delete':
            clearInput();
            break;
        default:
            // gets executed if no case is matched
            console.log(e.key);
    }
});

// Loading Screen
function loadDone(){
    let loadScreen = document.getElementById("loading");
    loadScreen.style.visibility = "hidden";
    loadScreen.style.opacity = "0";
    loadScreen.style.height = "0";
}

// Dark Mode
function darkMode(){
    let bgLayer = document.getElementById("bg-layer");
    let myHeader = document.getElementById("myHeader");
    let calBody = document.getElementById("cal-body");

    if(!dark){
        bgLayer.style.opacity = 1;
        myHeader.style.color = "rgb(255, 245, 160)";
        calBody.style.background = "rgba(204, 203, 198, 0.45)";
        dark = true;
    }
    else{
        bgLayer.style.opacity = 0;
        myHeader.style.color = "rgb(35, 115, 161)";
        calBody.style.background = "rgba(255, 255, 255, 0.45)";
        dark = false;
    }
}

// Button click inputs
function calWrite(order){
    let calInput = document.getElementById("calInput");
    calInput.value += order;
}
// Random
function randomInput(){
    let calInput = document.getElementById("calInput");
    calInput.value += "®";
}
// Delete input (1 char)
function deleteInput(){
    let calInput = document.getElementById("calInput");
    calInput.value = calInput.value.slice(0,calInput.value.length-1,);
}
// Clear inputs
function clearInput(){
    let calInput = document.getElementById("calInput");
    let calOutput = document.getElementById("calOutput");
    calInput.value = "";
    calOutput.innerText = "0";
    calOutput.style.color = "rgb(44, 44, 44)";
}

// Calculation Procedures
function calCheck(){
    var raw = document.getElementById("calInput").value;
    var calOutput = document.getElementById("calOutput");
    calOutput.style.color = "rgb(44, 44, 44)";

    /*   Error Detection before putting to calculate   */
    // 1. Do nothing when input is null
    if(raw == ""){ return }
    // 2. Throw syntax error for invalid brackets
    if(isBracketError(raw)){
        calOutput.innerText = "Syntax Error";
        return }
    // 3. Translate Symbols
    raw = raw.replace(/[x]/g,"*");
    raw = raw.replace(/[÷]/g,"/");
    raw = raw.replace(/[\^]/g,"**");
    // 4. Turn Random symbol into number (0~1)
    while(/[®]/.test(raw)){
        let rand = Math.floor(Math.random()*101) / 100;
        raw = raw.replace(/[®]/,rand);
    }
    // 5. Eliminate whitespaces
    raw = raw.replace(/[ ]/g,"");
    // 6a) Reject input with invalid characters
    // 6b) Reject input that ends invalidly
    if(!(/^[\(\)\+\-\*\/0-9.]+$/.test(raw)) || !(/[0-9.\)]$/).test(raw)){
        calOutput.innerText = "Syntax Error";
        return }
    /*   End of Error Detection   */
    calExecute(raw);
}

function calExecute(raw){
    result = eval(raw);
    if (result > 1000000000000 || result < -1000000000000){
        calOutput.innerText = "Overflow";
        return
    }
    else{ calOutput.innerText = result; }

    // Negative Value Styling
    if (result < 0){ calOutput.style.color = "rgb(253, 71, 71)"; }
}

function isBracketError(inputStr){
    let leftBrc = 0; 
    let rightBrc = 0;
    // Check if there is any brackets ok
    if(!(/[\(\)]/.test(inputStr))){ return false }
    // Bracket Position Test ok
    let brackets = inputStr.match(/[\(\)]/g)
    for(i = 0; i < brackets.length; i++){
        brackets[i] === "(" ? leftBrc++ : rightBrc++;
        if(rightBrc > leftBrc){ return true }
    }
    return false
}

// Test Area ========================================================
function calProcess(inputStr){
    let rawStr = inputStr;
    const brPatLocal = /\([0-9\+\-\*\/]*\)/
    console.log(rawStr);

    while(brPatLocal.test(rawStr)){
        let hold = rawStr.match(brPatLocal)[0];
        holdNum = hold.replace(/[\(\)]/g,"");
        let baked = asmd(holdNum);
        rawStr = rawStr.replace(hold,baked);
    }

    return asmd(rawStr)
}

function asmd(inputStr){
    rawStr = inputStr;
    // Parse multiples and divisions
    const mdPatLocal = /([0-9.]+)([\*\/\^])([0-9.]+)/
    while(mdPatLocal.test(rawStr)){
       let mdComb = rawStr.match(mdPatLocal);
       // Extract Fragments of input
       n1 = Number(mdComb[0].match(/[0-9.]+(?=[\*\/\^])/)[0]);
       op = mdComb[0].match(/[\*\/\^]/)[0];
       n2 = Number(mdComb[0].match(/(?<=[\*\/\^])[0-9.]+/)[0]);
       // Calculate
       let mdAns = op === "^" ? n1 ** n2 : op === "*" ? n1 * n2 : n1 / n2;
       rawStr = rawStr.replace(mdPatLocal,String(mdAns));
    }
    
    // Parse additions and subtractions
    const asPatLocal = /([0-9.]+)([\+\-])([0-9.]+)/
    while(asPatLocal.test(rawStr)){
       let asComb = rawStr.match(asPatLocal);
       // Extract Fragments of input
       n1 = Number(asComb[0].match(/[0-9.]+(?=[\+\-])/)[0]);
       op = asComb[0].match(/[\+\-]/)[0];
       n2 = Number(asComb[0].match(/(?<=[\+\-])[0-9.]+/)[0]);
       //Calculate
       let asAns = op === "+" ? n1 + n2 : n1 - n2;
       rawStr = rawStr.replace(asPatLocal,String(asAns));
    }

    return rawStr
}