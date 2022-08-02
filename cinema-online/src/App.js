import React, {useEffect, useContext} from "react";
import {Routes, Route, useNavigate} from 'react-router-dom';
import { UserContext } from "./context/userContext";
import { API, setAuthToken } from "./config/api";


// Pages Quest
import LandingPage from "./pages/guest/LandingPage";
import DetailFilmPage from "./pages/guest/DetailFilmPage";
import NotFound from "./pages/guest/NotFound";

// Pages Users
import LandingPageUser from './pages/user/LandingFilm';
import DetailFilm from './pages/user/DetailFilm';
import ListFilm from "./pages/user/ListFilm";
import Profile from "./pages/user/Profile";
import ChatUser from "./pages/user/ChatUser";
import EditProfile from "./pages/user/EditProfile";

// Pages Admin
import ListFilmAdmin from "./pages/admin/ListFilmAdmin";
import AddFilm from "./pages/admin/AddFilm";
import EditFilm from "./pages/admin/EditFilm";
import ListTransactionAdmin from "./pages/admin/ListTransaction";
import Complain from "./pages/admin/Complain";

if(localStorage.token){
  setAuthToken(localStorage.token)
}

function App() {
  let navigate = useNavigate()
  const [state, dispatch] = useContext(UserContext)
  console.log(state)

  useEffect(() => {
    if(localStorage.token){
      setAuthToken(localStorage.token)
    }

    if(state.isLogin === false){
      navigate('/')
    } else {
      if (state.user.status === "costumer") {
        navigate('/film')
      } else if(state.user.status === "admin") {
        navigate('/dashboard')
      }
    }       
  }, [state])

  let checkUser = async () => {
    try {
      const response = await API.get("/check-auth")
      console.log(response)

      if(response.status === 404){
        return dispatch({
          type: "AUTH_ERROR"
        })
      }
      
      let payload = response.data.data.user
      payload.token = localStorage.token

      dispatch({
        type: "USER_SUCCESS",
        payload,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(localStorage.token){
      checkUser()
    }
  }, [])

  return (
    <Routes>
      <Route exact path="/" element={<LandingPage /> }/>
      <Route path="/detail-film/:id" element={<DetailFilmPage />}/>
      <Route path="*" element={<NotFound />}   />

      <Route path="/film" element={<LandingPageUser />}/>
      <Route path="/film/:id" element={<DetailFilm />}/>
      <Route path="/profile-user" element={<Profile />}/>
      <Route path="/list-film" element={<ListFilm />}/>
      <Route path="/chat" element={<ChatUser />} />
      <Route path="/edit-profile" element={<EditProfile />}/>

      <Route path="/dashboard" element={<ListFilmAdmin />}/>
      <Route path="/complain" element={<Complain />}/>
      <Route path="/list-transaction" element={<ListTransactionAdmin />}/>
      <Route path="/add-film" element={<AddFilm />}/>
      <Route path="/edit-film/:id" element={<EditFilm />}/>
    </Routes>
  );
}

export default App;
