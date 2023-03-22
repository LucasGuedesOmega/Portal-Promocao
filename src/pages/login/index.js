import React, { useContext } from 'react'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context';
import toast, { Toaster } from 'react-hot-toast';
import ReCAPTCHA from "react-google-recaptcha";

export function Login(){

    const { setToken } = useContext(AuthContext);

    const setTokenF = (token) =>{
        setToken(token)
    }

    const navigate = useNavigate();

    return (<LoginClass setToken={setTokenF} navigate={navigate}/>);
}

class LoginClass extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: 'adminposto',
            senha: '2112',
            tokenCaptcha: null,
        }
    }

    handleNameValue (event){
        const target = event.target;
        const value = target.value;
        const name  = target.name;
     
        this.setState({
            [name]: value
        })
    
    }

    enviar(){
        let tokenApi;
        try{
            // if(!this.state.tokenCaptcha){
            //     toast("Por favor marque a caixa reCAPTCHA.", {
            //         duration: 2000,
            //         style:{
            //             marginRight: '1%',
            //             backgroundColor: '#851C00',
            //             color: 'white'
            //         },
            //         position: 'bottom-right',
            //         icon: <span className="material-symbols-outlined">sentiment_dissatisfied</span>,
            //     });
            //     return;
            // }
            api.post('/api/v1/login', [{'username': this.state.username, 'senha': this.state.senha, 'tipo': 'portal'}])
            .then(async (results)=>{
                tokenApi = results.data.token; 

                localStorage.setItem('tokenApi', tokenApi)

                this.props.setToken(tokenApi);

                this.props.navigate('/');  
            })
            .catch((error)=>{
                console.log(error)
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

    keyPressed (e){
        if (e.key === 'Enter'){
            this.enviar()
        }
    }

    onCaptchaChange(results){
        this.setState({
            tokenCaptcha: results
        });
    }

    reload(){
        window.location.href="/login";
    }

    render(){
        return (
            <div className="content-login">
                <div className="card content-titulo-login"><h2>Login</h2></div>
                <div className="card card-login">
                    <div className="card-body card-body-login">
                        <div className="col-md card-col">
                            <div className="row card-row">
                                <div className='col-md p-0 m-0 col-key' >
                                    <span className="material-symbols-outlined icon-key m-0 w-100">person_filled</span>
                                </div>
                                <div className='col-md p-0 m-0 col-pass'>
                                    <input type="text" className='form-control m-0 control' name='username' onChange={(value)=>{this.handleNameValue(value)}} onKeyDown={(e)=>{this.keyPressed(e)}} placeholder='username' />
                                </div>
                            </div>
                            <div className="row card-row">
                                <div className='col-md p-0 m-0 col-key ' >
                                    <span className="material-symbols-outlined icon-key m-0 w-100 ">key</span>
                                </div>
                                <div className='col-md p-0 m-0 col-pass'>
                                    <input type="password" className='form-control m-0 control ' name='senha' onChange={(value)=>{this.handleNameValue(value)}} onKeyDown={(e)=>{this.keyPressed(e)}} placeholder='senha' />
                                </div>
                            </div>
                            <div className='row card-row '>
                                <ReCAPTCHA 
                                sitekey={process.env.REACT_APP_SITE_KEY}
                                onChange={(results)=>{this.onCaptchaChange(results)}}
                                className="recaptcha"
                                />
                            </div>
                            <div className="row card-row">
                                <input type="button" className='btn-login' value={'Login'} onClick={()=>{this.enviar()}}/>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>

                </div>  
                <Toaster/>
            </div>  
            
        );
    }
   
    
}