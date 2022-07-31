import React, { useContext } from 'react'
import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Icon.png';
import {UserContext} from '../../context/userContext'
import AvatarBlank from "../../assets/Profile/AvatarBlank.jpg"

// Data dummy
// import Profile from '../../assets/Profile/Profile.jpg'


function NavUser() {
    let navigate = useNavigate()
    const [state, dispatch] = useContext(UserContext)    

    console.log(state.user)
    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT",
        })
        navigate("/")
    }

    const userMenu = (
        <Image src={state?.user?.img ? state.user.img : AvatarBlank } alt="user avatar" roundedCircle style={{ width: '40px'}}/>
    )
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        <Link to='/film'>
                            <img src={Logo} alt="Cinema Online" height="30" className="d-inline-block align-top"/>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav className="bg-collapse pt-lg-0 pt-md-1">
                        <NavDropdown title={userMenu} id="basic-nav-dropdown">
                                <NavDropdown.Item>
                                    <Link to='/profile-user' className='text-decoration-none text-dark'>
                                    Profile
                                    </Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Link to='/list-film' className='text-decoration-none text-dark'>
                                        My List Film
                                    </Link>
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavUser