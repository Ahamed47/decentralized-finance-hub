import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const SendETH = ({
  sendAmount,
  setSendAmount,
  recipient,
  setRecipient,
  sendETH,
  sending,
  ethToUsd,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      {/* Header with back button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Crypto Transfer - Send ETH To Another Address</h2>
        <Button variant="secondary" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </Button>
      </div>

      {/* ETH to USD Info */}
      <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
        {loading ? (
          <Spinner animation="border" variant="info" />
        ) : (
          <Alert variant="info" className="mb-0">
            1 ETH = ${ethToUsd} USD
          </Alert>
        )}
      </div>

      {/* Form */}
      <Form className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Recipient Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount in ETH</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter amount"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />
        </Form.Group>

        <Button variant="success" onClick={sendETH} disabled={sending}>
          {sending ? "Sending..." : "Send ETH"}
        </Button>
      </Form>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default SendETH;
