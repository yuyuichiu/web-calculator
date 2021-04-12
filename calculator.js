// Global Variable Declarations

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
function calExecute(raw){
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

// calExecute("8 / 2 + 3 * 4 - 6");
// calExecute("4528 / 2 + 3 * 4 - 6");
// calExecute("1248 / (2 + (3) * 4) - 6");
// calExecute("8 / 232 + 3 * 4 - 6");
// calExecute("8 / 2 + 3 * 4 - 6");