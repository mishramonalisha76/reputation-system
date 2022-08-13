import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { WalletAddressContext } from "../../context";
import idl from "../../idl.json";
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import "./profile.css";

export default function Profile() {
  const { githubId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { walletAddress, setWalletAddress } = useContext(WalletAddressContext);
  const [githubData, setGithubData] = useState([]);
  const [recentWork, setRecentWork] = useState({});
  const [githubEventData, setGithubEventData] = useState([]);
  const [totalCommits, setTotalCommits] = useState(0);
  
// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

  useEffect(() => {
    axios
      .all([
        axios.get(`https://api.github.com/users/${githubId}/events`),
        axios.get(`https://api.github.com/users/${githubId}`),
      ])

      .then(
        axios.spread((response1, response2) => {
          console.log(response2);
          setGithubData(response2.data);
          setGithubEventData(response1.data);
          setRecentWork(getRecentWork(response1.data));
        })
      )
      .catch((err) => {});
      if (walletAddress) {
        console.log('Fetching Account list...');
        createProfileAccount();
      }
  }, []);

  const createProfileAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getAccountDetails();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  const getAccountDetails = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      console.log("Got the account", account)
  
    } catch (error) {
      console.log("Error in getAccountDetails: ", error)

    }
  }

  const addProfile = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log(program)
      const account = await program.methods.addProfile(githubData.url,'');
      
      console.log("Added profile", account)
  
    } catch (error) {
      console.log("Error in addProfile: ", error)

    }
  }

  
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  const getRecentWork = (events) => {
    let lastCommit;

    events.some((event) => {
      return (
        event.type === "PushEvent" &&
        event.payload.commits.reverse().some((commit) => {
          // if (commit.author.email === EMAIL) {
          lastCommit = {
            repo: event.repo.name,
            sha: commit.sha,
            time: new Date(event.createdAt),
            message: commit.message,
            url: commit.url,
          };

          return true;
          // }
        })
      );
    });
    return lastCommit;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/profile/${githubId}/${walletAddress}/?linkShare=share`
    );
  };
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
            <h2>Off-Chain</h2>
            {githubData ? (
              <>
                <div>
                  <a herf={githubData.url}>{githubId}</a>
                  <p>GithubID</p>
                </div>
                <div>
                  <a herf={recentWork.repo}>
                    {recentWork.repo && recentWork.repo.split("/").pop()}
                  </a>
                  <p>Recent Work</p>
                </div>
                <div>
                  <a herf={githubData.repos_url}>{githubData.public_repos}</a>
                  <p>Repositories</p>
                </div>
                {/* <div>
              <p>{totalCommits}</p>
              <p>Total Commits</p>
            </div> */}
              </>
            ) : (
              <p>No Off-chain data</p>
            )}
          </div>
          <div className="profile-column-right">
            <h2>On-Chain</h2>
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
        <button
          className="profile-card-item profile-button"
          onClick={() => copyToClipboard()}
        >
          Get sharable link
        </button>
        {!searchParams.get("linkShare") && (
          <button className="profile-card-item profile-button"
          onClick={() => addProfile()}>
            Store On-Chain
          </button>
        )}
      </div>
    </div>
  );
}
