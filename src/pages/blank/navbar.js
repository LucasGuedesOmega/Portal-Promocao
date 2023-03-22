import jwtDecode from 'jwt-decode';
import React from 'react'
import { useNavigate} from 'react-router-dom';
import api from '../../services/api';
import { styled, keyframes } from '@stitches/react';
import { violet } from '@radix-ui/colors';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import toast, { Toaster } from 'react-hot-toast';

const slideUpAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(2px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateX(-2px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(-2px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateX(2px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
});

const contentStyles = {
    minWidth: 115,
    marginRight: '7px',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    boxShadow:
    '0px 10px 38px -10px, 0px 10px 20px -15px',
        '@media (prefers-reduced-motion: no-preference)': {
            animationDuration: '400ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, opacity',
            '&[data-state="open"]': {
            '&[data-side="top"]': { animationName: slideDownAndFade },
            '&[data-side="right"]': { animationName: slideLeftAndFade },
            '&[data-side="bottom"]': { animationName: slideUpAndFade },
            '&[data-side="left"]': { animationName: slideRightAndFade },
        },
    },
};

const StyledContent = styled(DropdownMenuPrimitive.Content, { ...contentStyles });

const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
fill: 'white',
});

function Content({ children, ...props }) {
return (
    <DropdownMenuPrimitive.Portal>
    <StyledContent {...props}>
        {children}
        <StyledArrow />
    </StyledContent>
    </DropdownMenuPrimitive.Portal>
);
}

const StyledSubContent = styled(DropdownMenuPrimitive.SubContent, { ...contentStyles });

function SubContent(props) {
return (
    <DropdownMenuPrimitive.Portal>
        <StyledSubContent {...props} />
    </DropdownMenuPrimitive.Portal>
);
}

const itemStyles = {
    all: 'unset',
    fontSize: 13,
    lineHeight: 1,
    color: 'black',
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    height: 25,
    padding: '0 5px',
    position: 'relative',
    paddingLeft: 25,
    userSelect: 'none',

    '&[data-disabled]': {
        color: 'black',
        pointerEvents: 'none',
    },

    '&[data-highlighted]': {
        backgroundColor: 'rgb(235, 235, 235)',
        color: 'black',
    },
};

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles });
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, { ...itemStyles });
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, { ...itemStyles });
const StyledSubTrigger = styled(DropdownMenuPrimitive.SubTrigger, {
'&[data-state="open"]': {
    backgroundColor: violet.violet4,
    color: violet.violet11,
},
...itemStyles,
});

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
    paddingLeft: 25,
    fontSize: 12,
    lineHeight: '25px',
    color: 'black',
});

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
    height: 1,
    backgroundColor: 'black',
    margin: 5,
});

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
    position: 'absolute',
    left: 0,
    width: 25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
});

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = Content;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuCheckboxItem = StyledCheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;
export const DropdownMenuLabel = StyledLabel;
export const DropdownMenuSeparator = StyledSeparator;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger = StyledSubTrigger;
export const DropdownMenuSubContent = SubContent;
  

export function NavBar(){

    let token = localStorage.getItem('tokenApi');

    const navigate = useNavigate();

    return <NavbarClass token={token} navigate={navigate}/>;
  }

export class NavbarClass extends React.Component{
    constructor(props){
        super(props);
        this.state = {            
            descricao_empresa: null,

            tokenDecode: jwtDecode(this.props.token),
            loading: false,

            nome: null,
            username: null
        }
    }

    async componentDidMount(){
        this.setState({
            loading: true
        })
        await this.get_usuaario();
        await this.get_descricao_empresa();
        this.setState({
            loading: false
        })
    }

    async get_usuaario(){
        await api.get(`api/v1/funcionario?id_usuario=${this.state.tokenDecode.id_usuario}`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    nome: results.data[0].nome
                })
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login";
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login';
            }else if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                window.location.href='/login';
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

        await api.get(`api/v1/usuario?id_usuario=${this.state.tokenDecode.id_usuario}`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    username: results.data[0].username
                })
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login";
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login';
            }else if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                window.location.href='/login';
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

    }

    async get_descricao_empresa(){
        await api.get(`api/v1/grupo-empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            if (results.data){
                this.setState({
                    descricao_empresa: results.data[0].descricao
                })
            }
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login";
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login';
            }else if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                window.location.href='/login';
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
    }
    
    logout(){
        localStorage.removeItem("tokenApi")
        window.location.href="/login";
    }

    render(){
        let descricao_permissao_usuario;
        if(this.state.tokenDecode.admin){
            descricao_permissao_usuario = 'Administrador'
        }else if (this.state.tokenDecode.admin_posto){
            descricao_permissao_usuario = 'Admin Posto'
        }else{
            descricao_permissao_usuario = 'Funcionario'
        }

        return (
            <div className="navbar">
                <div className="row-navbar">
                    <div className="coluna-navbar">
                        <div className='titulo-navbar'> 
                            <h5>{this.state.descricao_empresa}</h5>
                        </div> 
                    </div>
                    <div className="coluna-navbar">
                        <div className='menu-navbar'>
                            <div className="dropdown">
                                <button className="dropbtn">
                                    <span className="material-symbols-outlined">
                                    menu
                                    </span>
                                </button>
                                <div className="dropdown-content">
                                    <div className='div-info-user'>
                                        <p>
                                            {
                                            this.state.nome ? (this.state.nome) : (this.state.username)
                                            }
                                        </p>
                                        <label>
                                            {descricao_permissao_usuario}
                                            </label>
                                    </div>
                                    <button className='btn-dropdown-content'>
                                        <p>Usuário</p>
                                    </button>
                                    <button className='btn-dropdown-content' onClick={()=>{this.logout()}}>
                                        <p>Sair </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <Toaster/>
            </div>
          
        );
    }
}