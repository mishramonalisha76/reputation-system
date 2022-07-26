import React,{useState,useEffect} from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const { githubId } = useParams();
  const [githubData,setGithubData] = useState([]);
  useEffect(() => {
    axios
      .get(`https://api.github.com/users/${githubId}/events`)
      .then((response) => {
        console.log(response);
        setGithubData(response.data)
      })
      .catch((err) => {
      
      });
  }, []);
  return (
    <div className="profile-card">
      <div className="profile-card-right">
        <h2 className="profile-card-right-heading">
          On-chain Reputation System
        </h2>
      </div>
      <div className="profile-card-left">
        <h1 className="profile-card-item profile-heading">Profile</h1>
        <hr className="profile-hr" />
        <div className="profile-column">
          <div className="profile-column-left">
            <h3>Off-Chain</h3>
            <div>
                <p>GithubID</p>
            </div>
            <div>
                <p>Recent Work</p>
            </div>
            <div>
                <p>Repositories</p>
            </div>
            <div>
                <p>Total Commits</p>
            </div>
          </div>
          <div className="profile-column-right">
            <h3>On-Chain</h3>
            <div>
                <p>NFTs</p>
            </div>
            <div>
                <p>Courses</p>
            </div>
            <div>
                <p>Balance</p>
            </div>
          </div>
        </div>
        <button className="profile-card-item profile-button">
          Store On-Chain
        </button>
      </div>
    </div>
  );
}
