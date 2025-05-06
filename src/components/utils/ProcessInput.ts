import {  ValidConstants, ValidVariables } from "../types";
import validateChars from "./ValidateChars";
import validateSyntax from "./ValidateSyntax";

let ProccessInput = (input: string[][]) => {


    // validate chars
    for (let i = 0; i < input.length; i++) {
        if (!validateChars(input[i])) {
            throw new Error(`Invalid character in input: ${input[i]}`);
        }
    }
    // validateSyntax
    for (let i = 0; i < input.length; i++) {
        if (!validateSyntax(input[i])) {
            throw new Error(`Invalid syntax in input: ${input[i]}`);
        }
    }
    // validate assigments
    for (let i = 0; i < input.length; i++) {
        if (input[i].includes("=")) {
            if (input[i].length !== 3) {
                throw new Error(`Invalid assignment in input: ${input[i]}`);
            }
            if (!ValidVariables.includes(input[i][0])) {
                throw new Error(`Invalid variable in assignment: ${input[i]}`);
            }
            if (!ValidConstants.includes(input[i][0]) && !ValidVariables.includes(input[i][0])) {
                
                throw new Error(`Invalid value in assignment: ${input[i]}`);
            }
        }
    }

    let ans: string[][] = [];
    let variables: {var:string, value:string}[] = [];
    for (let i = 0; i < input.length; i++) {
        
        if (input[i].includes("=")) {
            variables.push({var: input[i][0], value: input[i][2]});
            
        }else {
            ans.push(input[i]);
        }
    }

 

    for (let variable of variables) {
        for (let i = 0; i < ans.length; i++) {
            ans[i] = ans[i].map((item) => {
                if (item === variable.var) return variable.value.toString();
            
                
            
                return item.toString();
              });
        }
       
    }
   
    return ans;
}
export default ProccessInput;




