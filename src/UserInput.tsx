import React, { useState } from "react";

interface ExpressionData {
  expression: string;
  color: string;
}

interface UserInputProps {
  onSubmitExpressions: (functions: ExpressionData[]) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmitExpressions }) => {
  const [functions, setFunctions] = useState<ExpressionData[]>([
    { expression: "", color: "#000000" },
  ]);
  const maxFunctions = 10;

  const handleExpressionChange = (index: number, value: string) => {
    const updated = [...functions];
    updated[index].expression = value;
    setFunctions(updated);

    if (
      value.trim() !== "" &&
      index === functions.length - 1 &&
      functions.length < maxFunctions
    ) {
      setFunctions([...updated, { expression: "", color: "#000000" }]);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const updated = [...functions];
    updated[index].color = color;
    setFunctions(updated);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validFunctions = functions.filter((fn) => fn.expression.trim() !== "");
    onSubmitExpressions(validFunctions);
  };

  return (
    <form onSubmit={handleSubmit}>
      {functions.map((fn, index) => (
        <div key={index}>
          <label>
            Function {index + 1}:
            <input
              type="text"
              value={fn.expression}
              onChange={(e) => handleExpressionChange(index, e.target.value)}
              placeholder="Enter a mathematical function"
            />
            <input
              type="color"
              value={fn.color}
              onChange={(e) => handleColorChange(index, e.target.value)}
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
