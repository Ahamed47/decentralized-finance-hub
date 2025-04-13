import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Alert, Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const Home = ({
  currentAccount,
  connectWallet,
  disconnectWallet,
  error,
  ethToUsd,
  loading,
}) => {
  return (
    <Container className="mt-5 position-relative text-center">
      <h2 className="mb-4">Decentralized Finance Hub</h2>

      {currentAccount && (
        <div className="position-absolute top-0 end-0 mt-3 me-3">
          <Button variant="outline-danger" onClick={disconnectWallet}>
            Logout
          </Button>
        </div>
      )}

      {!currentAccount ? (
        <>
          <Button variant="primary" onClick={connectWallet}>
            Connect with MetaMask
          </Button>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </>
      ) : (
        <>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Alert variant="success" className="mb-0">
              Connected Wallet: <strong>{currentAccount}</strong>
            </Alert>

            {loading ? (
              <Spinner animation="border" variant="info" />
            ) : (
              <Alert variant="info" className="mb-0">
                1 ETH = ${ethToUsd} USD
              </Alert>
            )}
          </div>

          <div
            className="d-flex flex-column align-items-center gap-3 mt-4"
            style={{ maxWidth: "500px", width: "100%", margin: "0 auto" }}
          >
            <Link to="/smart-saver" className="w-100">
              <Button variant="outline-primary" className="w-100">
                SmartLock Vault
              </Button>
            </Link>
            <Link to="/send-eth" className="w-100">
              <Button variant="outline-success" className="w-100">
                Crypto Transfer
              </Button>
            </Link>
          </div>
        </>
      )}
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default Home;
