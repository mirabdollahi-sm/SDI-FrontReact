import Users from "./Users";
import Header from "./Header";

const Admin = () => {
    return (
        <section>
            <Header />
            <div className="page-header">
                <div className="content-container">
                    <h1>Admin Page</h1>
                </div>
            </div>
            <div>
                <Users />
            </div>
        </section>
    )
}

export default Admin
