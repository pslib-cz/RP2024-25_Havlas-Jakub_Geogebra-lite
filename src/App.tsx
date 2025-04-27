import React, { useState, useEffect } from "react";
import LibraryController from "./components/LibraryController/LibraryController";
import "./App.css";
import UserInput from "./components/UserInput/UserInput";

import { reqs } from "./components/types";

function App() {
  const [expressions, setExpressions] = useState<reqs[]>([]);
  const defaultParams = { x: -2, y: -2, width: 4, height: 4 };

  return (
    <div className="container">
      <LibraryController reqs={expressions} params={defaultParams} />
      <UserInput onSubmitExpressions={setExpressions} />
    </div>
  );
}

export default App;
