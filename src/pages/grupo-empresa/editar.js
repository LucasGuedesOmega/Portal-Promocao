import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';

export function EditarGrupoEmpresa(){

    const { id_grupo_empresa } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_grupo_empresa={id_grupo_empresa} token={token} navigate={navigate}/>
    );
};

export function CadastrarGrupoEmpresa(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_grupo_empresa={null} token={token} navigate={navigate}/>
    );
};


class Editar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
            dados_grupo_empresa: {
                id_grupo_empresa: null,
                descricao: null,
                status: null,
            },

            id_grupo_empresa: this.props.id_grupo_empresa,
            descricao: null,
            status: null
        }

        this.submitForm = this.submitForm.bind(this);

    }

    componentDidMount(){
        if (this.state.id_grupo_empresa){
            this.get_grupo_empresa()
        }
    }

    get_grupo_empresa(){
        try{
            api.get(`api/v1/grupo-empresa?id_grupo_empresa=${this.state.id_grupo_empresa}`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        id_grupo_empresa:results.data[0].id_grupo_empresa,
                        descricao: results.data[0].descricao,
                        status: results.data[0].status,
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
                }
            })

        }catch(error){
            console.log(error)
        }
    }

    submitForm(){
  
        var dados_grupo_empresa = [
            {
                id_grupo_empresa: this.state.id_grupo_empresa,
                descricao: this.state.descricao,
                status: this.state.status,
            }
        ]   

        let message;

        try{
            api.post('/api/v1/grupo-empresa', dados_grupo_empresa, { headers: { Authorization: this.props.token}})
            .then((results) => {
                if (results.data['Sucesso']){
                    this.componentDidMount()
                    if (this.state.id_grupo_empresa){
                        message = 'Grupo de empresa editado com sucesso!'
                    }else{
                        message = 'Grupo de empresa cadastrado com sucesso!'
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

    render(){

        return (
            <div className='cadastro'>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Rede</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Descrição</label>
                                <InputMask className='form-control' value={this.state.descricao} name={'descricao'} onChange={(value)=>{this.handleNameValue(value)}} />
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
                <Toaster />
            </div>
        );
    }

}