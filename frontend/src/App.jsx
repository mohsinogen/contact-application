import "./App.css";
import TopBar from "./components/TopBar";
import { HashRouter as Router, Routes, Route, Redirect, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoutes";
import NewContactPage from "./pages/NewContactPage";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";
import EditContactPage from "./pages/EditContactPage";

function App() {

  return (
    <div>
      <Router>
        <AuthProvider>
          <TopBar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contacts/:contactId" element={<ContactPage />} />
            <Route path="/editcontact/:contactId" element={<EditContactPage />} />
            <Route path="/newcontact" element={<ProtectedRoute element={<NewContactPage />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
