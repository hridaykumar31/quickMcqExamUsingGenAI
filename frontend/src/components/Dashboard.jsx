import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (user) {
      console.log(`${user.email}`);
      console.log(`User found, sending request with token: Bearer ${user.token}`);
      axios
        .get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => {
          console.log('Response:', res.data);
          setMessage(res.data.message);
        })
        .catch((error) => {
          console.error('Error:', error.response);
          setMessage('Error fetching dashboard.');
        });
    }
  }, [user]);
  

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <div>{message}</div>;
};

export default Dashboard;

