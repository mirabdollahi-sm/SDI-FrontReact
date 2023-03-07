import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "../api/axios";
const LOGIN_URL = '/auth'

const Login = () => {
    const  { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();
    
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // useEffect(() => {
    //     userRef.current.focus();
    // }, []);

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken })
            setUser('');
            setPwd('');
            navigate(from, { replace: true});
        } catch(err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing username or password')
            } else if (err.response?.status === 401) {
                setErrMsg('Username or password incorrect');
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }
    return (
        <div className="box-layout">
            <div className="box-layout__box">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1 className="box-layout__title">Samim</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text"
                        className="login-input"
                        // ref={useRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required 
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        className="login-input"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required 
                    />
                    <button className="button">Log In</button>
                </form>
                {
                    // <p>
                    // Need an Acount?<br />
                    // <span className="line">
                    //     {/*router link*/}                    
                    //     <a href="#">Sign Up</a>
                    // </span>
                    // </p>
                }
            </div>
        </div>
    )
}

export default Login