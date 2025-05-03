import { ValidFunctions, ValidOperators, ValidConstants, ValidBrackets, ValidVariables } from "../types";
import isParsableToNumber from "./ParsableNumber";


const validateChars = (input: string[]) => {
    const allowedValues = [...ValidBrackets, ...ValidConstants, ...ValidOperators, ...ValidFunctions, ...ValidVariables];
   for (let i = 0; i < input.length; i++) {
        if (!allowedValues.includes(input[i]) && !isParsableToNumber(input[i]) && input[i] !== "x"  && input[i] !== "=" ) {
            console.log(`Invalid character: ${input[i]}`);
           return false;
        }
    }
   
   
    return true;
}
export default validateChars;