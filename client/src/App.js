import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, isAddress } from "ethers";
import SmartSaverABI from "./abi/SmartSaverABI.json";
import EthTransferABI from "./abi/EthTransferABI.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmartSaver from "./components/SmartSaver";
import SendETH from "./components/SendETH";
import Home from "./components/Home";
import "./App.css";

const SMARTSAVER_CONTRACT_ADDRESS =
  "0xBD0841A0662a7bcC85bC7CDdb97416d9E2083b6F";
const ETHTRANSFER_CONTRACT_ADDRESS =
  "0x16Ff2C32A94638629ccAEfD77b81131C5508Ec3B";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [smartSaverContract, setSmartSaverContract] = useState(null);
  const [ethTransferContract, setEthTransferContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [lockTime, setLockTime] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState(null);
  const [unlockTime, setUnlockTime] = useState(null);
  const [hasDeposit, setHasDeposit] = useState(false);
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [ethToUsd, setEthToUsd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum && sessionStorage.getItem("walletConnected")) {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          const signer = await provider.getSigner();

          // SmartSaver contract
          const smartSaver = new Contract(
            SMARTSAVER_CONTRACT_ADDRESS,
            SmartSaverABI.abi,
            signer
          );
          setSmartSaverContract(smartSaver);
          checkDepositStatus(smartSaver, accounts[0]);

          // EthTransfer contract
          const ethTransfer = new Contract(
            ETHTRANSFER_CONTRACT_ADDRESS,
            EthTransferABI.abi,
            signer
          );
          setEthTransferContract(ethTransfer);
        }
      }
    };
    checkIfConnected();
  }, []);

  useEffect(() => {
    if (unlockTime) {
      const interval = setInterval(() => {
        if (Date.now() / 1000 > unlockTime) {
          setUnlockTime(null);
          setIsWithdrawable(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [unlockTime]);

  useEffect(() => {
    const fetchEthToUsd = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        setEthToUsd(response.data.ethereum.usd);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ETH to USD price:", err);
        setError("Failed to fetch ETH to USD price.");
        setLoading(false);
      }
    };

    fetchEthToUsd();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);
      sessionStorage.setItem("walletConnected", "true");

      const signer = await provider.getSigner();

      // SmartSaver contract
      const smartSaver = new Contract(
        SMARTSAVER_CONTRACT_ADDRESS,
        SmartSaverABI.abi,
        signer
      );
      setSmartSaverContract(smartSaver);
      checkDepositStatus(smartSaver, accounts[0]);

      // EthTransfer contract
      const ethTransfer = new Contract(
        ETHTRANSFER_CONTRACT_ADDRESS,
        EthTransferABI.abi,
        signer
      );
      setEthTransferContract(ethTransfer);

      setError(null);
    } catch (err) {
      console.error(err);
      setError("User rejected the connection request.");
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount(null);
    setSmartSaverContract(null);
    setEthTransferContract(null);
    sessionStorage.removeItem("walletConnected");
    setUnlockTime(null);
    setHasDeposit(false);
    setIsWithdrawable(false);
  };

  const checkDepositStatus = async (contractInstance, account) => {
    try {
      const deposit = await contractInstance.deposits(account);
      if (deposit.amount > 0n) {
        const unlockTimestamp = Number(deposit.unlockTime);
        setHasDeposit(true);
        setUnlockTime(unlockTimestamp);
        setIsWithdrawable(Date.now() / 1000 > unlockTimestamp);
      } else {
        setHasDeposit(false);
        setUnlockTime(null);
        setIsWithdrawable(false);
      }
    } catch (err) {
      console.error("Failed to check deposit status", err);
    }
  };

  const deposit = async () => {
    if (!smartSaverContract || !amount || !lockTime) {
      toast.error("Please enter both amount and lock time.");
      return;
    }

    try {
      const tx = await smartSaverContract.depositFunds(lockTime, {
        value: parseEther(amount),
      });
      await tx.wait();
      toast.success("Deposit successful!");
      setAmount("");
      setLockTime("");
      checkDepositStatus(smartSaverContract, currentAccount);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const withdraw = async () => {
    if (!smartSaverContract || !isWithdrawable) return;

    try {
      const tx = await smartSaverContract.withdrawFunds();
      await tx.wait();
      toast.success("Withdrawn successfully!");
      setAmount("");
      setLockTime("");
      checkDepositStatus(smartSaverContract, currentAccount);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const sendETH = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask");
      return;
    }

    try {
      setSending(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Validate inputs
      if (!isAddress(recipient)) {
        toast.error("Invalid recipient address");
        return;
      }

      const parsedAmount = parseEther(sendAmount);
      if (parsedAmount <= 0n) {
        toast.error("Amount must be > 0");
        return;
      }

      // Check user balance
      const userBalance = await provider.getBalance(await signer.getAddress());
      if (parsedAmount > userBalance) {
        toast.error("Insufficient balance");
        return;
      }

      // Create contract instance
      const contract = new Contract(
        ETHTRANSFER_CONTRACT_ADDRESS,
        [
          {
            inputs: [
              { internalType: "address payable", name: "_to", type: "address" },
            ],
            name: "transferETH",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        signer
      );

      // Send transaction
      const tx = await contract.transferETH(recipient, {
        value: parsedAmount, // ETH amount to send
        gasLimit: 300000,
      });

      toast.info(
        <div>
          Transaction submitted!
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Etherscan
          </a>
        </div>
      );

      await tx.wait();
      toast.success("Transfer successful!");
      setSendAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(error.reason || error.message);
    } finally {
      setSending(false);
    }
  };

  const formatUnlockTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              currentAccount={currentAccount}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
              error={error}
              ethToUsd={ethToUsd}
              loading={loading}
            />
          }
        />

        <Route
          path="/smart-saver"
          element={
            <SmartSaver
              currentAccount={currentAccount}
              deposit={deposit}
              withdraw={withdraw}
              amount={amount}
              setAmount={setAmount}
              lockTime={lockTime}
              setLockTime={setLockTime}
              hasDeposit={hasDeposit}
              unlockTime={unlockTime}
              isWithdrawable={isWithdrawable}
              ethToUsd={ethToUsd}
              loading={loading}
              connectWallet={connectWallet}
              error={error}
              disconnectWallet={disconnectWallet}
              formatUnlockTime={formatUnlockTime}
            />
          }
        />

        <Route
          path="/send-eth"
          element={
            <SendETH
              currentAccount={currentAccount}
              sendAmount={sendAmount}
              setSendAmount={setSendAmount}
              recipient={recipient}
              setRecipient={setRecipient}
              sendETH={sendETH}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
              error={error}
              sending={sending}
              ethToUsd={ethToUsd}
              loading={loading}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
