import "./App.css";

import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import useTheme from "./components/utils/useTheme";

function App() {
  useTheme();
  return (
    <div className="min-w-[375px] min-h-screen bg-gray-50/50 dark:bg-black transition-colors duration-300">
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
      </Routes>
    </div>
  );
}

export default App;
