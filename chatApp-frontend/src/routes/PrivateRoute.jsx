import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { routePath } from "./RoutePath";

const PrivateRoute = ({ children }) => {
    const { authUser } = useAuthContext();
    console.log({authUser})
    if (!authUser) {
        return <Navigate to={routePath.auth.login} />;
    }
    
    return children;
};

export default PrivateRoute;
