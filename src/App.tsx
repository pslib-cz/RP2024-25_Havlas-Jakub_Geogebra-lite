import React, { useState } from "react";
import LibraryController from "./components/LibraryController";
import "./App.css";
import UserInput from "./UserInput";

import { reqs } from "./components/types";

function App() {
  const [expressions, setExpressions] = useState<reqs[]>([]);
  const defaultParams = { x: -2, y: -2, width: 4, height: 4 };

  return (
    <>
      <UserInput onSubmitExpressions={setExpressions} />
      {expressions.length > 0 && (
        <LibraryController
          reqs={expressions}
          params={defaultParams}
        />
      )}
    </>
  );
}

export default App;
