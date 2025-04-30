import  { useState } from "react";

import "./App.css";
import UserInput from "./components/UserInput";
import { GraphLibrary } from "@jakub-havlas/graph-lib";
import { Req } from "./types/types"; // Adjust the import path as necessary

function App() {

  const [expressions, setExpressions] = useState<Req[]>([]);
  const defaultParams = { x: -2, y: -2, width: 4, height: 4 };

  return (
    <div className="container">
      <GraphLibrary reqs={expressions} params={defaultParams} moveable={true} />
      <UserInput onSubmitExpressions={setExpressions} />
    </div>
  );
}

export default App;
