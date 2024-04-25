import React from 'react'
import { useAuth } from "../hooks/auth";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Image } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    library.add(fas);
    const { logout, cookies } = useAuth();

    const handleLogout = async (e) => {
        e.preventDefault();
        logout(true);
    }

    const user = cookies.user;

    const UserMenu = (
        <Image
            src={user.image ? process.env.REACT_APP_API_BASE_URL + 'storage/' + user.image : 'https://via.placeholder.com/150'}
            alt="UserName profile image"
            roundedCircle
            style={{ width: '30px' }}
        />
    )

    return (
        <header className="App-header">
            <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/home">My Health</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            {cookies.token ? (
                                <>
                                    <NavDropdown title="Relatórios" id="reports-dropdown">
                                        <NavDropdown.Item href="/water-intake-report">Consumo de Água</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title={UserMenu} id="profile-dropdown">
                                        <NavDropdown.Item href="/settings">
                                            <FontAwesomeIcon icon={['fa', 'sliders']} /> Preferências
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout} style={{ 'color': 'red' }}>
                                            <FontAwesomeIcon icon={['fa', 'right-from-bracket']} /> Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : null}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header