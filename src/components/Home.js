import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { auth } = useAuth();
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/linkpage');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
            <br />
            {
                !!auth?.roles?.find(role => [1984]?.includes(role)) &&
                <span>
                    <Link to="/editor">Go to the Editor page</Link>
                    <br />
                </span>
            }        
            {
                !!auth?.roles?.find(role => [5150]?.includes(role)) &&
                <span>
                    <Link to="/admin">Go to the Admin page</Link>
                    <br />
                </span>
            }        
            {
                !!auth?.roles?.find(role => [1984, 5150]?.includes(role)) &&
                <span>
                    <Link to="/lounge">Go to the Lounge</Link>
                    <br />
                </span>
            }        
            <Link to="/linkpage">Go to the link page</Link>
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home
