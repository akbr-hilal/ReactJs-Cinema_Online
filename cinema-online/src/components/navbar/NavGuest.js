import React, { useState } from 'react';
import Logo from '../../assets/Icon.png';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Login from '../modal/auth/Login';
import Register from '../modal/auth/Register';
import { Link } from 'react-router-dom';

function NavGuest() {
 

    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const handleShowLogin = () =>  setShowLogin(true)
    const handleShowRegister = () => setShowRegister(true)
    
    const handleLogin = () => {
        handleShowLogin()
    }
    const handleCloseLogin = () => setShowLogin(false)
    
    const handleRegister = () => {
        handleShowRegister()
    }
    const handleCloseRegister = () => setShowRegister(false)



    return ( 
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        <Link to='/'>
                        <img src={Logo} alt="Cinema Online" height="30" className="d-inline-block align-top"/>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav className="bg-collapse pt-lg-0 pt-md-1">
                            <button className='btn btn-dark me-0 me-lg-3' onClick={handleLogin}>Login</button> 
                        </Nav>
                        <Nav className="bg-collapse pt-lg-0 pt-md-1">
                            <button className='btn btn-danger mt-2 mt-lg-0' onClick={handleRegister}>Register</button> 
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Login show={showLogin} handleClose={handleCloseLogin}/>
            <Register show={showRegister} handleClose={handleCloseRegister}/>
        </>
    )
}

export default NavGuest