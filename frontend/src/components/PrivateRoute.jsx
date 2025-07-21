import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const privateRoute = ({children}) => {
    const {user} = useAuth();
    return user ? children : <Navigate to="/login" />;
}

export default privateRoute;