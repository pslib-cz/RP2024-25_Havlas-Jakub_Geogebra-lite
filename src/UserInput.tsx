
//ai
// write me basic input system, that would allow user to enter multiple functions. The input system should be able to handle multiple inputs, and it should be able to handle special characters like sin, cos, tan, ^, √, π, e. The input system should also be able to handle Ctrl+Z for undo.
import React, { useState, useRef, useEffect } from "react";
import { reqs } from "./components/types";
import "./App.css"; // Assuming you have some CSS for styling
import  "./UserInput.css"; // Assuming you have some CSS for styling
interface UserInputProps {
  onSubmitExpressions: (functions: reqs[]) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmitExpressions }) => {
  const [functions, setFunctions] = useState<reqs[]>([
    { expression: "", color: "#000000" },
  ]);
  const [lastFocusedIndex, setLastFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const historyRefs = useRef<string[][]>([[""]]); // Each input has its own history
  const maxFunctions = 10;
  const maxHistory = 20;

  const specialButtons = ["sin", "cos", "tan", "^", "√", "π", "e", "(", ")"];

  // Set up key listener for Ctrl+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        if (lastFocusedIndex === null) return;

        const history = historyRefs.current[lastFocusedIndex];
        if (history && history.length > 1) {
          history.pop(); // Remove current value
          const previous = history[history.length - 1];
          updateExpression(lastFocusedIndex, previous, false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lastFocusedIndex]);

  const updateExpression = (index: number, value: string, pushToHistory = true) => {
    const updated = [...functions];
    updated[index].expression = value;
    setFunctions(updated);

    if (pushToHistory) {
      const history = historyRefs.current[index] || [];
      history.push(value);
      if (history.length > maxHistory) history.shift(); // Trim old history
      historyRefs.current[index] = history;
    }

    if (
      value.trim() !== "" &&
      index === functions.length - 1 &&
      functions.length < maxFunctions
    ) {
      setFunctions([...updated, { expression: "", color: "#000000" }]);
      historyRefs.current.push([""]);
    }
  };

  const handleExpressionChange = (index: number, value: string) => {
    updateExpression(index, value);
  };

  const handleColorChange = (index: number, color: string) => {
    const updated = [...functions];
    updated[index].color = color;
    setFunctions(updated);
  };

  const insertSpecialChar = (char: string) => {
    if (lastFocusedIndex === null) return;
    const input = inputRefs.current[lastFocusedIndex];
    if (!input) return;

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const value = functions[lastFocusedIndex].expression;

    const newValue = value.slice(0, start) + char + value.slice(end);
    updateExpression(lastFocusedIndex, newValue);

    setTimeout(() => {
      input.focus();
      const pos = start + char.length;
      input.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validFunctions = functions.filter((fn) => fn.expression.trim() !== "");
    onSubmitExpressions(validFunctions);
  };
  useEffect(() => {
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
      setLastFocusedIndex(0);
    }
  }, []);
  return (
    <form onSubmit={handleSubmit} className="form-section form-container">
      {functions.map((fn, index) => (
        <div key={index}  className="input-item">
          <label className="label-field">
           
            <div  className="input-container">
              <input
              className="input-field"
                type="text"
                value={fn.expression}
                onChange={(e) => handleExpressionChange(index, e.target.value)}
                onFocus={() => setLastFocusedIndex(index)}
                placeholder="Enter a mathematical function"
                ref={(el) => {
                  inputRefs.current[index] = el;
                  if (!historyRefs.current[index]) {
                    historyRefs.current[index] = [fn.expression];
                  }
                }}
              />
              <input
               className="input-color-field"
                type="color"
                value={fn.color}
                onChange={(e) => handleColorChange(index, e.target.value)}
              />
            </div>
          </label>
        </div>
      ))}

      {/* Shared Special Buttons */}
      <div style={{ margin: "1rem 0", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {specialButtons.map((char) => (
          <button
            type="button"
            key={char}
            onClick={() => insertSpecialChar(char)}
            style={{ padding: "4px 8px", fontSize: "0.9rem" }}
          >
            {char}
          </button>
        ))}
      </div>

      {functions.length === maxFunctions && (
        <p>You have reached the maximum number of functions.</p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserInput;
