import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import {Link}  from 'react-router-dom'

const NavbarComponent = () => {
    return (
        <>
            <Navbar expand="lg" className="main-navbar bg-body-tertiary sticky-lg-top" >
                <Container>
                    {/* <Navbar.Toggle aria-controls="basic-navbar-nav"/> */}
                    <Navbar id="basic-navbar-nav">
                        <Nav>
                            <Navbar.Brand><Link to='/'>Stripe</Link></Navbar.Brand>
                            <Navbar.Brand><Link to='/'><Button >LOGIN</Button></Link></Navbar.Brand>
                            <Navbar.Brand><Link to='/'>Username</Link></Navbar.Brand>
                            <Navbar.Brand><Link to='/'><Button >LOGOUT</Button></Link></Navbar.Brand>
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
        </>
    );
};

export default NavbarComponent;