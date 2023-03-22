import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export function EditarGrupoFormaPagamento(){

    const { id_grupo_forma_pagamento } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Editar id_grupo_forma_pagamento={id_grupo_forma_pagamento} token={token} navigate={navigate}/>);
};

export function CadastrarGrupoFormaPagamento(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Editar id_grupo_forma_pagamento={null} token={token} navigate={navigate}/>);
}

class Editar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id_grupo_forma_pagamento: this.props.id_grupo_forma_pagamento,
            id_grupo_pagamento: null,
            id_forma_pagamento: null,
            id_empresa: null,

            tokenDeconde: jwtDecode(this.props.token),

            gruposPagamento: [],
            formasPagamento: [],

            descricao_grupo_pagamento: null,
            descricao_forma_pagamento: null,
        }

        this.submitForm = this.submitForm.bind(this);
    }

    async componentDidMount(){
        if (this.state.id_grupo_forma_pagamento){ 
            await this.get_grupo_forma_pagamento()
        }

        this.preenche_select_grupo_pagamento();
        await this.preenche_select_forma_pagamento();
        this.get_forma_pagamento();


        this.render();
    }

    async get_grupo_forma_pagamento(){
        try{
            await api.get(`api/v1/grupo-forma-pagamento?id_grupo_forma_pagamento=${this.state.id_grupo_forma_pagamento}`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        id_grupo_forma_pagamento: results.data[0].id_grupo_forma_pagamento,
                        id_grupo_pagamento: results.data[0].id_grupo_pagamento,
                        id_forma_pagamento: results.data[0].id_forma_pagamento,
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
                if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                    window.location.href="/login"
                } else if (error.response.data.error === "Token expirado"){
                    window.location.href="/login"
                } else if (error.response.data.error === "n�o autorizado"){
                    window.location.href='/login'
                }
            })

            if (this.state.id_grupo_pagamento){
                await api.get(`/api/v1/grupo-pagamento?id_grupo_pagamento=${this.state.id_grupo_pagamento}`, { headers: { Authorization: this.props.token}})
                .then((results)=>{
                    if (results.data.length>0){
                        this.setState({
                            descricao_grupo_pagamento: results.data[0].descricao
                        })
                    }
                })
            }

            if (this.state.id_forma_pagamento){
                await api.get(`/api/v1/forma-pagamento?id_forma_pagamento=${this.state.id_forma_pagamento}`, { headers: { Authorization: this.props.token}})
                .then((results)=>{
                    if (results.data.length>0){
                        this.setState({
                            descricao_forma_pagamento: results.data[0].descricao
                        })
                    }
                })
            }

        }catch(error){
            console.log(error)
        }
    }

    submitForm(){

        var data_grupo_forma_pagamento = [
            {
                id_grupo_forma_pagamento: this.state.id_grupo_forma_pagamento,
                id_grupo_pagamento: this.state.id_grupo_pagamento,
                id_forma_pagamento: this.state.id_forma_pagamento,
                id_empresa: this.state.tokenDeconde.id_empresa,     
                id_grupo_empresa: this.state.tokenDeconde.id_grupo_empresa,     
            }
        ]   

        let message;

        try{
            api.post('/api/v1/grupo-forma-pagamento', data_grupo_forma_pagamento, { headers: { Authorization: this.props.token}})
            .then((results) => {
                console.log(results)
                if (results.data['Sucesso']){
                    if (this.state.id_grupo_forma_pagamento){
                        message = 'Grupo de forma de Pagamento editado com sucesso!'
                    } else{
                        message = 'Grupo de forma de pagamento cadastrado com sucesso!'
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

                console.log(error)
                if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                    window.location.href="/login"
                } else if (error.response.data.error === "Token expirado"){
                    window.location.href="/login"
                } else if (error.response.data.error === "não autorizado"){
                    window.location.href='/login'
                }

            });
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

    preenche_select_grupo_pagamento(){

        let gruposPagamentoList = [];
        let grupoPagamentoDict;

        api.get(`/api/v1/grupo-pagamento?id_empresa=${this.state.tokenDeconde.id_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{  
            if (results.data.length > 0){
                for(let i=0; i<results.data.length; i++){
                    grupoPagamentoDict = {
                        value: results.data[i].id_grupo_pagamento,
                        text: results.data[i].descricao
                    }
                    gruposPagamentoList.push(grupoPagamentoDict)
                }
            }
            this.setState({
                gruposPagamento: gruposPagamentoList
            });
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
                this.props.navigate('/login');
            } 
            
            if (error.response.data.error === "Token expirado"){
                this.props.navigate('/login');
            }
        })
    }

    handleCheckValue(value, name){
        this.setState({
            [name]: value
        });
    }

    preenche_select_forma_pagamento(){

        let formasPagamentoList = [];

        api.get(`/api/v1/forma-pagamento?id_empresa=${this.state.tokenDeconde.id_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{  
            if (results.data.length > 0){
                for(let i=0; i<results.data.length; i++){
                    formasPagamentoList.push(results.data[i])
                }
            }
            this.setState({
                formasPagamento: formasPagamentoList
            });
        })
        .catch((error)=>{
            console.log(error.response.data)

            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "n�o autorizado"){
                window.location.href='/login'
            } else if (error.name === "AxiosError"){
                window.location.href='/login'
            }
        })
    }

    async get_forma_pagamento(){
        
        await api.get(`api/v1/grupo-forma-pagamento?id_grupo_forma_pagamento=${this.state.id_grupo_forma_pagamento}`, { headers: { Authorization: this.props.token}})
        .then(async (results)=>{
            if (results.data.length > 0){
                let formaPagamentoList = this.state.formasPagamento;
                console.log(results.data, formaPagamentoList)
                for(let x = 0; x<results.data.length;x++){
                    for(let i = 0;  i < formaPagamentoList.length; i++){
                        if (results.data[x].id_forma_pagamento === formaPagamentoList[i].id_forma_pagamento){
               
                            if(results.data[x].status === true){
                                formaPagamentoList[i].checked = true;
                            }else{
                                formaPagamentoList[i].checked = false;
                            }
                            
                            if (results.data[x].id_grupo_forma_pagamento){
                                formaPagamentoList[i].id_grupo_forma_pagamento = results.data[x].id_grupo_forma_pagamento;
                            }
                        }
           
                    }
                }

                this.setState({
                    formasPagamento: formaPagamentoList
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    onFormaPagamentoClicked(valor, index){
        let formasPagamento = this.state.formasPagamento

        if(valor===true){
            formasPagamento[index].checked = false
        }else{
            formasPagamento[index].checked = true
        }

        if (!formasPagamento[index].id_promocao_empresa)
            formasPagamento[index].id_promocao_empresa = null
            
        formasPagamento[index].id_grupo_empresa = this.state.tokenDeconde.id_grupo_empresa

        this.setState({
            formasPagamento: formasPagamento
        })
    }

    render(){
        let default_grupo_pagamento;
        if (this.state.id_grupo_pagamento && this.state.descricao_grupo_pagamento){
            default_grupo_pagamento = {value: this.state.id_grupo_pagamento, text: this.state.descricao_grupo_pagamento}
        } else {
            default_grupo_pagamento = {value: 0, text: 'Selecione o grupo de pagamento'}
        }

        return (
            <div className='cadastro'>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Grupos de Forma de Pagamento</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Grupos de Pagamentos</label>
                                <select name='id_grupo_pagamento' onChange={(value)=>{this.handleNameValue(value)}} className='form-select'>
                                    <option defaultValue={default_grupo_pagamento.value}>{default_grupo_pagamento.text}</option>
                                    { 
                                        this.state.gruposPagamento.map((item, key)=>
                                            (
                                                <option key={key} value={item.value}>{item.text}</option>
                                            )
                                        )
                                    }
                                </select>       
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-sm'>
                                <ul className='list_empresas'>
                                    <li className='item_empresa'>
                                        <div className='row'>
                                            <div className='col-sm'>
                                                Formas de pagamento
                                            </div>
                                        </div>
                                    </li>
                                    <li className='header-empresas'>
                                        <div className='row'>
                                            <div className='col-sm'>Marcado</div>
                                            <div className='col-sm'>ID</div>
                                            <div className='col-sm'>Descricao</div>
                                            <div className='col-sm'>Tipo</div>
                                        </div>
                                    </li>
                                    <div className='scroll-table' >
                                        {
                                            this.state.formasPagamento.map((value, index)=>(
                                                    <li key={index} onClick={()=>{this.onFormaPagamentoClicked(value.checked, index)}} className={value.checked?'item_empresa_checked':'item_empresa'}>
                                                        <div className='row'>
                                                            <div className='col-sm'>
                                                                {value.checked?(<span className="material-symbols-outlined">verified</span>)
                                                                :
                                                                (<span className="material-symbols-outlined">remove_done</span>)
                                                                }
                                                                
                                                            </div>
                                                            <div className='col-sm'>{value.id_forma_pagamento}</div>
                                                            <div className='col-sm'>{value.descricao}</div>
                                                            <div className='col-sm'>{value.tipo}</div>
                                                        </div>
                                                    </li>
                                                )
                                            )
                                        }
                                    </div>
                                </ul>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm"></div>
                            <div className="col-sm"></div>
                            <div className="col-sm">
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