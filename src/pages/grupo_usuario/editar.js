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

export function EditarGrupoUsuario(){

    const { id_grupo_usuario } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_grupo_usuario={id_grupo_usuario} token={token} navigate={navigate}/>
    );
};

export function CadastrarGrupoUsuario(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_grupo_usuario={null} token={token} navigate={navigate}/>
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

            id_grupo_usuario: this.props.id_grupo_usuario,
            nome: null,
            status: false,
            id_permissao: null,
            permissoes: [],
            descricao_permissao: null,

            tokenDecode: jwtDecode(this.props.token)
        }

        this.submitForm = this.submitForm.bind(this);

    }

    componentDidMount(){
        if (this.state.id_grupo_usuario){
            this.get_grupo_usuario()
        }

        this.preenche_select_permissao()
    }

    handleCheckValue(value, name){
        this.setState({
            [name]: value
        });
    }

    async get_grupo_usuario(){
        await api.get(`api/v1/grupo-usuario?id_grupo_usuario=${this.state.id_grupo_usuario}`,  { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    id_grupo_usuario:results.data[0].id_grupo_usuario,
                    nome: results.data[0].nome,
                    status: results.data[0].status,
                    id_permissao: results.data[0].id_permissao
                })
            }
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                window.location.href="/login"
            } else if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.error === 'Você não tem permissão'){
                toast(error.response.data.error, {
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
        })

        if (this.state.id_permissao){
            api.get(`/api/v1/permissao?id_permissao=${this.state.id_permissao}`, { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length>0){
                    this.setState({
                        descricao_permissao: results.data[0].nome
                    })
                }
            }).catch((error)=>{
                alert(error.data)
            });
        }
    }

    preenche_select_permissao(){

        let permissaoList = [];
        let permissaoDict;

        api.get(`/api/v1/permissao`, { headers: { Authorization: this.props.token}})
        .then((results)=>{  
            if (results.data.length > 0){
                for(let i=0; i<results.data.length; i++){
                    if(results.data[i].status){
                        permissaoDict = {
                            value: results.data[i].id_permissao,
                            text: results.data[i].nome
                        }
                        permissaoList.push(permissaoDict)
                    }
                }
                this.setState({
                    permissoes: permissaoList
                })
            }
        })
        .catch((error)=>{
            console.log(error.response.data)

            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.error === 'Você não tem permissão'){
                toast(error.response.data.error, {
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
        })
    }

    submitForm(){
  
        var dados_grupo_usuario = [
            {
                id_grupo_usuario: this.state.id_grupo_usuario,
                nome: this.state.nome,
                status: this.state.status,
                id_permissao: this.state.id_permissao,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa
            }
        ]   

        let message;

        try{
            api.post('/api/v1/grupo-usuario', dados_grupo_usuario, { headers: { Authorization: this.props.token}})
            .then((results) => {
                if (results.data[0].Sucesso){

                    if (this.state.id_grupo_usuario){
                        message = 'Grupo de usuario editado com sucesso!'
                    }else{
                        message = 'Grupo de usuario cadastrado com sucesso!'
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
                if(error.name === 'AxiosError'){
                    toast(error.response.data.message, {
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

    render(){
        let default_permissao;
        if (this.state.id_permissao && this.state.descricao_permissao){
            default_permissao = {value: this.state.id_permissao, text: this.state.descricao_permissao}
        } else {
            default_permissao = {value: 0, text: 'Selecione a permissão'}
        }
        return (
            <div className='cadastro'>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Grupo de Usuários</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Nome</label>
                                <InputMask className='form-control' value={this.state.nome} name={'nome'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Permissão</label>
                                <select name='id_permissao' onChange={(value)=>{this.handleNameValue(value)}} className='form-select'>
                                        <option defaultValue={default_permissao.value}>{default_permissao.text}</option>
                                        { 
                                            this.state.permissoes.map((item, key)=>
                                                (
                                                    <option key={key} value={item.value}>{item.text}</option>
                                                )
                                            )
                                        }
                                </select>
                            </div>
                        </div>
        
                        <div className="row mt-3">
                            <div className="col-sm">
                                <Flex>
                                    <Label htmlFor="s7" css={{ paddingRight: 5 }}>
                                        Status
                                    </Label>
                                    <Switch name='status' checked={this.state.status} onCheckedChange={(value)=>{this.handleCheckValue(value, 'status')}} id="s7">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>
                            <div className="col-sm"></div>
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