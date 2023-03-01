import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { styled } from '@stitches/react';
import { blackA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import jwtDecode from 'jwt-decode';

export function EditarCliente(){

    const { id_cliente } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_cliente={id_cliente} token={token} navigate={navigate}/>
    );
};

export function CadastrarCliente(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_cliente={null} token={token} navigate={navigate}/>
    );
};

const StyledSwitch = styled(SwitchPrimitive.Root, {
    all: 'unset',
    width: 42,
    height: 25,
    backgroundColor: blackA.blackA9,
    borderRadius: '9999px',
    position: 'relative',
    boxShadow: `0 2px 10px ${blackA.blackA7}`,
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    '&:focus': { boxShadow: `0 0 0 2px black` },
    '&[data-state="checked"]': { backgroundColor: 'black' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
    display: 'block',
    width: 21,
    height: 21,
    backgroundColor: 'white',
    borderRadius: '9999px',
    boxShadow: `0 2px 2px ${blackA.blackA7}`,
    transition: 'transform 100ms',
    transform: 'translateX(2px)',
    willChange: 'transform',
    '&[data-state="checked"]': { transform: 'translateX(19px)' },
});

// Exports
export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;

const Flex = styled('div', { display: 'flex', alignItems: 'center' });
const Label = styled('label', {
  color: 'black',
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
});

class Editar extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            id_cliente: this.props.id_cliente,
            nome: null,
            cpf: null,
            e_mail: null,
            telefone: null,
            status: false,

            tokenDecode: jwtDecode(this.props.token),

            showAlert: false, 
            
            empresas: [],
            username: null,
            senha: null,
            status_usuario: false,
            user_app: false,
            id_usuario: null,
            descricao_empresa: null
        }

    }

    componentDidMount(){

        if (this.state.id_cliente){
            this.get_cliente();
        }
    }

    get_cliente(){
        api.get(`api/v1/cliente?id_cliente=${this.state.id_cliente}`,  { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    id_cliente: results.data[0].id_cliente,
                    nome: results.data[0].nome,
                    cpf: results.data[0].cpf,
                    e_mail: results.data[0].e_mail,
                    telefone: results.data[0].telefone,
                    status: results.data[0].status,
                    id_usuario: results.data[0].id_usuario
                }, ()=>{
                    this.get_usuario()
                })  
            }
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.name === "AxiosError"){
                window.location.href='/login'
            }
        })
    }

    get_usuario(){
        if (this.state.id_usuario){
            api.get(`api/v1/usuario?id_usuario=${this.state.id_usuario}`, { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        username: results.data[0].username,
                        senha: results.data[0].senha,
                        status_usuario: results.data[0].status,
                        user_app: results.data[0].user_app,
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        
    }

    submitForm(){
        
        let messageError = null;

        if (!this.state.nome){
            messageError = 'Digite um nome!';
        }else if (!this.state.cpf){
            messageError = 'Digite um cpf!';
        }else if(!this.state.e_mail){
            messageError = 'Digite uma e_mail!'
        }
        
        if(messageError){
            toast(messageError, {
                duration: 2000,
                style:{
                    marginRight: '1%',
                    backgroundColor: '#851C00',
                    color: 'white'
                },
                position: 'bottom-right',
                icon: <span className="material-symbols-outlined">sentiment_dissatisfied</span>,
            });

            return;
        }

        var dados_cliete = [
            {
                id_cliente: this.state.id_cliente,
                nome: this.state.nome,
                cpf: this.state.cpf,
                e_mail: this.state.e_mail,
                telefone: this.state.telefone,
                status: this.state.status,
                id_usuario: this.state.id_usuario,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa
            }
        ]   
        
        let message;

        try{
            api.post('/api/v1/cliente', dados_cliete, { headers: { Authorization: this.props.token}})
            .then((results) => {
                if (results.data['Sucesso']){
                    if (this.props.id_cliente){
                        message = 'Cliente editado com sucesso!';
                    }else{
                        message = 'Cliente cadastrado com sucesso!';
                    }

                    toast(message, {
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
                console.log(error)

                if (error.response.data.error === "Token expirado"){
                    window.location.href="/login";
                } else if (error.response.data.error === "não autorizado"){
                    window.location.href='/login';
                } else if (error.name === "AxiosError"){
                    window.location.href='/login';
                }
            })
        }catch(err){
            console.log(err)
        }
    }

    submitFormUsuarios(){
        let message = null;

        if (!this.state.username){
            message = 'Digite um username!';
        }else if(!this.state.senha){
            message = 'Digite uma senha!'
        }

        if(message){
            toast(message, {
                duration: 2000,
                style:{
                    marginRight: '1%',
                    backgroundColor: '#851C00',
                    color: 'white'
                },
                position: 'bottom-right',
                icon: <span className="material-symbols-outlined">sentiment_dissatisfied</span>,
            });
            return;
        }

        var dados_usuario = [
            {
                id_usuario: this.state.id_usuario,
                username: this.state.username,
                senha: this.state.senha,
                status: this.state.status_usuario,
                user_app: this.state.user_app,
                user_admin: false,
                admin_posto: false,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa,
                id_grupo_usuario: 'null'
            }
        ]       

        try{
            api.post('/api/v1/usuario', dados_usuario, { headers: { Authorization: this.props.token}})
            .then((results) => {
                if (results.data.Sucesso){
                    this.setState({
                        id_usuario: results.data.id
                    }, ()=>this.submitForm())
                }
            })
            .catch((error)=>{
                console.log(error)
                if (error.response.data.error === "Token expirado"){
                    window.location.href="/login"
                } else if (error.response.data.error === "não autorizado"){
                    window.location.href='/login'
                } else if (error.name === "AxiosError"){
                    window.location.href='/login'
                }

            })
        }catch(err){
            console.log(err)
        }
    }

    handleNameValue(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked: target.value;
        const name  = target.name;
        this.setState({
            [name]: value
        })
        
    }

    handleCheckValue(value, name){
        this.setState({
            [name]: value
        });
    }

    render(){
        return (
            <div className='cadastro'>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Usuário</h3></div>

                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Usename</label>
                                <input className='form-control' defaultValue={this.state.username} name={'username'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Senha</label>
                                <input type={'password'} className='form-control' defaultValue={this.state.senha} name={'senha'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 15}} >
                                    <Label htmlFor="s9" css={{ paddingRight: 15 }}>
                                        Status
                                    </Label>
                                    <Switch name='status_usuario' checked={this.state.status_usuario} onCheckedChange={(value)=>{this.handleCheckValue(value, 'status_usuario')}} id="s9">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 15}} >
                                    <Label htmlFor="s8" css={{ paddingRight: 15 }}>
                                        App
                                    </Label>
                                    <Switch name='user_app' checked={this.state.user_app} onCheckedChange={(value)=>{this.handleCheckValue(value, 'user_app')}} id="s8">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>
                        </div>
                    </div>
                </div>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Cliente</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Nome</label>
                                <InputMask className='form-control' defaultValue={this.state.nome} name={'nome'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>CPF</label>
                                <InputMask mask="999.999.999-99" className='form-control' value={this.state.cpf} name={'cpf'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>E-mail</label>
                                <InputMask className='form-control' defaultValue={this.state.e_mail} name={'e_mail'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Telefone</label>
                                <InputMask mask="(99)99999-9999" className='form-control' value={this.state.telefone} name={'telefone'} onChange={(value)=>{this.handleNameValue(value)}}/>
                            </div>
                        </div>
        
                        <div className="row mt-3">
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 4}} className='semana__col__check'>
                                    <Label htmlFor="s8" css={{ paddingRight: 15 }}>
                                        Status
                                    </Label>
                                    <Switch name='status' checked={this.state.status} onCheckedChange={(value)=>{this.handleCheckValue(value, 'status')}} id="s1">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>
                            
                            <div className="col-sm  "></div>
                            
                            <div className="col-sm ">
                                <button onClick={()=>{this.submitFormUsuarios()}} className="cadastro__formulario__enviar">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        );
    }

}