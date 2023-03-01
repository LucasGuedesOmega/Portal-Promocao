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

export function EditarFuncionario(){

    const { id_funcionario } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_funcionario={id_funcionario} token={token} navigate={navigate}/>
    );
};

export function CadastrarFuncionario(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_funcionario={null} token={token} navigate={navigate}/>
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

            id_funcionario: this.props.id_funcionario,
            nome: null,
            cpf: null,
            e_mail: null,
            telefone: null,
            status: false,
            id_empresa: null,

            tokenDecode: jwtDecode(this.props.token),

            showAlert: false, 
            
            empresas: [],
            grupos_usuarios: [],
            username: null,
            senha: null,
            status_usuario: false,
            user_app: false,
            id_usuario: null,
            id_grupo_usuario: null,
            descricao_empresa: null,
            descricao_grupo_usuario: null,
        }

    }

    async componentDidMount(){

        if (this.state.id_funcionario){
            await this.get_funcionario();
        }
        
        this.preenche_select_empresa();
        this.preenche_select_grupo_usuario();

    }

    async get_funcionario(){
        await api.get(`api/v1/funcionario?id_funcionario=${this.state.id_funcionario}`,  { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    id_funcionario: results.data[0].id_funcionario,
                    nome: results.data[0].nome,
                    cpf: results.data[0].cpf,
                    e_mail: results.data[0].e_mail,
                    telefone: results.data[0].telefone,
                    status: results.data[0].status,
                    id_empresa: results.data[0].id_empresa,
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
            }
        })
    }

    get_usuario(){
       
        api.get(`api/v1/usuario?id_usuario=${this.state.id_usuario}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    username: results.data[0].username,
                    senha: results.data[0].senha,
                    status_usuario: results.data[0].status,
                    user_app: results.data[0].user_app,
                    id_grupo_usuario: results.data[0].id_grupo_usuario
                }, ()=>{
                    this.get_default_empresa()
                    this.get_default_grupo_usuario()
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })   
    }

    async get_default_empresa(){
     
        await api.get(`api/v1/empresa?id_empresa=${this.state.id_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    descricao_empresa: results.data[0].razao_social
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        
    }

    async get_default_grupo_usuario(){
        if(this.state.id_grupo_usuario){
            await api.get(`api/v1/grupo-usuario?id_grupo_usuario=${this.state.id_grupo_usuario}`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if(results.data.length > 0){
                    this.setState({
                        descricao_grupo_usuario: results.data[0].nome
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

        var dados_funcionario = [
            {
                id_funcionario: this.state.id_funcionario,
                nome: this.state.nome,
                cpf: this.state.cpf,
                e_mail: this.state.e_mail,
                telefone: this.state.telefone,
                status: this.state.status,
                id_empresa: this.state.id_empresa,
                id_usuario: this.state.id_usuario,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa
            }
        ]   

        let message;

        try{
            api.post('/api/v1/funcionario', dados_funcionario, { headers: { Authorization: this.props.token}})
            .then((results) => {
                if (results.data['Sucesso']){
                    if (this.props.id_funcionario){
                        message = 'Funcionario editado com sucesso!';
                    }else{
                        message = 'Funcionario cadastrado com sucesso!';
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
                }
            })
        }catch(err){
            console.log(err)
        }
    }

    submitFormUsuarios(){
        let message = null;

        if (!this.state.id_empresa){
            message = 'Selecione uma empresa';
        }else if (!this.state.username){
            message = 'Digite um username!';
        }else if(!this.state.senha){
            message = 'Digite uma senha!'
        }else if(!this.state.id_grupo_usuario){
            message = 'Escolha um grupo de usuário!'
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
                user_admin: false,
                user_app: this.state.user_app,
                admin_posto: false,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa,
                id_grupo_usuario: this.state.id_grupo_usuario,
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

    preenche_select_empresa(){

        let empresaList = [];
        let empresaDict;

        api.get(`/api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{  
            if (results.data.length > 0){
                for(let i=0; i<results.data.length; i++){
                    empresaDict = {
                        value: results.data[i].id_empresa,
                        text: results.data[i].razao_social
                    }
                    empresaList.push(empresaDict)
                }
                this.setState({
                    empresas: empresaList
                })
            }
        })
        .catch((error)=>{
            console.log(error.response.data)
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

            if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                window.location.href="/login";
            } 
            
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login";
            }
        }) 
    }

    preenche_select_grupo_usuario(){
        let fill_list = [];
    
        api.get(`api/v1/grupo-usuario`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            for(let i = 0; i < results.data.length; i++){
                let fill_dict = {
                    value: results.data[i].id_grupo_usuario,
                    text: results.data[i].nome,
                }

                fill_list.push(fill_dict);
            }

            this.setState({
                grupos_usuarios: fill_list
            })
        })
        .catch((error)=>{   
            console.log(error)
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

    handleCheckValue(value, name){
        this.setState({
            [name]: value
        });
    }

    render(){
        let default_empresa;
        if (this.state.id_empresa && this.state.descricao_empresa){
            default_empresa = {value: this.state.id_empresa, text: this.state.descricao_empresa}
        } else {
            default_empresa = {value: 0, text: 'Selecione uma empresa'}
        }

        let default_grupo_usuario;
        if (this.state.id_grupo_usuario && this.state.descricao_grupo_usuario){
            default_grupo_usuario = {value: this.state.id_grupo_usuario, text: this.state.descricao_grupo_usuario}
        } else {
            default_grupo_usuario = {value: 0, text: 'Selecione um grupo de usuário'}
        }
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
                            <div className="col-sm">
                                <select name='id_empresa' onChange={(value)=>{this.handleNameValue(value)}} className='form-select'>
                                    <option defaultValue={default_empresa.value}>{default_empresa.text}</option>
                                    { 
                                        this.state.empresas.map((item, key)=>(
                                            <option key={key} value={item.value}>{item.text}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='col-sm'>
                                <select name='id_grupo_usuario' onChange={(value)=>{this.handleNameValue(value)}} className='form-select'>
                                    <option defaultValue={default_grupo_usuario.value}>{default_grupo_usuario.text}</option>
                                    { 
                                        this.state.grupos_usuarios.map((item, key)=>(
                                            <option key={key} value={item.value}>{item.text}</option>
                                        ))
                                    }
                                </select>
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
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Funcionário</h3></div>
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