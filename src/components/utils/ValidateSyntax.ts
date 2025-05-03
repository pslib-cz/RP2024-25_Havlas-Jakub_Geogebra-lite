import { ValidFunctions, } from "../types";

const validateSyntax = (input: string[]) => {
    // Check for balanced parentheses
    let balance = 0;
    for (let char of input) {
        if (char === "(") balance++;
        else if (char === ")") balance--;
        if (balance < 0) {
            throw new Error("Unbalanced parentheses.");
        }
    }
    if (balance !== 0) {
        throw new Error("Unbalanced parentheses.");
    }
   
    if (input.filter(el => el === "|").length % 2 !== 0) {
        throw new Error("Unbalanced |.");
    }
    // every VaůidFunction has to have a ( after it
    for (let i = 0; i < input.length; i++) {
        if (ValidFunctions.includes(input[i]) && input[i+1] !== "(") {
            throw new Error(`Function ${input[i]} has to have a ( after it`);
        }
    }

    return true;
}
export default validateSyntax;