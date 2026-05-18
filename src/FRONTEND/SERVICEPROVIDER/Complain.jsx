import React, { useState } from 'react';
import axios from "axios";
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { toast } from "react-toastify";

const Complain = () => {
  const [complaint, setComplaint] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'complaint') setComplaint(value);
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    // Get logged in user id
    const customer_id = localStorage.getItem("user_id");

    const response = await axios.post(
      "http://98.85.25.190:5000/api/complaint",
      {
        customer_id,
        complain_text: complaint,
      }
    );

    console.log("SUCCESS:", response.data);

    setIsSubmitted(true);

    toast.success("Complaint submitted successfully!");

    // Reset form
    setComplaint('');

  } catch (error) {

    console.log("ERROR:", error.response);

    toast.error("Failed to submit complaint");
  }
};

  return (
    
    <div className="center-container">
    <div 
      className="container-fluid d-flex justify-content-center align-items-center" 
      style={{ 
        height: '100vh', 
        backgroundColor: '#f4f7f6', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h2 className="mb-4">Submit Your Complaint</h2>

     

      {/* Complaint Form */}
      <Form onSubmit={handleSubmit}>
        {/* Name Field */}
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        {/* Email Field */}
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        {/* Complaint Field */}
        <Form.Group controlId="formComplaint" className="mb-3">
          <Form.Label>Your Complaint</Form.Label>
          <Form.Control
            as="textarea"
            name="complaint"
            value={complaint}
            onChange={handleInputChange}
            placeholder="Describe your complaint"
            rows={4}
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Submit Complaint
        </Button>
      </Form>
    </div>
    </div>
</div>
  );
};

export default Complain;
