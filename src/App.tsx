import React, { useState } from "react";
import LibraryController from "./components/LibraryController";
import "./App.css";
import UserInput from "./UserInput";

interface ExpressionData {
  expression: string;
  color: string;
}

function App() {
  const [expressions, setExpressions] = useState<ExpressionData[]>([]);
  const defaultParams = { x: -2, y: -2, width: 4, height: 4 };

  return (
    <>
      <UserInput onSubmitExpressions={setExpressions} />
      {expressions.length > 0 && (
        <LibraryController
          expressions={expressions.map((fn) => fn.expression)}
          params={defaultParams}
        />
      )}
    </>
  );
}

export default App;
