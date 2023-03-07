import Header from "./Header";
import Dirs from './Dirs';

const Home = () => {
    return (
        <section>
            <Header />
            <div className="page-header">
                <div className="content-container">
                    <h1>Directories</h1>
                </div>
            </div>
            <div>
                <Dirs/>
            </div>
        </section>
    )
}

export default Home
