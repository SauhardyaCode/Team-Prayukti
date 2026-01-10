import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './components/DashboardPage';
import LoginPage from "./components/LoginPage"
import ProfilePage from './components/ProfilePage';

function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;