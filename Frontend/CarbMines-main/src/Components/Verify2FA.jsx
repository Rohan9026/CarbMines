import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import { Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Verify2FA() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  const handleVerify = async () => {
    try {
      // 1. Retrieve the email saved during Login
      // We use JSON.parse because Login.jsx saved it with JSON.stringify
      const email = JSON.parse(localStorage.getItem('email'));

      if (!email) {
        setMessage("Error: Email not found. Please login again.");
        return;
      }

      // 2. Send BOTH email and twoFactorCode (matching backend expectations)
      const response = await axios.post('http://localhost:5000/api/verify-2fa', { 
        email: email, 
        twoFactorCode: code 
      });

      // 3. If successful, save the token and redirect
      const { token } = response.data;
      localStorage.setItem('token', token);
      setMessage('Verification successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/profile'); // Redirect to dashboard/profile
      }, 1500);

    } catch (error) {
      setMessage('Verification failed: ' + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Container
        maxWidth="sm"
        className="verify-2fa-container bg-gray-900 rounded-md p-10 shadow-lg"
        style={{ minHeight: '50vh' }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          className="verify-2fa-title text-[#66C5CC] font-bold text-3xl sm:text-4xl"
        >
          Verify Two-Factor Authentication
        </Typography>
        <div className="verify-2fa-icon flex justify-center mb-6">
          <Lock fontSize="large" style={{ color: '#66C5CC' }} />
        </div>
        <TextField
          label="2FA Code"
          variant="outlined"
          fullWidth
          margin="normal"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="verify-2fa-field"
          style={{
            backgroundColor: '#2E2E2E',
            borderRadius: '5px',
            fontSize: '1rem',
          }}
          InputProps={{
            style: { color: 'white' } // Ensures text is visible on dark background
          }}
          InputLabelProps={{
            style: { color: '#aaa' }
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleVerify}
          className="verify-2fa-button"
          style={{
            backgroundColor: '#66C5CC',
            color: '#1A202C',
            marginTop: '1rem',
            fontSize: '1.2rem',
          }}
        >
          Verify Code
        </Button>
        {message && (
          <Alert
            severity={message.includes('failed') || message.includes('Error') ? 'error' : 'success'}
            className="verify-2fa-alert mt-2"
          >
            {message}
          </Alert>
        )}
      </Container>
    </div>
  );
}

export default Verify2FA;