function Calculator(raw){
    let inputArr = raw.split(" ")
    let inputStr = inputArr.join("");
    // Parse Instructions from input
    // Start with multiplication and division
    while (inputArr.filter(x => x == "*" || x == "/").length > 0){
        let segment = inputStr.match(/([0-9]*)([\*\/])([0-9]*)/g);
        let current = segment[0];
        // Extracted Instruction as variables
        let prefix = Number(current.match(/(?<![\*\/])[0-9]*/)[0]);
        let operator = current.match(/[\/\*+-]/)[0];
        let suffix = Number(current.match(/(?<=[\*\/])[0-9]*/)[0]);

        // Execute math command based on operator
        if (operator == "/"){
            console.log(prefix / suffix);
        }
        else if (operator == "*"){
            console.log(prefix * suffix);
        }

        // Replace command segments with answer
        // try splice, find length to remove and add result in
        inputStr.splice()
    }
    
    
}

function test(){
    let patt = /[0-9]+(?=[a-zA-Z])/g;
    let str = "01234Hello wor45ld 78.a";

    let patt2 = /(?<=[a-zA-Z])[0-9]+/g;
    let str2 = "Buzz123_2021";
    return str2.match(patt2)
}

// "2 / 2 + 3 * 4 - 6" = 7
// find "*" and "/" first, extract numberic for both sides
// which is stopped by another symbol

//console.log(test());
console.log(Calculator("8 / 2 + 3 * 4 - 6"));