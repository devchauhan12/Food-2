import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app, db } from '../redux/firebase';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { authentication } from '../App';
import { useDispatch } from 'react-redux';
import { getCart } from '../redux/Action';

const Login = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app)
    const { login, setLogin } = useContext(authentication)

    const initial = {
        email: '',
        password: '',
    }
    const [input, setInput] = useState(initial)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }
    const navigate = useNavigate()

    function validate() {
        let error = {}

        if (input.email.length < 1) {
            error.email = 'Enter Your Email'
        }
        if (input.password.length < 1) {
            error.password = 'Enter Your Password'
        }
        return error;
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const checkErrors = validate()

        if (Object.keys(checkErrors).length > 0) {
            setErrors(checkErrors)
        } else {
            checkUser()
            setErrors({})
            setInput(initial)

        }
    }

    const checkUser = () => {
        signInWithEmailAndPassword(auth, input.email, input.password)
            .then(async (userCredential) => {
                Swal.fire({
                    title: "Login Successfully !",
                    text: "Visit our home page...",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1700
                });
                const userRef = doc(db, `LoggedIn/pYqMp57QYmsXBFST9RrL`);
                await setDoc(userRef, { user: { uid: auth.currentUser.uid, displayName: input.username, email: input.email } });
                setLogin(true)
                navigate('/')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                console.log(errorCode);
                Swal.fire({
                    title: "Invalid User Or Password  !",
                    text: "Try Again",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1700
                });
            });
    }

    const GoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const cartRef = doc(db, `UserCart/${result.user.uid}`);
                let userCart = (await getDoc(cartRef)).data();
                if (userCart === undefined) {
                    await setDoc(doc(db, "UserCart", result.user.uid), { cart: [] });
                } else {
                    let cart = (await getDoc(doc(db, `UserCart/${result.user.uid}`))).data()
                    dispatch(getCart(cart.cart))
                }
                const userRef = doc(db, `LoggedIn/pYqMp57QYmsXBFST9RrL`);
                await setDoc(userRef, { user: { uid: result.user.uid, displayName: result.user.displayName, email: result.user.email } });
                Swal.fire({
                    title: "Login Successfully !",
                    text: "Visit our home page...",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1700
                });
                setLogin(true)
                navigate('/')
            }).catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className="form-container mx-auto mt-4">
            <p className="title">Welcome back</p>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
                <input type="email" className="input" name='email' placeholder="Email" value={input.email} onChange={handleChange} />
                {errors.email && <span>{errors.email}</span>}
                <input type="password" className="input" name='password' placeholder="Password" value={input.password} onChange={handleChange} />
                {errors.password && <span>{errors.password}</span>}
                <p className="page-link">
                    <span className="page-link-label">Forgot Password?</span>
                </p>
                <button className="form-btn">Log in</button>
            </form>
            <p className="sign-up-label d-flex">
                Don't have an account?<Nav.Link as={Link} to="/signup" className="sign-up-link text-success">Sign up</Nav.Link>
            </p>
            <div className="buttons-container">
                <p className='text-center fw-bolder fs-5 m-0 '>OR</p>
                <button onClick={GoogleLogin} className="google-login-button">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" className="google-icon" viewBox="0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
  c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
  c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
  C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
  c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
  c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    <span>Log in with Google</span>
                </button>
            </div>
        </div>
    )
}

export default Login