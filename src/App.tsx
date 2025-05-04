import { useState } from "react";
import LibraryController from "./components/LibraryController/LibraryController";
import "./App.css";
import UserInput from "./UserInput/UserInput";

import { reqs } from "./components/types";

function App() {
  const [expressions, setExpressions] = useState<reqs[]>([]);

  return (
    <div className="container">
      <div>
        <LibraryController
          reqs={expressions}
        
        />
      </div>
      <div>
        <UserInput onSubmitExpressions={setExpressions} />
      </div>
    </div>
  );
}

export default App;
