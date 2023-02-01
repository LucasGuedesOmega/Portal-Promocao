import React from 'react'
import api from '../../services/api';
import '../../assets/app.scss';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export function Usuario(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return <Editar token={token} navigate={navigate}/>;
}
  
export class Editar extends React.Component{
   
    constructor(props){
        super(props);
        this.state = {
            cliente: 1,
            tokenDecode: jwtDecode(this.props.token),

            username: null,
            senha: null,
            e_mail: null, 
            status: null,
            user_admin: null
        };
    }

    async componentDidMount(){
        await this.getUsuario()
    }

    getUsuario(){
        api.get(`api/v1/usuario?id_usuario=${this.state.tokenDecode.id_usuario}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if(results.data.length > 0){
                this.setState({
                    username: results.data[0].username,
                    senha: results.data[0].senha,
                    e_mail: results.data[0].e_mail,
                    status: results.data[0].status,
                    user_admin: results.data[0].user_admin,
                })
            }
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
              } else if (error.response.data.error === "n�o autorizado"){
                window.location.href='/login'
              } else if (error.name === "AxiosError"){
                window.location.href='/login'
              }
        })
    }

    submitForm(){
        let dados = {
            id_usuario: this.state.tokenDecode.id_usuario,
            username: this.state.username,
            senha: this.state.senha,
            e_mail: this.state.e_mail,
            status: this.state.status,
            user_admin: this.state.user_admin,
            user_app: false,
            admin_posto: false,
            id_empresa: this.state.tokenDecode.id_empresa,
            id_grupo_usuario: this.state.tokenDecode.id_grupo_usuario,
            id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa
        }

        api.post('api/v1/usuario', dados, { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data['Sucesso'] ){
                toast('Usuãrio editado com sucesso!', {
                    duration: 2000,
                    style:{
                        marginRight: '1%',
                        backgroundColor: '#078518',
                        color: 'white'
                    },
                    position: 'bottom-right',
                    icon: <span className="material-symbols-outlined">sentiment_satisfied</span>,
                });
            }
        })
        .catch((error)=>{
            if(error.name === 'AxiosError'){
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
            }

            console.log(error)
            if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                window.location.href="/login"
            } else if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            }
        })
    }

    handleNameValue(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked: target.value;
        const name  = target.name;
        this.setState({
            [name]: value
        })
    }

    render() {
        return(
            <div className='cadastro'>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">{this.state.username}</h3></div>
                            {/* <div className="col-md-2"><button className="btn btn-dark voltar" onClick={()=>{this.props.navigate('/cliente')}}>Página Anterior</button></div> */}
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Username</label>
                                <input className='form-control' defaultValue={this.state.username} name={'usernam'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Senha</label>
                                <input type={'password'} className='form-control' defaultValue={this.state.senha} name={'senha'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>E-mail</label>
                                <input className='form-control' defaultValue={this.state.e_mail} name={'e_mail'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
        
                        <div className="row mt-3">
                            <div className="col-sm"></div>
                            
                            <div className="col-sm "></div>
                            
                            <div className="col-sm ">
                                <button onClick={this.submitForm} className="cadastro__formulario__enviar">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        );
    }
}