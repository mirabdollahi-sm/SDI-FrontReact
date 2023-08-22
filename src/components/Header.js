import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLohout';

const Header = () => {
    const { auth } = useAuth();
    const logout = useLogout();
    const navigate = useNavigate();
    const signOut = async () => {
        await logout();
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
                        auth.role === 'admin' &&
                        <NavLink
                            to='/admin'
                            className={({ isActive }) => (isActive ? 'active' : '')}>
                            Admin
                        </NavLink>
                    }
                    {
                        ( auth.role === 'admin' || auth.role === 'editor' ) && false &&
                        <NavLink 
                            to='/editor'    
                            className={({ isActive }) => (isActive ? 'active' : '')}>
                            Editor
                        </NavLink>
                    }
                    <button className='button button--link' onClick={signOut}>Logout</button>
                </div>
            </div>
        </header>
    );
}

export default Header;