// Global Variable Declarations

// Loading Screen
function loadDone(){
    loadScreen = document.getElementById("loading");
    loadScreen.style.visibility = "hidden";
    loadScreen.style.opacity = "0";
}

// Button click inputs
function calWrite(order){
    calInput = document.getElementById("calInput");
    calInput.value += order;
}

function clearInput(){
    calInput = document.getElementById("calInput");
    calInput.value = "";
}

// Calculation
function calExecute(raw){
    var raw = document.getElementById("calInput").value;
    var calOutput = document.getElementById("calOutput");
    // Translate Symbols to math commands
    raw = raw.replace("x","*");
    raw = raw.replace("÷","/");
    // Error Detection
    if(raw == ""){ return }; // do nothing when input is null

    // Check if input does not contain unexpected input
    // Proceed only with valid input to avoid eval() being used maliciously
    if(!(/^[\+\-\*\/0-9]+$/.test(raw))){
        calOutput.innerText = "ERROR";
        return
    };

    calOutput.innerText = eval(raw);
}

// calExecute("8 / 2 + 3 * 4 - 6");
// calExecute("4528 / 2 + 3 * 4 - 6");
// calExecute("1248 / (2 + (3) * 4) - 6");
// calExecute("8 / 232 + 3 * 4 - 6");
// calExecute("8 / 2 + 3 * 4 - 6");