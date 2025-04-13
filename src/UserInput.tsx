import React, { useState } from "react";

const UserInput: React.FC = () => {
    const [functions, setFunctions] = useState<string[]>([""]);
    const maxFunctions = 10;

    const handleInputChange = (index: number, value: string) => {
        const updatedFunctions = [...functions];
        updatedFunctions[index] = value;
        setFunctions(updatedFunctions);

        if (value.trim() !== "" && index === functions.length - 1 && functions.length < maxFunctions) {
            setFunctions([...updatedFunctions, ""]);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const validFunctions = functions.filter((fn) => fn.trim() !== "");
        console.log("Submitted Functions:", validFunctions);
    };

    return (
        <form onSubmit={handleSubmit}>
            {functions.map((fn, index) => (
                <div key={index}>
                    <label>
                        Function {index + 1}:
                        <input
                            type="text"
                            value={fn}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder="Enter a mathematical function"
                        />
                    </label>
                </div>
            ))}
            {functions.length === maxFunctions && (
                <p>You have reached the maximum number of functions.</p>
            )}
            <button type="submit">Submit</button>
        </form>
    );
};

export default UserInput;