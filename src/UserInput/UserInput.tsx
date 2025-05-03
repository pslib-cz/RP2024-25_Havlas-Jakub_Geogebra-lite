import React, { useState, useRef, useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax"; // ⭐ NEW
import { reqs } from "../components/types";
import "../App.css";
import "./UserInput.css";
import  validateExpression  from "../components/utils/validateExpression"; // Adjust the import path as necessary
import convertFractions from "../components/utils/ConvertToMathJax"; // Adjust the import path as necessary
interface UserInputProps {
  onSubmitExpressions: (functions: reqs[]) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmitExpressions }) => {
  const [functions, setFunctions] = useState<reqs[]>([
    { expression: "", color: "#000000" },
  ]);
  const [lastFocusedIndex, setLastFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const historyRefs = useRef<string[][]>([[""]]);
  const maxFunctions = 10;
  const maxHistory = 20;
  const [invalidIndices, setInvalidIndices] = useState<number[]>([]);
  const specialButtons = ["sin", "cos", "tan", "^", "√", "π", "e", "(", ")", "|"];

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        //setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const config = { loader: { load: ["input/tex", "output/chtml"] } };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        if (lastFocusedIndex === null) return;

        const history = historyRefs.current[lastFocusedIndex];
        if (history && history.length > 1) {
          history.pop();
          const previous = history[history.length - 1];
          updateExpression(lastFocusedIndex, previous, false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lastFocusedIndex]);

 

  const updateExpression = (
    index: number,
    value: string,
    pushToHistory = true
  ) => {
    const updated = [...functions];
    updated[index].expression = value;
    setFunctions(updated);

    if (pushToHistory) {
      const history = historyRefs.current[index] || [];
      history.push(value);
      if (history.length > maxHistory) history.shift();
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
    if (char === "√") {
      char = "sqrt";

    }
    if (char.length > 1) {
      char = char + "()";
    }
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const value = functions[lastFocusedIndex].expression;
    let posans = start + char.length;
    if (char.length > 1) {
      posans = start + char.length - 1;
    }
    const newValue = value.slice(0, start) + char + value.slice(end);
    updateExpression(lastFocusedIndex, newValue);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(posans, posans);
    }, 0);
  };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    const validFunctions = functions.filter(
      (fn) => fn.expression.trim() !== ""
    );
  
    const newInvalidIndices: number[] = [];
  
    validFunctions.forEach((fn, index) => {
      const result = validateExpression(fn.expression);
      if (!result.valid) {
        newInvalidIndices.push(index);
      }
    });
  
    if (newInvalidIndices.length > 0) {
      setInvalidIndices(newInvalidIndices);
     
      return;
    }
  
    // If everything's good, clear previous errors
    setInvalidIndices([]);
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
    <div>
      {!isOpen && isMobile && (
        <button onClick={() => setIsOpen(true)} className="OpenOverlayButton">
          Open Overlay
        </button>
      )}
      {isOpen && (
        <div>
          <MathJaxContext version={3} config={config}>
            <form
              onSubmit={handleSubmit}
              className={"form-section form-container " + (isMobile ? "form-container--open" : "")}
            >
              {isMobile && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-blue-600 text-white rounded"
                >
                  close
                </button>
              )}
            <div className="input-section scroll-container">
              {functions.map((fn, index) => (
                <div key={index} className="input-item">
                  <label className="label-field">
                    <div className="input-container">
                      <input
                        className={`input-field ${invalidIndices.includes(index) ? "label-field--wrong" : ""}`}
                        type="text"
                        value={fn.expression}
                        onChange={(e) =>
                          handleExpressionChange(index, e.target.value)
                        }
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
                        onChange={(e) =>
                          handleColorChange(index, e.target.value)
                        }
                      />
                    </div>

                    {/* ⭐ NEW: Render converted LaTeX preview */}
                    <div style={{ marginTop: "0.5rem", fontSize: "1.2rem" }}>
                      <MathJax dynamic>
                        {`\\(${convertFractions(fn.expression)}\\)`}
                      </MathJax>
                    </div>
                  </label>
                </div>
              ))}
</div>
              {/* Special Buttons */}
              <div
                style={{
                  margin: "1rem 0",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
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
          </MathJaxContext>
        </div>
      )}
    </div>
  );
};

export default UserInput;
