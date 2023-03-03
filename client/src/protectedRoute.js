import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const authenticated = localStorage.getItem("qpwoeirutyalskdjfhgzmxncb");
    if(!authenticated){
        return <Navigate to="/login"/>
    }
    return children
}