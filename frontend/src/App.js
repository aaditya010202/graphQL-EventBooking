import React, { Component } from "react";
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
import AuthContext from "./context/auth-context";

import "./App.css";
// import { TokenExpiredError } from "jsonwebtoken";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <Router>
        {/* <React.Fragment> */}
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Routes>
              {!this.state.token && (
                <Route path="/" element={<Navigate to="/auth" />} />
              )}
              {this.state.token && (
                <Route path="/" element={<Navigate to="/events" />} />
              )}
              {this.state.token && (
                <Route path="/auth" element={<Navigate to="/events" />} />
              )}
              {/* exact is used because / will redirect to any page starting with / so exact means path which has only / and nothing else */}
              {!this.state.token && (
                <Route path="/auth" element={<AuthPage />} />
              )}
              <Route path="/events" element={<EventsPage />} />
              {this.state.token && (
                <Route path="/bookings" element={<BookingsPage />} />
              )}
            </Routes>
          </main>
        </AuthContext.Provider>
        {/* </React.Fragment> */}
      </Router>
    );
  }
}

export default App;
