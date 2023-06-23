import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import "./App.css";

function App() {
  return (
    <Router>
      {/* <React.Fragment> */}
      <MainNavigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          {/* exact is used because / will redirect to any page starting with / so exact means path which has only / and nothing else */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
      {/* </React.Fragment> */}
    </Router>
  );
}

export default App;
