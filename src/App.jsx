import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";

const App = () => {
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default App;
