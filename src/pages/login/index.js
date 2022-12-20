import React, { useState, useContext } from 'react'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context';
import toast, { Toaster } from 'react-hot-toast';

export function Login (props) {

    const { setToken } = useContext(AuthContext);
    const [username, setUsername] = useState();
    const [senha, setSenha] = useState();

    const navigate = useNavigate();
    
    const handleNameValue = (event) => {
        const target = event.target;
        const value = target.value;
        const name  = target.name;
        if (name === 'username'){
            setUsername(value)
        }else{
            setSenha(value)
        }
    }

    const enviar = () => {
        let tokenApi;
        try{
            api.post('/api/v1/login', [{'username': username, 'senha':senha, 'tipo': 'portal'}])
            .then(async (results)=>{
                tokenApi = results.data.token; 

                localStorage.setItem('tokenApi', tokenApi)

                setToken(tokenApi);

                navigate('/');  
            })
            .catch((error)=>{
                toast(error.response.data.Error, {
                    duration: 2000,
                    style:{
                        marginRight: '1%',
                        backgroundColor: '#851C00',
                        color: 'white'
                    },
                    position: 'bottom-right',
                    icon: <span className="material-symbols-outlined">sentiment_dissatisfied</span>,
                });
            })
        }catch(error){
            return false
        }
    }   

    const keyPressed = (e) => {
        if (e.key === 'Enter'){
            enviar()
        }
    }

    return (
        <div className="content-login">
            
            <div className='login'>
                <div className="card content-titulo-login"><h2>Login</h2></div>
                <div className="card card-login">
                    <div className="card-body card-body-login">
                        <div className="col-md card-col">
                            <div className="row card-row">
                                <div className='col-md p-0 m-0 col-key' >
                                    <span className="material-symbols-outlined icon-key m-0 w-100">person_filled</span>
                                </div>
                                <div className='col-md p-0 m-0 col-pass'>
                                    <input type="text" className='form-control m-0 control' name='username' onChange={(value)=>{handleNameValue(value)}} onKeyDown={(e)=>{keyPressed(e)}} placeholder='username' />
                                </div>
                            </div>
                            <div className="row card-row">
                                <div className='col-md p-0 m-0 col-key' >
                                    <span className="material-symbols-outlined icon-key m-0 w-100">key</span>
                                </div>
                                <div className='col-md p-0 m-0 col-pass'>
                                    <input type="password" className='form-control m-0 control' name='senha' onChange={(value)=>{handleNameValue(value)}} onKeyDown={(e)=>{keyPressed(e)}} placeholder='senha' />
                                </div>
                            </div>
                            <div className="row card-row">
                                <input type="button" className='btn-login' value={'Login'} onClick={()=>{enviar()}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
            <Toaster/>
        </div>  
        
    );
    
}