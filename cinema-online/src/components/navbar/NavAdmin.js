import React, { useContext} from 'react'
import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import Logo from '../../assets/Icon.png';
import AvatarBlank from "../../assets/Profile/AvatarBlank.jpg"


function NavAdmin() {
    const [state, dispatch] = useContext(UserContext)
    let navigate = useNavigate()
    // console.log(state.user)
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
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="sticky-top">
            <Container>
                <Navbar.Brand>
                    <Link to='/dashboard'>
                    <img src={Logo} alt="Cinema Online" height="30" className="d-inline-block align-top"/>
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="bg-collapse pt-lg-0 pt-md-1">
                    <NavDropdown title={userMenu} id="basic-nav-dropdown">
                            <NavDropdown.Item>
                                <Link to='/chat-admin' className='text-decoration-none text-dark'>
                                    Chat
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to='/list-transaction' className='text-decoration-none text-dark'>
                                    List Transaction
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to='/add-film' className='text-decoration-none text-dark'>
                                    Add Film
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

export default NavAdmin