import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
    const { auth } = useAuth();
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/login');
    }
    return (
        <header className='header'>
            <div className='content-container'>
                <div className='header__content'>
                    <Link className='header__title' to='/'  >
                        <h1>Samim Directory Indexing</h1>
                    </Link>               
                    {
                        !!auth?.roles?.find(role => [5150]?.includes(role)) &&
                        <NavLink
                            to='/admin'
                            className={({ isActive }) => (isActive ? 'active' : '')}>
                            Admin
                        </NavLink>
                    }
                    {
                        !!auth?.roles?.find(role => [1984]?.includes(role)) && false &&
                        <NavLink 
                            to='/editor'    
                            className={({ isActive }) => (isActive ? 'active' : '')}>
                            Editor
                        </NavLink>
                    }
                    <button className='button button--link' onClick={logout}>Log Out</button>
                </div>
            </div>
        </header>
    );
}

export default Header;