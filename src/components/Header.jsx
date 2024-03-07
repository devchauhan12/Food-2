import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { authentication } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { db } from '../redux/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
    const cart = useSelector((state) => state.cart)
    const auth = getAuth();

    const { login, setLogin } = useContext(authentication)
    const navigate = useNavigate();
    const handleLogout = async () => {
        setLogin(false);
        const userRef = doc(db, `LoggedIn/pYqMp57QYmsXBFST9RrL`);
        await setDoc(userRef, { user: {} })
        await signOut(auth)
        navigate('/')
    }
    return (
        <Navbar expand="lg" className="navbar-dark bg-dark py-3">
            <Container fluid>
                <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/products"> Products </Nav.Link>
                    </Nav>
                    <div className={`d-flex`}>
                        <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />

                        {
                            !login ? <>
                                <Button className='me-1' onClick={() => navigate('/login')}>Login</Button>
                                <Button onClick={() => navigate('/signup')}>SignUp</Button>
                            </>
                                :
                                <>
                                    <Nav.Link as={Link} to="/cart" className='card-button mx-3 position-relative d-flex text-white'>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cart && cart.length}
                                        </span>
                                        <i className="las la-shopping-cart fs-2 align-self-center"></i>
                                    </Nav.Link>
                                    <Button onClick={handleLogout} className='d-flex'>
                                        <span className='me-1'>Log</span> <span>Out</span>
                                    </Button>
                                </>

                        }
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header