import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    let token = localStorage.getItem('tokenApi');

    let auth = {'token': token}

    return (
        auth.token? <Outlet/>:<Navigate to='/login'/>
    )
}

export default PrivateRoutes;