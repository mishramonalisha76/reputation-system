import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "../components/Login/index";
import Profile from "../components/Profile/index";

export default function RouterComponent() {
  
  return (
    <Router>
      <Route path="/" component={Login} />
      <Route path="/profile" component={Profile} />
    </Router>
  );
}
