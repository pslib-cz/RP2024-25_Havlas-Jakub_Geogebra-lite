const mathFunctions = [
    "sin", "cos", "tan", "log", "ln", "sqrt", "abs", 
  ];

export const newParseExpression = (expression: string) => {
    let spreaded: string[] = [];
    spreaded = expression.split("")
    
    const filteredArr = spreaded.filter(item => item !== ' ');

    //do functions
    for (let i = 0; i < mathFunctions.length; i++) {
        let curr = ""
        let counter = 0
        for (let j = 0; j < filteredArr.length; j++) {

            if (filteredArr[j] === mathFunctions[i].charAt(counter)) {
                curr = curr + filteredArr[j]
               
                counter++;
                if (counter === mathFunctions[i].length) {
                    let joined = filteredArr.slice(j - counter+1, j+1).join("")
                    
                    filteredArr.splice(j - counter + 1, counter, joined)
                    
                    break;
                }
            }



        }
    }
    // join numbers
    let curr = ""
    let counter = 0
    for (let i = filteredArr.length - 1; i >= 0; i--) {
        if (isParsableToNumber(filteredArr[i]) || filteredArr[i] == ".") {
            counter++;
            curr = filteredArr[i] + curr;
            if (counter > 1 && !(isParsableToNumber(filteredArr[i - 1]) || filteredArr[i - 1] == ".")) {
                let joined = filteredArr.slice(i, i + counter).join("");
                filteredArr.splice(i, counter, joined);
                counter = 0;
                curr = "";
            }
        } else {
            counter = 0;
            curr = "";
        }
    }

    const StinkyDinky = [ "/", "*", "+", "^", "-"  ]
    
    for (let i = filteredArr.length - 1; i >= 0; i--) {
        if ( filteredArr[i] == "-" && (isParsableToNumber(filteredArr[i+1]) || filteredArr[i+1] == "x") && StinkyDinky.includes(filteredArr[i-1]) ) {
           
           
                let joined = filteredArr.slice(i, i + 2).join("");
                
                filteredArr.splice(i, 2, joined);
                counter = 0;
              
            
        } 
    }

    //2x
    //xsin
    //ax
    //asin
    //implicit multiplication will be here

    //detekovat člen 
    // mezi členy musí být operátor
    



    console.log("spreaded", filteredArr)

}

function isParsableToNumber(str: string) {
    return !isNaN(Number(str));
  }

