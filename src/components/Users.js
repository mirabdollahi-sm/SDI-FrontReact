import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";


const REGISTER_URL = '/users';

const Users = () => {
  const [ users, setUsers ] = useState([]);
  const [ del, setDel ] = useState(false)
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); 
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(REGISTER_URL, {
          signal: controller.signal
        });
        isMounted && setUsers(response.data);
      } catch(err) {
        console.error(err);
      }
    }
    getUsers();
    setDel(false);
    return () => {
        isMounted = false;
        controller.abort();
    }
  },[del])

  return (
    <div className="content-container">
      <div className="list-header" >
        <div className="show-for-mobile">
          Users List
        </div>
        <div className="show-for-descktop">
          <FontAwesomeIcon className="icon" icon={faUser} />
          Users List
        </div>
        <button className="button button--regular" onClick={() => { navigate('/register/0') }}>
          <FontAwesomeIcon className="icon" icon={faPlus} />
          Add User
        </button>
      </div>
      <div className="list-body">
        {
          users?.length? (
            <span>
              {users.map((user, i) => {
                return (
                  <div className="list-item list-item--user" key={i}>
                    <div>
                      {`${i + 1} - ${user.username}`}
                    </div>
                    <div>
                      <button className="button button--regular" onClick={() => { navigate(`/register/${user._id}`) }}>
                        <FontAwesomeIcon className="icon" icon={faEdit} />
                        Edit
                      </button>
                      <button className="button button--regular" onClick={async () => {
                        await axiosPrivate.delete(`users/${user._id}`,
                        {
                          headers: {'Content-Type': 'application/json'},
                          withCredentials: true
                        })
                        setDel(true);
                      }}>
                        <FontAwesomeIcon className="icon" icon={faTrash} />
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </span>
          ) : <div className="list-item">No User to display</div>
        }
      </div>
    </div>
  )
}

export default Users