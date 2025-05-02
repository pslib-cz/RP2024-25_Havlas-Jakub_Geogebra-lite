
let ProccessInput = (input: string[][]) => {
    let ans: string[][] = [];
    let variables: {var:string, value:string}[] = [];
    for (let i = 0; i < input.length; i++) {
        console.log("Input: ", input[i],input[i].includes("=") );
        if (input[i].includes("=")) {
            variables.push({var: input[i][0], value: input[i][2]});
            
        }else {
            ans.push(input[i]);
        }
    }

    console.log("Variables: ", variables);

    for (let variable of variables) {
        for (let i = 0; i < ans.length; i++) {
            ans[i] = ans[i].map((item) => {
                if (item === variable.var) return variable.value.toString();
            
                
            
                return item.toString();
              });
        }
       
    }
    console.log("Ans: ", ans);
    return ans;
}
export default ProccessInput;