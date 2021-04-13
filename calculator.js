// Global Variable Declarations

// Shortcut Manager
document.addEventListener("keyup", function(e){
    switch(e.key){
        case 'Enter':
            calExecute();
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
    loadScreen = document.getElementById("loading");
    loadScreen.style.visibility = "hidden";
    loadScreen.style.opacity = "0";
    loadScreen.style.height = "0";
}

// Button click inputs
function calWrite(order){
    let calInput = document.getElementById("calInput");
    calInput.value += order;
}

// Clear inputs
function clearInput(){
    let calInput = document.getElementById("calInput");
    let calOutput = document.getElementById("calOutput");
    calInput.value = "";
    calOutput.innerText = "0";
    calOutput.style.color = "rgb(44, 44, 44)";
}

// Calculation
function calExecute(){
    var raw = document.getElementById("calInput").value;
    var calOutput = document.getElementById("calOutput");
    calOutput.style.color = "rgb(44, 44, 44)";
    // Translate Symbols to operators
    raw = raw.replace(/[x]/g,"*");
    raw = raw.replace(/[÷]/g,"/");
    // Do nothing when input is null
    if(raw == ""){ return }

    // a) Reject input with invalid characters
    // b) Reject input with ends invalidly with operator
    if(!(/^[\+\-\*\/0-9.]+$/.test(raw)) || !(/[0-9.]$/).test(raw)){
        calOutput.innerText = "Syntax Error";
        return
    }

    result = eval(raw);
    if (result > 1000000000000 || result < -1000000000000){
        calOutput.innerText = "Overflow";
        return
    }
    else{ calOutput.innerText = result; }

    // Negative Value Styling
    if (result < 0){ calOutput.style.color = "rgb(253, 71, 71)"; }
}

// Test Area ========================================================
var n1, n2, op;

function testCal(inputStr){
    rawStr = inputStr;
    // Parse multiples and divisions
    const mdPatLocal = /([0-9.]+)([\*\/])([0-9.]+)/
     
    while(mdPatLocal.test(rawStr)){
       let mdComb = rawStr.match(mdPatLocal);
       // Calculate pair
       n1 = Number(mdComb[0].match(/[0-9.]+(?=[\*\/])/)[0]);
       op = mdComb[0].match(/[\*\/]/)[0];
       n2 = Number(mdComb[0].match(/(?<=[\*\/])[0-9.]+/)[0]);
       
       let mdAns = null;
       if(op === "*"){
          mdAns = n1 * n2;
       }
       else{
          mdAns = n1 / n2;
       }
       rawStr = rawStr.replace(mdPatLocal,String(mdAns));
    }
    console.log("*/: " + rawStr)
    
    // Parse additions and subtractions
    const asPatLocal = /([0-9.]+)([\+\-])([0-9.]+)/
    while(asPatLocal.test(rawStr)){
       let asComb = rawStr.match(asPatLocal);
       // Calculate pair
       n1 = Number(asComb[0].match(/[0-9.]+(?=[\+\-])/)[0]);
       op = asComb[0].match(/[\+\-]/)[0];
       n2 = Number(asComb[0].match(/(?<=[\+\-])[0-9.]+/)[0]);
       
       let asAns = null;
       if(op === "+"){
          asAns = n1 + n2;
       }
       else{
          asAns = n1 - n2;
       }
       rawStr = rawStr.replace(asPatLocal,String(asAns));
    }
    console.log("+-: " + rawStr)
}