import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthPage from "./pages/Auth";
import New from "./pages/new";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        {/* exact is used because / will redirect to any page starting with / so exact means path which has only / and nothing else */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events" element={<New />} />
        <Route path="/bookings" element={null} />
      </Routes>
    </Router>
  );
}

export default App;
