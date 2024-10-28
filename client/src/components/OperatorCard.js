import React, { useState } from 'react';
import '../pages/Dialler.css';

function OperatorCard({ operator, onDelete, onToggleOnCall }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => setShowConfirmation(true);
  const confirmDelete = () => {
    setShowConfirmation(false);
    onDelete(); // onDelete already receives the operator ID in Dialler.js
  };
  const cancelDelete = () => setShowConfirmation(false);

  return (
    <div className="operator-card">
      {showConfirmation && (
        <div className="confirmation-popup">
          <p>Are you sure you want to delete this operator?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}
      <button className="delete-button" onClick={handleDeleteClick}>×</button>
      <h3>{operator.name}</h3>
      <p>Role: {operator.role}</p>
      <p>Phone: {operator.phone}</p>
      <p>Priority: {operator.priority}</p>
        <div className="toggle-slider-container">
            <p>Status: {operator.onCall ? "On Call" : "Off Call"}</p>
            <div className={`toggle-slider ${operator.onCall ? 'enabled' : 'disabled'}`} onClick={onToggleOnCall}>
                <span className="slider-circle"></span>
            </div>
        </div>
    </div>
  );
}

export default OperatorCard;
