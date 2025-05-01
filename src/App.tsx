import { useState } from "react";
import LibraryController from "./components/LibraryController/LibraryController";
import "./App.css";
import UserInput from "./UserInput/UserInput";

import { reqs } from "./components/types";

function App() {
  const [expressions, setExpressions] = useState<reqs[]>([]);
  const defaultParams = { x: -2, y: -2, width: 4, height: 4 };

  return (
    <div className="container">
      <div>
        <LibraryController
          reqs={expressions}
          params={defaultParams}
          moveable={true}
          maxWidth={300}
          displayGrid={true}
       
        />
      </div>
      <div>
        <UserInput onSubmitExpressions={setExpressions} />
      </div>
    </div>
  );
}

export default App;
