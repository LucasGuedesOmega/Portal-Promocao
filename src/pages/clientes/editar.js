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
            status: null,
            id_empresa: null,

            tokenDecode: jwtDecode(this.props.token),

            showAlert: false 
        }

        this.submitForm = this.submitForm.bind(this);

    }

    async componentDidMount(){
        if (this.state.id_cliente){
            await this.get_cliente();
        }    
    }

    get_cliente(){
        
        try{
            api.get(`api/v1/cliente?id_cliente=${this.state.id_cliente}&campos=id_cliente, nome, e_mail, cpf, telefone, status, id_empresa`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        dados_cliente:results.data[0],
                        id_cliente: results.data[0].id_cliente,
                        nome: results.data[0].nome,
                        cpf: results.data[0].cpf,
                        e_mail: results.data[0].e_mail,
                        telefone: results.data[0].telefone,
                        status: results.data[0].status,
                        id_empresa: results.data[0].id_empresa
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
                if (error.response.data.error === "Token expirado"){
                    this.props.navigate("/login")
                } else if (error.response.data.error === "não autorizado"){
                    this.props.navigate('/login')
                } else if (error.name === "AxiosError"){
                    this.props.navigate('/login')
                }
            })

        }catch(error){
            console.log(error)
        }
    }

    submitForm(){
  
        var dados_cliete = [
            {
                id_cliente: this.state.id_cliente,
                nome: this.state.nome,
                cpf: this.state.cpf,
                e_mail: this.state.e_mail,
                telefone: this.state.telefone,
                status: this.state.status,
                id_empresa: this.state.tokenDecode.id_empresa
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
                    this.props.navigate("/login")
                } else if (error.response.data.error === "não autorizado"){
                    this.props.navigate('/login')
                } else if (error.name === "AxiosError"){
                    this.props.navigate('/login')
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
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">{this.state.nome}</h3></div>
                            {/* <div className="col-md-2"><button className="btn btn-dark voltar" onClick={()=>{this.props.navigate('/cliente')}}>PÃ¡gina Anterior</button></div> */}
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