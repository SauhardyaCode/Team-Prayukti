import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage';
import LoginPage from "./components/LoginPage"

function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;