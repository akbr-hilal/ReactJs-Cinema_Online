import React from "react";
import {Routes, Route} from 'react-router-dom';


// Pages
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />}/>
    </Routes>
  );
}

export default App;
