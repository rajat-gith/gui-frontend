import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import MainScreen from "./screens/MainScreen";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomeScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/main" element={<MainScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
