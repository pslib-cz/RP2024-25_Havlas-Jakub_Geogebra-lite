import  { useState } from "react";

import "./App.css";
import UserInput from "./UserInput";
import { GraphLibrary } from "@jakub-havlas/graph-lib";


function App() {
  type Req = { expression: string; color: string };
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
