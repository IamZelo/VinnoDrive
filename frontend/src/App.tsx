import "./App.css";

import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/pages/LoginPage";
import Register from "./components/pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import useTheme from "./utils/useTheme";

function App() {
  useTheme();
  return (
    <div className="min-w-[320px] min-h-screen bg-gray-50/50 dark:bg-black transition-colors duration-700">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
