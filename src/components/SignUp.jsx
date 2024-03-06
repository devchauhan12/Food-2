import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { app, db } from '../redux/firebase';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getCart } from '../redux/Action';
import { useDispatch } from 'react-redux';

const SignUp = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()

    const initial = {
        username: '',
        email: '',
        password: '',
    }
    const [input, setInput] = useState(initial)
    const [errors, setErrors] = useState({})
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }
    const navigate = useNavigate()

    function validate() {
        let error = {}

        if (input.username.length < 1) {
            error.username = 'Enter Your Username'
        }
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
            createUserWithEmailAndPassword(auth, input.email, input.password)
                .then((userCredential) => {
                    updateProfile(auth.currentUser, {
                        displayName: input.username
                    }).then(async () => {
                        const userRef = doc(db, `LoggedIn/pYqMp57QYmsXBFST9RrL`);
                        await setDoc(userRef, { user: { uid: auth.currentUser.uid, displayName: input.username, email: input.email } });
                        await setDoc(doc(db, "UserCart", auth.currentUser.uid), { cart: [] });
                        dispatch(getCart([]))
                    }).catch((error) => {
                        console.log(error)
                    });
                })
            navigate('/login')
            setErrors({})
            setInput(initial)
        }
    }
    return (
        <div className="form-container mx-auto mt-4">
            <p className="title">Welcome</p>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" className="input" name='username' placeholder="Username" value={input.username} onChange={handleChange} />
                {errors.username && <span>{errors.username}</span>}
                <input type="email" className="input" name='email' placeholder="Email" value={input.email} onChange={handleChange} />
                {errors.email && <span>{errors.email}</span>}
                <input type="password" className="input" name='password' placeholder="Password" value={input.password} onChange={handleChange} />
                {errors.password && <span>{errors.password}</span>}
                <button className="form-btn">Sign up</button>
            </form>
            <p className="sign-up-label d-flex">
                Already have an account?<Nav.Link as={Link} to="/" className="sign-up-link text-success">Login</Nav.Link>
            </p>

        </div>
    )
}

export default SignUp