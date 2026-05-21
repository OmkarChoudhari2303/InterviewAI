import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";

//To prevent the unauthorized access to pages like dashboard, chat we are using protected routes.
function ProtectedRoute({ children }) {
    const { token,loading} = useContext(AuthContext);

    if(loading){
        return(
            <div className="text-white p-10">
                Loading...
            </div>
        )
    }
    if (!token) {
        return <Navigate to="/login" />
    }
    return children
}

export default ProtectedRoute