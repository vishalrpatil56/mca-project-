import React, { useState } from 'react';
import { toast } from "react-toastify";
import { Button, Form, Container, Alert } from 'react-bootstrap';

const Feedback = () => {
  // States for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'feedback') setFeedback(value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the feedback (You can replace this with an API call to save the feedback)
    console.log('Feedback Submitted:', { name, email, feedback });

    // Set the form as submitted
    setIsSubmitted(true);
    toast.success("Feedback submitted successfully!");

    // Reset form fields
    setName('');
    setEmail('');
    setFeedback('');
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
      <h2 className="mb-4">Submit Your Feedback</h2>

    

      {/* Feedback Form */}
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

        {/* Feedback Field */}
        <Form.Group controlId="formFeedback" className="mb-3">
          <Form.Label>Your Feedback</Form.Label>
          <Form.Control
            as="textarea"
            name="feedback"
            value={feedback}
            onChange={handleInputChange}
            placeholder="Write your feedback here"
            rows={4}
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Submit Feedback
        </Button>
      </Form>
    </div>
    </div>
    </div>
  );
};

export default Feedback;
