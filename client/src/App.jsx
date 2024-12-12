import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Component/Auth/Login';
import Signup from './Component/Auth/Signup';
import Updatepassword from './Component/Auth/Updatepassword';
import Enterdashboard from './Component/Auth/Enterdashboard';
import Mainlayout from './layout/Mainlayout';
import Thankyou from './Component/Auth/Thankyou';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/updatepassword" element={<Updatepassword />} />
        <Route path="/enterdashboard" element={<Enterdashboard />} />
        <Route path="/updatepassword" element={<Updatepassword />} />
  
        <Route path="/Thankyou" element={<Thankyou />} />
        {/* Protected Main Layout */}
        <Route path="/*" element={<Mainlayout />} />
      </Routes>
    </Router>
  );
};

export default App;
