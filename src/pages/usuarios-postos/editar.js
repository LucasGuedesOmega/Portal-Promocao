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

    const { id_grupo_usuario, id_usuario } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_grupo_usuario={id_grupo_usuario} id_usuario={id_usuario} token={token} navigate={navigate}/>
    );
};

export function CadastrarUsuario(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();
    const { id_grupo_usuario } = useParams();
    
    return (
        <Editar id_grupo_usuario={id_grupo_usuario} id_usuario={null} token={token} navigate={navigate}/>
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
            id_usuario: this.props.id_usuario,
            username: null,
            senha: null,
            status: false,
            user_admin: false,
            user_app: false,
            user_app_portal: false,

            tokenDecode: jwtDecode(this.props.token)
        }

        this.submitForm = this.submitForm.bind(this);

    }

    componentDidMount(){
        if (this.state.id_grupo_usuario && this.state.id_usuario){
            this.get_grupo_usuario()
        }

        this.preenche_select_permissao()
    }

    handleCheckValue(value, name){
        this.setState({
            [name]: value
        });
    }

    async get_usuario(){

    }


    submitForm(){
        //
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
        return (
            <div className='cadastro'>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Usuários</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Username</label>
                                <InputMask className='form-control' value={this.state.username} name={'username'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Senha</label>
                                <InputMask className='form-control' value={this.state.username} name={'senha'} onChange={(value)=>{this.handleNameValue(value)}} />
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