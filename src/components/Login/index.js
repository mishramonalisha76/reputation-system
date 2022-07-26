import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate  = useNavigate();
  const [githubId, setGithubId] = useState("");

  const handleSubmit = () => {
    if (githubId === "") {
      alert("Enter github id");
    } else {
      navigate(`/profile/${githubId}/23144`);
    }
  };
  return (
    <div className="login-card">
      <div className="login-card-right">
        <h2 className="login-card-right-heading">On-chain Reputation System</h2>
      </div>
      <div className="login-card-left">
        <h1 className="login-card-item login-heading">Login Form </h1>
        <label className="login-label">Github Id</label>
        <input
          className="login-card-item login-input"
          placeholder="Enter your Github Id"
          type="text"
          value={githubId}
          onChange={(e) => setGithubId(e.target.value)}
        />
        <button className="login-card-item login-button">Connect Wallet</button>
        <button
          className="login-card-item login-button"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
