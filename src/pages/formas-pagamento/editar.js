import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { styled } from '@stitches/react';
import { blackA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export function EditarFormaPagamento(){

    const { id_forma_pagamento, id_grupo_pagamento } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Editar id_grupo_pagamento={id_grupo_pagamento} id_forma_pagamento={id_forma_pagamento} token={token} navigate={navigate}/>);
};

export function CadastrarFormaPagamento(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();
    const { id_grupo_pagamento } = useParams();
    return (<Editar id_grupo_pagamento={id_grupo_pagamento} id_forma_pagamento={null} token={token} navigate={navigate}/>);
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
            id_forma_pagamento: this.props.id_forma_pagamento,
            id_grupo_pagamento: this.props.id_grupo_pagamento,
            id_grupo_empresa: null,
            status: null,
            tipo: null,
            id_externo: null,
            descricao: null,
            id_empresa: null,
            tokenDeconde: jwtDecode(this.props.token),

            formasPagamento: []
        }

        this.submitForm = this.submitForm.bind(this);
    }

    async componentDidMount(){
        if (this.state.id_forma_pagamento){ 
            await this.get_forma_pagamento()
        }

        await this.grupo_empresa()
        console.log(this.state.id_forma_pagamento)
    }

    grupo_empresa(){
        api.get(`/api/v1/empresa?id_grupo_empresa=${this.state.tokenDeconde.id_grupo_empresa}`, { headers: { Authorization: this.props.token}})
        .then(async (results)=>{
            if(results.data.length > 0){
                await this.setState({
                    id_grupo_empresa: results.data[0].id_grupo_empresa
                });
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    get_forma_pagamento(){
        try{
            api.get(`api/v1/forma-pagamento?id_forma_pagamento=${this.state.id_forma_pagamento}`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        id_forma_pagamento: results.data[0].id_forma_pagamento,
                        id_grupo_empresa: results.data[0].id_grupo_empresa,
                        status: results.data[0].status,
                        tipo: results.data[0].tipo,
                        id_externo: results.data[0].id_externo,
                        descricao: results.data[0].descricao,
                        id_empresa: results.data[0].id_empresa,  
                        id_grupo_pagamento: results.data[0].id_grupo_pagamento     
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

        }catch(error){
            console.log(error)
        }
    }

    submitForm(){

        var dados_forma_pagamento = [
            {
                id_forma_pagamento: this.state.id_forma_pagamento,
                status: this.state.status,
                tipo: this.state.tipo,
                id_externo: this.state.id_externo,
                descricao: this.state.descricao,
                id_empresa: this.state.tokenDeconde.id_empresa,     
                id_grupo_empresa: this.state.tokenDeconde.id_grupo_empresa,     
                id_grupo_pagamento: this.state.id_grupo_pagamento,     
            }
        ]   

        let message;

        api.post('/api/v1/forma-pagamento', dados_forma_pagamento, { headers: { Authorization: this.props.token}})
        .then(async (results) => {
            if (results.data['Sucesso']){
                if (this.state.id_forma_pagamento){
                    message = 'Forma de pagamento editada com sucesso!'
                } else{
                    message = 'Forma de pagamento cadastrada com sucesso!'
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
            console.log(error.response.data)

            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
                } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
                } else if (error.name === "AxiosError"){
                window.location.href='/login'
                }

        });
        
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
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Formas de Pagamento</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Descrição</label>
                                <input className='form-control' defaultValue={this.state.descricao} name={'descricao'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Tipo</label>
                                <input className='form-control' defaultValue={this.state.tipo} name={'tipo'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>ID Externo</label>
                                <input type={'numer'} className='form-control' defaultValue={this.state.id_externo} name={'id_externo'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 4}} className='semana__col__check'>
                                    <Label htmlFor="s8" css={{ paddingRight: 15 }}>
                                        Status
                                    </Label>
                                    <Switch name='status' checked={this.state.status} onCheckedChange={(value)=>{this.handleCheckValue(value, 'status')}} id="s8">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>
                            <div className="col-sm  "></div>
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