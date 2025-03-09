import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function User() {
    const userUrl = "http://localhost:3000/user";
    const token = localStorage.getItem("token");
        const [user, setUser] = useState([]);
        const navigate = useNavigate()

    useEffect(() => {
            getUser();
        }, []);

        const getUser = () => {
            fetch(userUrl+"/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            })
                .then((res) => res.json())
                .then((res) => setUser(res))
                .catch((error) => console.error("Error fetching cart:", error));
        };

    return (
        <div className="order-md-last">
            <div className="d-flex justify-content-center">
                {user.profile_picture ? <img src={user.profile_picture} style={{ borderRadius: "50%", objectFit: "cover" }} width="150" height="150"/> : <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"></path>
                </svg>}
                
            </div>
            <h4 className="d-flex justify-content-center my-3">
                <span className="text-primary">{user.first_name +" "+ user.last_name}</span>
            </h4>
            <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 className="my-0">Contact</h6>
                        <small className="text-body-secondary">{user.phone_number}</small>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 className="my-0">Email</h6>
                        <small className="text-body-secondary">{user.email}</small>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 className="my-0">Address</h6>
                        <small className="text-body-secondary">{user.address}</small>
                    </div>
                </li>
            </ul>

            <button className="w-100 btn btn-primary btn-lg" data-bs-dismiss="offcanvas" type="submit" onClick={()=>{
                localStorage.removeItem('token');
                navigate('/login')
            }}>Logout</button>
        </div>
    )
}

export default User;