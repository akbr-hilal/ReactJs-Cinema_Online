import React from "react";
import {Routes, Route} from 'react-router-dom';


// Pages
import LandingPage from "./pages/guest/LandingPage";
import DetailFilmPage from "./pages/guest/DetailFilmPage";


function App() {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />}/>
      <Route exact path="/detail-film/:id" element={<DetailFilmPage />}/>
    </Routes>
  );
}

export default App;
