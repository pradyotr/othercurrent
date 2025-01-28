import Comments from "./pages/comments";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Comments />} />
    </Routes>
  );
};

export default App;