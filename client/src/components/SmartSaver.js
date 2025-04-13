import React from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const SmartSaver = ({
  deposit,
  withdraw,
  amount,
  setAmount,
  lockTime,
  setLockTime,
  hasDeposit,
  unlockTime,
  isWithdrawable,
  ethToUsd,
  loading,
  formatUnlockTime,
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">SmartLock Vault</h2>
        <Button variant="secondary" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </Button>
      </div>

      {/* ETH/USD Rate */}
      <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
        {loading ? (
          <Spinner animation="border" variant="info" />
        ) : (
          <Alert variant="info" className="mb-0">
            1 ETH = ${ethToUsd} USD
          </Alert>
        )}

        {hasDeposit && unlockTime && (
          <Alert variant="info" className="mb-0">
            {isWithdrawable ? (
              <strong>You can withdraw now!</strong>
            ) : (
              <>
                🔒 Funds locked until:{" "}
                <strong>{formatUnlockTime(unlockTime)}</strong>
              </>
            )}
          </Alert>
        )}

        {!hasDeposit && (
          <Alert variant="warning" className="mb-0">
            <strong>You haven't made a deposit yet!</strong>
          </Alert>
        )}
      </div>

      {/* Form */}
      <Form className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Amount in ETH</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Lock time (in seconds)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter lock time"
            value={lockTime}
            onChange={(e) => setLockTime(e.target.value)}
            disabled={isWithdrawable}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="success" onClick={deposit}>
            Deposit
          </Button>
          <Button
            variant="warning"
            onClick={withdraw}
            disabled={!isWithdrawable || !hasDeposit}
          >
            {isWithdrawable ? "Withdraw Now" : "Withdraw"}
          </Button>
        </div>
      </Form>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default SmartSaver;
