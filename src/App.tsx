import LibraryController from "./components/LibraryController";
import "./App.css";
import UserInput from "./UserInput";
function App() {
  return (
    <>
    <UserInput />
      <LibraryController
        expressions={["x^2"]}
        params={{ x: -2, y: -2, width: 4, height: 4 }}
      />
    </>
  );
}

export default App;












