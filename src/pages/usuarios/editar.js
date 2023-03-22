import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { styled } from '@stitches/react';
import { blackA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export function EditarUsuario(){

    const { id_usuario } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Editar id_usuario={id_usuario} token={token} navigate={navigate}/>);
};

export function CadastrarUusario(){
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Editar id_usuario={null} token={token} navigate={navigate}/>);
}

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
            id_usuario: this.props.id_usuario,
            username: null,
            senha: null, 
            status: null,
            user_admin: false, 
            user_app: false,
            id_grupo_empresa: 'null',
            id_grupo_usuario: 'null',
            admin_posto: false,

            descricao_empresa: null,
            descricao_grupo_empresa: null,

            tokenDecode: jwtDecode(this.props.token),

            empresas: [],
            grupo_empresa: []
        }

        this.submitForm = this.submitForm.bind(this);

    }

    async componentDidMount(){
        if (this.state.id_usuario){ 
            await this.get_usuario()
        }

        this.preenche_select_empresa()
        this.preenche_select_grupo_empresa()
    }

    async get_usuario(){
        try{
            await api.get(`api/v1/usuario?id_usuario=${this.state.id_usuario}`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        id_usuario: this.props.id_usuario,
                        username: results.data[0].username,
                        senha: results.data[0].senha,
                        status: results.data[0].status,
                        user_admin: results.data[0].user_admin,
                        user_app: results.data[0].user_app,
                        admin_posto: results.data[0].admin_posto,
                        id_grupo_usuario: results.data[0].id_grupo_usuario,
                    })

                    if(results.data[0].id_grupo_empresa){
                        this.setState({
                            id_grupo_empresa: results.data[0].id_grupo_empresa,
                        })
                    }
                        
                }
            })
            .catch((error)=>{
                if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                    window.location.href="/login"
                } else if (error.response.data.error === "Token expirado"){
                    window.location.href="/login"
                }
            })
            
            if(this.state.id_grupo_empresa !== 'null'){
                api.get(`/api/v1/grupo-empresa?id_grupo_empresa=${this.state.id_grupo_empresa}`, { headers: { Authorization: this.props.token}})
                .then((results)=>{
                    if (results.data.length>0){
                        this.setState({
                            descricao_grupo_empresa: results.data[0].descricao
                        })
                    }
                }).catch((error)=>{
                    console.log(error)
                    if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                        window.location.href="/login"
                    } else if (error.response.data.error === "Token expirado"){
                        window.location.href="/login"
                    } else if (error.response.data.error === "não autorizado"){
                        window.location.href='/login'
                    }
                });
            }

        }catch(error){
            console.log(error)
        }
    }

    preenche_select_grupo_empresa(){

        let grupoEmpresaList = [];
        let grupoEmpresaDict;

        api.get(`/api/v1/grupo-empresa`, { headers: { Authorization: this.props.token}})
        .then((results)=>{  
            if (results.data.length > 0){
                for(let i=0; i<results.data.length; i++){
                    grupoEmpresaDict = {
                        value: results.data[i].id_grupo_empresa,
                        text: results.data[i].descricao
                    }
                    grupoEmpresaList.push(grupoEmpresaDict)
                }
                this.setState({
                    grupo_empresa: grupoEmpresaList
                })
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

            if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                window.location.href='/login'
            } 
            
            if (error.response.data.error === "Token expirado"){
                window.location.href='/login'
            }
        }) 
    }

    submitForm(){

        var dados_usuario = [
            {
                id_usuario: this.state.id_usuario,
                username: this.state.username,
                senha: this.state.senha,
                status: this.state.status,
                user_admin: this.state.user_admin,
                user_app: this.state.user_app,
                admin_posto: this.state.admin_posto,
                id_grupo_empresa: this.state.id_grupo_empresa,
                id_grupo_usuario: 'null'
            }
        ]       
        
        let message;

        try{
            api.post('/api/v1/usuario', dados_usuario, { headers: { Authorization: this.props.token}})
            .then((results) => {
                if (results.data['Sucesso']){
                    if (this.state.id_usuario){
                        message = 'Usuário editado com sucesso!'
                    } else{
                        message = 'Usuário cadastrado com sucesso!'
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

                if (error.response.data.error === "Token expirado"){
                    window.location.href="/login"
                } else if (error.response.data.error === "não autorizado"){
                    window.location.href='/login'
                } else if (error.response.data.error === 'Você não tem permissão'){
                    toast(error.response.data.Error, {
                        duration: 2000,
                        style:{
                            marginRight: '1%',
                            backgroundColor: '#851C00',
                            color: 'white'
                        },
                        position: 'bottom-right',
                        icon: <span className="material-symbols-outlined">sentiment_satisfied</span>,
                    });
                    this.props.navigate(-1)
                }

            });
        }catch(err){
            console.log(err)
        }
    }

    handleNameValue(event){
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked: target.value;
        const name  = target.name;

        if(value === 'Selecione uma empresa'){
            value = 'null'
        }

        if(value === 'Selecione um grupo de empresa'){
            value = 'null'
        }

        this.setState({
            [name]: value
        })
    }

    handleCheckValue(value, name){
        this.setState({
            [name]: value
        });
    }

    ressetGrupoEmpresa(){
        this.setState({
            id_grupo_empresa: 'null'
        }, (()=>{
            this.submitForm()
            window.location.href=`/editar-usuario/${this.state.id_usuario}`
        }))
    }

    render(){
        let default_grupo_empresa;
        if (this.state.id_grupo_empresa && this.state.descricao_grupo_empresa){
            default_grupo_empresa = {value: this.state.id_grupo_empresa, text: this.state.descricao_grupo_empresa}
        } else {
            default_grupo_empresa = {value: 'null', text: 'Selecione um grupo de empresa'}
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
                                <InputMask className='form-control' defaultValue={this.state.username} name={'username'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Senha</label>
                                <input type={'password'} className='form-control' defaultValue={this.state.senha} name={'senha'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Grupo Empresa</label>
                                <select name='id_grupo_empresa' onChange={(value)=>{this.handleNameValue(value)}} className='form-select'>
                                    <option defaultValue={default_grupo_empresa.value}>{default_grupo_empresa.text}</option>
                                    { 
                                        this.state.grupo_empresa.map((item, key)=>(
                                            <option key={key} value={item.value}>{item.text}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='col-sm row'>
                                <label className='cadastro__formulario__label'></label>
                                <button onClick={()=>this.ressetGrupoEmpresa()} className="bt_apagar_empresa">Apagar empresa</button>
                            </div>
                        </div>
                        
                        <div className="row mt-3">
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 4}} className='semana__col__check'>
                                    <Label htmlFor="s8" css={{ paddingRight: 15 }}>
                                        Status
                                    </Label>
                                    <Switch name='status' checked={this.state.status} onCheckedChange={(value)=>{this.handleCheckValue(value, 'status')}} id="s8">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 15}} className='semana__col__check'>
                                    <Label htmlFor="s1" css={{ paddingRight: 15 }}>
                                        Admin
                                    </Label>
                                    <Switch name='user_admin' checked={this.state.user_admin} onCheckedChange={(value)=>{this.handleCheckValue(value, 'user_admin')}} id="s1">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 15}} className='semana__col__check'>
                                    <Label htmlFor="s2" css={{ paddingRight: 15 }}>
                                        App
                                    </Label>
                                    <Switch name='user_app' checked={this.state.user_app} onCheckedChange={(value)=>{this.handleCheckValue(value, 'user_app')}} id="s2">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                                <Flex css={{ alignItems: 'left', float: 'left', marginTop: 9, marginLeft: 15}} className='semana__col__check'>
                                    <Label htmlFor="s3" css={{ paddingRight: 15 }}>
                                        Admin Posto
                                    </Label>
                                    <Switch name='admin_posto' checked={this.state.admin_posto} onCheckedChange={(value)=>{this.handleCheckValue(value, 'admin_posto')}} id="s3">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>
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