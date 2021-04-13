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
    // Error Detection
    if(raw == ""){ return }; // output nothing when input is null

    // Input validity check to avoid eval() being used maliciously
    // 1. Reject input with invalid characters
    if(!(/^[\+\-\*\/0-9.]+$/.test(raw))){
        calOutput.innerText = "Syntax Error";
        return
    };

    result = eval(raw);
    if (result > 1000000000000 || result < -1000000000000){
        calOutput.innerText = "Overflow";
        return
    }
    else{
        calOutput.innerText = result;
    }

    // Negative Value Styling
    if (result < 0){
        calOutput.style.color = "rgb(253, 71, 71)";
    }
}

// Test Area
function testCal(inputStr){
    // Parse Input as (num,oper,num,oper,num...)
    let parsed = inputStr.split(/[^0-9]/g);
    console.log(parsed);
}

testCal("2+2-4");