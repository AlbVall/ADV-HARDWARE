import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';  
import SignUp from './Signup';  
import Table from './Table';


function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />  {/* SIGN IN PAGE */}
      <Route path="/SignUp" element={<SignUp />} />  {/* SIGN UP PAGE */}
      <Route path="/table" element={<Table />} />  {/* TABLE PAGE/ MAIN PAGE */}
    </Routes>
  );
}

export default App;
