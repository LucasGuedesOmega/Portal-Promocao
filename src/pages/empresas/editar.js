import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';

export function EditarEmpresa(){

    const { id_empresa, id_grupo_empresa } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Editar id_grupo_empresa={id_grupo_empresa} id_empresa={id_empresa} token={token} navigate={navigate}/>);
};

export function CadastrarEmpresa(){
    const { id_grupo_empresa } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Editar id_grupo_empresa={id_grupo_empresa} id_empresa={null} token={token} navigate={navigate}/>);
}

class Editar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id_empresa: this.props.id_empresa,
            bairro: null,
            cep: null,
            cnpj: null,
            endereco: null,
            id_grupo_empresa: this.props.id_grupo_empresa,
            numero: null,
            razao_social: null,
            status: null,
            token_integracao: null,
            uf: null,

            usuario: null,
            senha: null
        }

        this.submitForm = this.submitForm.bind(this);
        this.geraToken = this.geraToken.bind(this);
    }

    componentDidMount(){
        if (this.state.id_empresa){ 
            this.get_empresa()
        }
    }

    get_empresa(){
        try{
            api.get(`api/v1/empresa?id_empresa=${this.state.id_empresa}`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        id_empresa: this.props.id_empresa,
                        bairro: results.data[0].bairro,
                        cep: results.data[0].cep,
                        cnpj: results.data[0].cnpj,
                        endereco: results.data[0].endereco,
                        numero: results.data[0].numero,
                        razao_social: results.data[0].razao_social,
                        status: results.data[0].status,
                        token_integracao: results.data[0].token_integracao,
                        uf: results.data[0].uf,           
                    })
                }
            })
            .catch((error)=>{
                if (error.response.data.error === "Token expirado"){
                    window.location.href="/login"
                } else if (error.response.data.error === "não autorizado"){
                    window.location.href='/login'
                }
            })

        }catch(error){
            console.log(error)
        }
    }

    submitForm(){
        if (!this.state.token_integracao){
            toast("Gere o token de integração.", {
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

        var dados_empresa = [
            {
                id_empresa: this.state.id_empresa,
                bairro: this.state.bairro,
                cep: this.state.cep,
                cnpj: this.state.cnpj,
                endereco: this.state.endereco,
                id_grupo_empresa: this.state.id_grupo_empresa,
                numero: this.state.numero,
                razao_social: this.state.razao_social,
                status: this.state.status,
                token_integracao: this.state.token_integracao,
                uf: this.state.uf
            }
        ]   

        let message;

        try{
            api.post('/api/v1/empresa', dados_empresa, { headers: { Authorization: this.props.token}})
            .then((results) => {

                if (results.data['Sucesso']){
                    if (this.state.id_empresa){
                        message = 'Empresa editada com sucesso!'
                    } else{
                        message = 'Empresa cadastrada com sucesso!'
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
                    window.location.href="/login"
                } else if (error.response.data.error === "não autorizado"){
                    window.location.href='/login'
                }


            });
        }catch(err){
            console.log(err)
        }
    }

    geraToken(){

        var dados_gera_token =
        [
            {
                username: this.state.usuario,
                senha: this.state.senha,
                tipo: 'consumidor'
            }
        ]
        api.post('api/v1/login', dados_gera_token)
        .then((results)=>{
            if (results.data){

                this.setState({
                    token_integracao: results.data.token
                });

                alert("Favor confirmar a empresa logo após testar o token no Autosystem.")
            }

        }).catch((error)=>{
    
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
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Postos</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Razão Social</label>
                                <InputMask className='form-control' defaultValue={this.state.razao_social} name={'razao_social'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>CNPJ</label>
                                <InputMask mask="99.999.999/9999-99" className='form-control' value={this.state.cnpj} name={'cnpj'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>ID Grupo Empresa</label>
                                <InputMask className='form-control' disabled readOnly value={this.state.id_grupo_empresa} name={'id_grupo_empresa'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Endereço</label>
                                <InputMask className='form-control' defaultValue={this.state.endereco} name={'endereco'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Bairro</label>
                                <InputMask className='form-control' value={this.state.bairro} name={'bairro'} onChange={(value)=>{this.handleNameValue(value)}}/>
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Numero</label>
                                <InputMask type={'number'}  className='form-control' defaultValue={this.state.numero} name={'numero'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>CEP</label>
                                <input className='form-control' defaultValue={this.state.cep} name={'cep'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>UF</label>
                                <InputMask className='form-control' maxLength={2} value={this.state.uf} name={'uf'} onChange={(value)=>{this.handleNameValue(value)}}/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Token Itengração</label>
                                <InputMask readOnly={true} disabled className='form-control' defaultValue={this.state.token_integracao} name={'token_integracao'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <input type="checkbox" className='form-check-input cadastro__formulario__checkbox' name='status' checked={this.state.status} onChange={(value)=>{this.handleNameValue(value)}}/>
                                <label className='cadastro__formulario__label__checkbox'>Status</label>
                            </div>
                            <div className="col-sm  "></div>
                            <div className="col-sm ">
                                <button onClick={this.submitForm} className="cadastro__formulario__enviar">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div  className="cadastro__formulario mt-5" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Token Integração</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Usuário</label>
                                <InputMask className='form-control' defaultValue={this.state.usuario} name={'usuario'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Senha</label>
                                <InputMask type='password' className='form-control' defaultValue={this.state.senha} name={'senha'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Token</label>
                                <InputMask readOnly={true} disabled className='form-control' defaultValue={this.state.token_integracao} name={'token_integracao'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-sm"></div>
                            <div className="col-sm"></div>
                            <div className="col-sm">
                                <button onClick={this.geraToken} className="cadastro__formulario__enviar">Gerar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        );
    }

}