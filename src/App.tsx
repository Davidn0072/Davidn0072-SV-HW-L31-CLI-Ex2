import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AllRecipes from './pages/AllRecipes';
import AddRecipe from './pages/AddRecipe';
import SearchRecipes from './pages/SearchRecipes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AllRecipes />} />
            <Route path="/all-recipes" element={<AllRecipes />} />
            <Route path="/add-recipes" element={<AddRecipe />} />
            <Route path="/search" element={<SearchRecipes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App
