import React from 'react'
import { Outlet } from "react-router-dom";
import { AppNagivationMenu } from '../components/navigation_menu';
import { NavBar } from "../pages/blank/navbar";
import '../assets/app.scss';

export function PaginaPrincipal(){
    return (
        <div className='container-main'>
            <NavBar/>
            <AppNagivationMenu/>
            <Outlet/>
            <div className='footer-page' >
                <p> © Omega Informática, codificado por Lucas Guedes.</p>
            </div>
        </div>
    )
}