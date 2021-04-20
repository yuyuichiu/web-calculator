// Global Variable Declarations
var dark = false;
var calOutput = document.getElementById("calOutput");
// var MyCal = class Calculator{ ... }

// Shortcut Manager
document.addEventListener("keyup", function(e){
    switch(e.key){
        case 'Enter':
            MyCal.calCheck();
            break;
        case 'Delete':
            MyCal.clearInput();
            break;
        case 'a':
            assertion();
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

/*    Calculator Class    */
class Calculator{
    constructor(formulaStorage, ansStorage, formulaTemp, ansTemp,n1,op,n2){
        this.formulaStorage = [];
        this.ansStorage = [];
        this.formulaTemp = [];
        this.ansTemp = [];
        this.n1 = n1;
        this.op = op;
        this.n2 = n2;
    }

    // Button click inputs
    calWrite(order){
        let calInput = document.getElementById("calInput");
        calInput.value += order;
    }
    // Random
    randomInput(){
        let calInput = document.getElementById("calInput");
        calInput.value += "®";
    }
    // Delete input (1 char)
    deleteInput(){
        let calInput = document.getElementById("calInput");
        calInput.value = calInput.value.slice(0,calInput.value.length-1,);
    }
    // Clear inputs
    clearInput(){
        let calInput = document.getElementById("calInput");
        let calOutput = document.getElementById("calOutput");
        calInput.value = "";
        calOutput.innerText = "0";
        calOutput.style.color = "rgb(44, 44, 44)";
    }

    // Vaildation Procedures before sent to calculate
    calCheck(){
        var raw = document.getElementById("calInput").value;
        var calOutput = document.getElementById("calOutput");
        calOutput.style.color = "rgb(44, 44, 44)";

        /*   Error Detection before putting to calculate   */
        // 1. Do nothing when input is null
        if(raw == ""){ return }
        // 2. Throw syntax error for invalid brackets
        if(this.isBracketError(raw)){
            calOutput.innerText = "Syntax Error";
            return }
        // 3. Throw syntax error for invalid dots (e.g 0..1 is not valid)
        if(/\.{2,}/.test(raw)){
            calOutput.innerText = "Syntax Error";
            return }
        // 4. Throw syntax error for unreasonable operators (e.g. ---5)
        if(/[\+\-]{3,}/.test(raw)){
            calOutput.innerText = "Syntax Error";
            return 
        }
        // 5. Translate Symbols
        raw = raw.replace(/[x]/g,"*");
        raw = raw.replace(/[÷]/g,"/");
        while(/[®]/.test(raw)){
            // Turning "Rand" symbols into number (0~1)
            let rand = Math.floor(Math.random()*101) / 100;
            raw = raw.replace(/[®]/,rand);
        }
        // 6. Eliminate whitespace
        raw = raw.replace(/[ ]/g,"");
        console.log("Origin: " + raw);
        // 7. Handle double operators
        let newOp = null;
        while(/[\-\+]{2,}/.test(raw)){
            let e = raw.match(/[\+\-]{2}/)[0];
            switch(e){
                case "++":
                case "--":
                    newOp = "+";
                    break;
                case "+-":
                case "-+":
                    newOp = "-";
                    break;
            }
            raw = raw.replace(/[\+\-]{2}/,newOp);
        }
        // 6. Bracket multiples and division pairs to avoid unexpected results
        raw = raw.replace(/([0-9.]+[\*\/][\-]?[0-9]+)/g,"($1)");
        raw = raw.replace(/([0-9.]+[\*\/][\-]?\([0-9\+\-\*\/]+\))/g,"($1)");
        // 7. Turn +(n) || -(n) into +1(n) and -1(n)
        raw = raw.replace(/([\+\-])[\(]/g,"$11(");
        // 8. Apply implied multiplication "n(" || ")("
        let im = /([\-]?[0-9.]+)([\(][\-]?[0-9.]+)|(\))(\()/;
        while(im.test(raw)){
            raw = raw.replace(/([\-]?[0-9.]+)([\(][\-]?[0-9.]+)/,"$1*$2");
            raw = raw.replace(/(\))(\()/,"$1*$2");
        }
        // 8i. Bracket newly created multiplications and divisions
        raw = raw.replace(/([0-9.]+[\*\/][\-]?[0-9]+)/g,"($1)");
        raw = raw.replace(/([0-9.]+[\*\/][\-]?\([0-9\+\-\*\/]+\))/g,"($1)");
        // 9a. Reject Input with invalid operator syntax
        if(/[\+\-]{3,/.test(raw)){
            calOutput.innerText = "Syntax Error";
            return 
        }
        // 9b. Reject input with invalid characters / ends invalidly
        if(!(/^[\(\)\+\-\*\/\^0-9.]+$/.test(raw)) || !(/[0-9.\)]$/.test(raw))){
            console.log(raw);
            calOutput.innerText = "Syntax Error";
            return }
        /*   End of Error Detection   */
        console.log("Sent: " + raw);
        this.calProcess(raw);
    }

    bracketProcessor(str){
        console.log("Original: " + str);
        // add bracket to first negative number
        str = str.replace(/(^[\-][0-9]+)/,"($1)");
        // add bracket to double operators
        str = str.replace(/([\+\-])([\+\-])([0-9]+)/g,"$1($2$3)");
        // add "*" to implied multiplications -2(-3) => (-2*-3)
        str = str.replace(/(?<=[0-9])\(/g,"*(");
        // add bracket to valid '*', '/', '^' pairs
        str = str.replace(/([\(]*[\-]?[0-9.\)]+[\*\/\^][\-]?[0-9.]+)/g,"($1)");
        // deal with -(-n)
        str = str.replace(/([\-][\(])([\-]?[0-9]+)/,"-1*($2");

        return str
    }

    isBracketError(inputStr){
        let leftBrc = 0; 
        let rightBrc = 0;
        // Check if there is any brackets ok
        if(!(/[\(\)]/.test(inputStr))){ return false }
        // Bracket Position Test ok
        let brackets = inputStr.match(/[\(\)]/g);
        for(let i = 0; i < brackets.length; i++){
            brackets[i] === "(" ? leftBrc++ : rightBrc++;
            if(rightBrc > leftBrc){ return true }
        }
        return false
    }     /*   end of validation   */

    // Calculation 
    calProcess(inputStr){
        // PEDMAS - parenthesis, exponents, multiplication|division, addition|subtraction
        let rawStr = inputStr;
        // brPatLocal - searches for brackets
        const brPatLocal = /\([0-9\+\-\*\/\^]*\)/

        // Perform calExe to bracket operations while they exist
        while(brPatLocal.test(rawStr)){
            let hold = rawStr.match(brPatLocal)[0];
            // Parse the content within brackets
            let holdNum = hold.replace(/[\(\)]/g,"");
            // and sent to calExe to get answer
            let baked = this.calExe(holdNum);
            // Replace processed answer to operation
            rawStr = rawStr.replace(hold,baked);
        }
        console.log("After clearing brackets " + rawStr);

        // Calculate operation without brackets
        let finalAns = this.calExe(rawStr);

        // Sent answer to display function
        this.calAnsDisplay(finalAns);

        // Store formula & answer to memory cache, while clearing temp data
        if(this.calAnsDisplay(finalAns) !== "error"){ 
            this.formulaStorage.push(inputStr);
            this.ansStorage.push(finalAns);
            this.formulaTemp = [];
            this.ansTemp = [];
        }
    }

    calExe(inputStr){
        // Multiplication and division before addition and subtraction
        // Bracket issue will be handled by calProcess()
        let rawStr = inputStr;
        // 1. Factor
        const facPatLocal = /([\-]?[0-9.]+)([\^])([\-]?[0-9.]+)/
        // while multiplication and division pattern exist...
        while(facPatLocal.test(rawStr)){
            // Extract Pattern of (a^b)
            let facComb = rawStr.match(facPatLocal);
            // Turn line of patterns into fragments
            this.n1 = Number(facComb[0].match(/[\-]?[0-9.]+(?=[\^])/)[0]);
            this.op = facComb[0].match(/[\^]/)[0];
            this.n2 = Number(facComb[0].match(/(?<=[\^])[\-]?[0-9.]+/)[0]);
            // Calculate the fragment
            let facAns = this.n1 ** this.n2;
            // Replace the line with answer
            rawStr = rawStr.replace(facPatLocal,String(facAns));
        }

        // 2. Deal with (factors,) multiples and divisions
        const mdPatLocal = /([\-]?[0-9.]+)([\*\/])([\-]?[0-9.]+)/
        // while multiplication and division pattern exist...
        while(mdPatLocal.test(rawStr)){
            // Extract Pattern of (a*b) / (a/b)
            let mdComb = rawStr.match(mdPatLocal);
            // Turn line of patterns into fragments
            this.n1 = Number(mdComb[0].match(/[\-]?[0-9.]+(?=[\*\/])/)[0]);            
            this.op = mdComb[0].match(/[\*\/]/)[0];
            this.n2 = Number(mdComb[0].match(/(?<=[\*\/])[\-]?[0-9.]+/)[0]);
            // Calculate the fragment
            let mdAns = this.op === "*" ? this.n1 * this.n2 : this.n1 / this.n2;
            // Replace the line with answer
            rawStr = rawStr.replace(mdPatLocal,String(mdAns));
        }
        
        // 3. Deal with additions and subtractions
        const asPatLocal = /([\-]?[0-9.]+)([\+\-])([\-]?[0-9.]+)/
        // while additional and subtraction pattern exist...
        while(asPatLocal.test(rawStr)){
            // Extract Pattern of (a+b) / (a-b)
            let asComb = rawStr.match(asPatLocal);
            // Line of pattern into fragments
            this.n1 = Number(asComb[0].match(/[\-]?[0-9.]+(?=[\+\-])/)[0]);
                // Extract last match to avoid negative sign treated as minus
            let opTemp = asComb[0].match(/[\+\-]/g);
            this.op = opTemp[opTemp.length-1];
                // Extract last match to avoid negative sign treated as minus
            let n2Temp = asComb[0].match(/(?<=[\+\-])[\-]?[0-9.]+/g)
            this.n2 = Number(n2Temp[n2Temp.length-1]);
            // Calculate the fragment
            let asAns = this.op === "+" ? this.n1 + this.n2 : this.n1 - this.n2;
            // Replace the line with answer
            rawStr = rawStr.replace(asPatLocal,String(asAns));
        }

        return rawStr // Return subset answer
    }

    calAnsDisplay(inputStr){
        let finalAns = Number(inputStr);
        let calOutput = document.getElementById("calOutput");
        // Overflow Handling
        if (finalAns > 1000000000000 || finalAns < -1000000000000){
            calOutput.innerText = "Overflow";
            return "error"
        }
        else{ calOutput.innerText = finalAns; }

        // Negative Value Styling
        if (finalAns < 0){ calOutput.style.color = "rgb(253, 71, 71)"; }
    }

    // Memory
    calCheckMemory(){
        console.log(this.formulaStorage);
        console.log(this.ansStorage);
    }

    calMemory(mode){
        mode = mode || "redo";
        let calInput = document.getElementById("calInput");
        let calOutput = document.getElementById("calOutput");

        // Redo mode - revert last undo
        if(mode == "redo"){
            // Activiate when there is something in temp cache
            if(this.formulaTemp.length > 0){
                // Revert undo-ed memory to memory cache
                this.formulaStorage.push(this.formulaTemp.pop());
                this.ansStorage.push(calOutput.innerText = this.ansTemp.pop());
                // Amend display value to reverted values
                calInput.value = this.formulaStorage[this.formulaStorage.length - 1];
                calOutput.innerText = this.ansStorage[this.ansStorage.length - 1];
            }
            return
        }

        // Undo mode - to last state
        if(this.ansStorage.length >= 2){
            // Remove last step and store removal to temp storage
            this.formulaTemp.push(this.formulaStorage.pop());
            this.ansTemp.push(this.ansStorage.pop());
            // Replace display value with updated last set
            calInput.value = this.formulaStorage[this.formulaStorage.length -1];
            calOutput.innerText = this.ansStorage[this.ansStorage.length - 1];
            // Testing log msg
            console.log(this.formulaStorage);
            console.log(this.ansStorage);
            return
        }
    }
}

function sampleGen(){
    opList = ["0","1","2","3","4","5","6","7","8","9","+","-","+","-","*","/","*","/"];
    // Generate a random equation
        let min = 5;
        let max = 20;   
        let randLength = Math.floor(Math.random() * (max - min + 1)) + min
        let generated = String(Math.floor(Math.random() * 10));
    for(i = 1; i < randLength-1 ;i++){
        if(/[\+\-\*\/]/.test(generated[i-1])){
            generated += opList[Math.floor(Math.random() * (opList.length-9))];
        }
        else{
            generated += opList[Math.floor(Math.random() * (opList.length-1))];
        }
    }
    generated += String(Math.floor(Math.random() * 10));
    return generated
}

function assertion(){
    while(true){
        let sample = sampleGen();
        let slow = eval(sample);
        let fast = MyCal.calCheck(sample);

        if(slow !== fast){
            console.log("==========ERROR==============");
            console.log(sample);
            console.log(slow);
            console.log(fast);
            return
        }
    }
}

// Declare MyCal as calculator object
var MyCal = new Calculator();

/*
console.log(calExe("-(-5)-(-88)-7+8")); //94
console.log(calExe("-1*-5-5(-5)+5^2-11*11")); //-116
console.log(calExe("6792-0*6*5")); //6792
*/

        /* 6. Bracket pre-processing
        raw = this.bracketProcessor(raw);
        // 6. Edge case for double operators like "5--5" & "5+-5"
        let newOp = null;
        while(/[\-\+]{2,}/.test(raw)){
            let e = raw.match(/[\+\-]{2}/)[0];
            switch(e){
                case "++":
                case "--":
                    newOp = "+";
                    break;
                case "+-":
                case "-+":
                    newOp = "-";
                    break;
            }
            raw = raw.replace(/[\+\-]{2}/,newOp);
        }
        // 7. Implied multiplication such as 5(5+6) => 5*(5+6)
        raw = raw.replace(/(?<=[0-9])\(/g,"*(");
        */