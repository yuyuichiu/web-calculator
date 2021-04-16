// Global Variable Declarations
var dark = false;
var calOutput = document.getElementById("calOutput");

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
            // console.log(e.key);
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
        dark = true;
    }
    else{
        bgLayer.style.opacity = 0;
        myHeader.style.color = "rgb(35, 115, 161)";
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

// Vaildation Procedures befre sent to calculate
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
    // 4. Turn Random symbol into number (0~1)
    while(/[®]/.test(raw)){
        let rand = Math.floor(Math.random()*101) / 100;
        raw = raw.replace(/[®]/,rand);
    }
    // 5. Eliminate whitespaces
    raw = raw.replace(/[ ]/g,"");
    // 6a) Reject input with invalid characters
    // 6b) Reject input that ends invalidly
    if(!(/^[\(\)\+\-\*\/\^0-9.]+$/.test(raw)) || !(/[0-9.\)]$/).test(raw)){
        calOutput.innerText = "Syntax Error";
        return }
    /*   End of Error Detection   */
    console.log("Sent: " + raw);
    calProcess(raw);
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
}     /*   end of vaildation   */

// Calculation 
function calProcess(inputStr){
    let rawStr = inputStr;
    // brPatLocal searches for bracket operations
    const brPatLocal = /\([0-9\+\-\*\/\^]*\)/

    // Perform calExe to bracket operations while they exist
    while(brPatLocal.test(rawStr)){
        let hold = rawStr.match(brPatLocal)[0];
        // Parse the content within brackets
        holdNum = hold.replace(/[\(\)]/g,"");
        // and sent to calExe to get answer
        let baked = calExe(holdNum);
        // Replace processed answer to operation
        rawStr = rawStr.replace(hold,baked);
    }

    // Calculate operation without brackets
    let finalAns = calExe(rawStr);
    // Sent answer to display function
    calAnsDisplay(finalAns);
}

function calExe(inputStr){
    // Multiplication and division before addition and subtraction
    // Bracket issue will be handled by calProcess()
    rawStr = inputStr;
    // 1. Factor
    const facPatLocal = /([0-9.]+)([\^])([0-9.]+)/
    // while multiplication and division pattern exist...
    while(facPatLocal.test(rawStr)){
        // Extract Pattern of (a^b)
        let facComb = rawStr.match(facPatLocal);
        // Turn line of patterns into fragments
        n1 = Number(facComb[0].match(/[0-9.]+(?=[\*\/\^])/)[0]);
        op = facComb[0].match(/[\*\/\^]/)[0];
        n2 = Number(facComb[0].match(/(?<=[\*\/\^])[0-9.]+/)[0]);
        // Calculate the fragment
        let facAns = n1 ** n2;
        // Replace the line with answer
        rawStr = rawStr.replace(facPatLocal,String(facAns));
    }
    // 2. Deal with (factors,) multiples and divisions
    const mdPatLocal = /([0-9.]+)([\*\/])([0-9.]+)/
    // while multiplication and division pattern exist...
    while(mdPatLocal.test(rawStr)){
        // Extract Pattern of (a*b) / (a/b)
        let mdComb = rawStr.match(mdPatLocal);
        console.log("In Cal" + mdComb[0]);
        // Turn line of patterns into fragments
        n1 = Number(mdComb[0].match(/[0-9.]+(?=[\*\/\^])/)[0]);
        op = mdComb[0].match(/[\*\/\^]/)[0];
        n2 = Number(mdComb[0].match(/(?<=[\*\/\^])[0-9.]+/)[0]);
        // Calculate the fragment
        let mdAns = op === "^" ? n1 ** n2 : op === "*" ? n1 * n2 : n1 / n2;
        // Replace the line with answer
        rawStr = rawStr.replace(mdPatLocal,String(mdAns));
    }
    
    // 3. Deal with additions and subtractions
    const asPatLocal = /([0-9.]+)([\+\-])([0-9.]+)/
    // while additional and substraction pattern exist...
    while(asPatLocal.test(rawStr)){
        // Extract Pattern of (a+b) / (a-b)
        let asComb = rawStr.match(asPatLocal);
        // Line of pattern into fragments
        n1 = Number(asComb[0].match(/[0-9.]+(?=[\+\-])/)[0]);
        op = asComb[0].match(/[\+\-]/)[0];
        n2 = Number(asComb[0].match(/(?<=[\+\-])[0-9.]+/)[0]);
        // Calculate the fragment
        let asAns = op === "+" ? n1 + n2 : n1 - n2;
        // Replace the line with answer
        rawStr = rawStr.replace(asPatLocal,String(asAns));
    }

    return rawStr // Return subset answer
}

function calAnsDisplay(inputStr){
    let finalAns = Number(inputStr);
    let calOutput = document.getElementById("calOutput");
    // Overflow Handling
    if (finalAns > 1000000000000 || finalAns < -1000000000000){
        calOutput.innerText = "Overflow";
        return
    }
    else{ calOutput.innerText = finalAns; }

    // Negative Value Styling
    if (finalAns < 0){ calOutput.style.color = "rgb(253, 71, 71)"; }
}

// Unused Func Area ========================================================
function calExecute(raw){
    // Calculation


    // Overflow Handling
    if (finalAns > 1000000000000 || finalAns < -1000000000000){
        calOutput.innerText = "Overflow";
        return
    }
    else{ calOutput.innerText = finalAns; }

    // Negative Value Styling
    if (finalAns < 0){ calOutput.style.color = "rgb(253, 71, 71)"; }
}