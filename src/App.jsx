import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Sidebar from "./components/ui/sidebar";
import TestingPage from "./pages/testing";
import './config/fetch-interceptor'
import TestPage from "./pages/test-page";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Sidebar />} >
          <Route path="/" element={<Home />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/testpage" element={<TestPage />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
