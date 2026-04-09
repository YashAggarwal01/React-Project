import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import Checkout from "./components/Checkout";
import ProductPage from "./components/ProductPage";
import SearchResults from "./components/SearchResults";



function App() {
  return (
    <BrowserRouter>
      <NavBar/>     
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/search" element={<SearchResults/>} />
        <Route path="/product/:id" element={<ProductPage/>} />
        <Route path="/checkout" element={<Checkout/>} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App; 