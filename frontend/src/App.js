import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import CreateExam from './components/CreateExam';
import Dashboard from './components/Dashboard';
import Exam from './components/Exam';
import Footer from './components/Footer';
import Home from './components/Home';
import JudgeYourself from './components/JudgeYourself';
import MCQList from './components/MCQList';
import Navbar from './components/Navbar';
import Register from './components/Register';
import UserLogin from './components/UserLogin';
import { AuthProvider } from './context/AuthContext'; 
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exam/:examId" element={<Exam />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/mcq-list" element={<MCQList />} />
          <Route path="/judge-yourself" element={<JudgeYourself />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
