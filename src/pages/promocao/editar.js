import React from 'react';
import { useNavigate, useParams } from "react-router-dom";

import api from '../../services/api';
import '../../assets/app.scss';

import { styled } from '@stitches/react';
import { blackA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import jwtDecode from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

import Select from 'react-select'

export function EditarPromocao(){

    const { id_promocao } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (  
        <Editar navigate={navigate} id_promocao={id_promocao} token={token}/>
    );
};

export function CadastrarPromocao(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar navigate={navigate} id_promocao={null} token={token}/>
    );
};

const customStyles = {
    content: {
        top: '45%',
        left: '59%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        height: '60%'
    },
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


const optionsTipo = [
    {value: 1, label: '$'},
    {value: 2, label: '%'},
]

class Editar extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            id_promocao: this.props.id_promocao,
            titulo: null,
            tipo: null,
            desconto_total: null,
            desconto_por_unidade: null,
            id_produto: null,
            id_grupo_empresa: null,
            id_empresa: null,
            data_ini: null,
            data_fim: null,
            quantidade: null,
            imagem: null,
            segunda: false,
            terca: false,
            quarta: false,
            quinta: false,
            sexta: false,
            sabado: false,
            domingo: false,
            id_grupo_pagamento: null,
            status: false,

            tokenDecode: jwtDecode(this.props.token),

            gruposPagamento: [],
            produtos: [],

            descricao_produto: null,
            descricao_grupo_pagamento: null,

            openModal: false,

            empresas: [],
            collapseEmpresa: true,
            defaultTipo: null,

            marcarTodos: false
        }

        this.submitForm = this.submitForm.bind(this);
        this.openModal = this.openModal.bind(this);
        this.submitFormEmpresas = this.submitFormEmpresas.bind(this);
    }

    async componentDidMount(){
        await this.get_empresa();

        if (this.state.id_promocao){
            await this.get_promocao();
            await this.get_promocao_empresas();
        };

        this.preenche_select_produto();
        this.preenche_select_grupo_pagamento();

        for(let i = 0; i<optionsTipo.length; i++){
            if(optionsTipo[i].value === Number(this.state.tipo)){
                this.setState({
                    defaultTipo: optionsTipo[i]
                })
            }
        }

        this.render()
    }

    async get_promocao(){
        try{
            await api.get(`api/v1/promocao?id_promocao=${this.state.id_promocao}`,  { headers: { Authorization: this.props.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    this.setState({
                        titulo:results.data[0].titulo,
                        tipo: results.data[0].tipo,
                        desconto_total: results.data[0].desconto_total,
                        desconto_por_unidade: results.data[0].desconto_por_unidade,
                        id_produto: results.data[0].id_produto,
                        id_grupo_empresa: results.data[0].id_grupo_empresa,
                        quantidade: results.data[0].quantidade,
                        data_ini: results.data[0].data_ini,
                        data_fim: results.data[0].data_fim,
                        imagem: results.data[0].imagem,
                        segunda: results.data[0].segunda,
                        terca: results.data[0].terca,
                        quarta: results.data[0].quarta,
                        quinta: results.data[0].quinta,
                        sexta: results.data[0].sexta,
                        sabado: results.data[0].sabado,
                        domingo: results.data[0].domingo,
                        status: results.data[0].status,
                        id_grupo_pagamento: results.data[0].id_grupo_pagamento,
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
                if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                    window.location.href="/login"
                } else if (error.response.data.error === "Token expirado"){
                    window.location.href="/login"
                } else if (error.response.data.error === "n?o autorizado"){
                    window.location.href='/login'
                }
            });
            
            if (this.state.id_produto){
                api.get(`/api/v1/integracao/produto/lista?id_produto=${this.state.id_produto}`, { headers: { Authorization: this.props.token}})
                .then((results)=>{
                    if (results.data.length>0){
                        this.setState({
                            descricao_produto: results.data[0].descricao
                        })
                    }
                }).catch((error)=>{
                    alert(error.data)
                });
            }

            if (this.state.id_grupo_pagamento){
                api.get(`/api/v1/grupo-pagamento?id_grupo_pagamento=${this.state.id_grupo_pagamento}`, { headers: { Authorization: this.props.token}})
                .then((results)=>{
                    if (results.data.length>0){
                        this.setState({
                            descricao_grupo_pagamento: results.data[0].descricao
                        })
                    }
                })
            }

        }catch(error){
            console.log(error.data)
        }
    }

    preenche_select_produto(){

        let produtoList = [];
        let produtoDict;

        api.get(`/api/v1/integracao/produto/lista?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{  
            if (results.data.length > 0){
                for(let i=0; i<results.data.length; i++){
                    produtoDict = {
                        value: results.data[i].id_produto,
                        text: results.data[i].descricao
                    }
                    produtoList.push(produtoDict)
                }
                this.setState({
                    produtos: produtoList
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
                this.props.navigate('/login');
            } 
            
            if (error.response.data.error === "Token expirado"){
                this.props.navigate('/login');
            }
        }) 
    }

    preenche_select_grupo_pagamento(){

        let gruposPagamentoList = [];
        let grupoPagamentoDict;

        api.get(`/api/v1/grupo-pagamento?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{  
            if (results.data.length > 0){
                for(let i=0; i<results.data.length; i++){
                    grupoPagamentoDict = {
                        value: results.data[i].id_grupo_pagamento,
                        text: results.data[i].descricao
                    }
                    gruposPagamentoList.push(grupoPagamentoDict)
                }
                this.setState({
                    gruposPagamento: gruposPagamentoList
                })
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
        })
    }

    submitForm(){
  
        var dados_promocao = [
            {
                id_promocao: this.state.id_promocao,
                titulo: this.state.titulo,
                tipo: this.state.tipo,
                desconto_total: this.state.desconto_total,
                desconto_por_unidade: this.state.desconto_por_unidade,
                id_produto: this.state.id_produto,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa,
                quantidade: this.state.quantidade,
                data_ini: this.state.data_ini,
                data_fim: this.state.data_fim,
                imagem: this.state.imagem,
                segunda: this.state.segunda,
                terca: this.state.terca,
                quarta: this.state.quarta,
                quinta: this.state.quinta,
                sexta: this.state.sexta,
                sabado: this.state.sabado,
                domingo: this.state.domingo,
                id_grupo_pagamento: this.state.id_grupo_pagamento,
                status: this.state.status,
            }
        ]   
        let message;

        api.post('/api/v1/promocao', dados_promocao, { headers: { Authorization: this.props.token}})
        .then(async (results) => {
            if (results.data['Sucesso']){
                if (this.state.id_promocao){
                    message = 'Promoção editada com sucesso!'
                } else{
                    message = 'Promoção cadastrada com sucesso!'
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

                await this.submitFormEmpresas(results.data.id);

                this.componentDidMount();
            }
        })
        .catch((error)=>{
            console.log(error)
            
        })
    }

    async submitFormEmpresas(id){
        var dados_list = [];
        let dados_dict = {};

        for(let i = 0; i < this.state.empresas.length; i++){
            dados_dict = {
                id_empresa: this.state.empresas[i].id_empresa,
                id_promocao: id,
                id_promocao_empresa: this.state.empresas[i].id_promocao_empresa,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa,
                status: this.state.empresas[i].checked,
            }

            if (!dados_dict.id_promocao_empresa){
                dados_dict.id_promocao_empresa = null
            }

            dados_list.push(dados_dict);
        }   

        if (dados_list.length > 0){
           
            await api.post('api/v1/empresas-promocao', dados_list, { headers: { Authorization: this.props.token}})
            .then((results)=>{
                this.props.navigate(`/editar-promocao/${id}`)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
       
    }

    onEmpresaClicked(valor, index){
        let empresa = this.state.empresas

        if(valor===true){
            empresa[index].checked = false
        }else{
            empresa[index].checked = true
        }

        if (!empresa[index].id_promocao_empresa)
            empresa[index].id_promocao_empresa = null
            
        empresa[index].id_grupo_empresa = this.state.tokenDecode.id_grupo_empresa

        this.setState({
            empresas: empresa
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

    async uploadImage(e){
        const file = e.target.files[0];
        await this.convertBase64(file);
    };

    convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
             
                let image64 = fileReader.result.toString()

                this.setState({
                    imagem: image64
                })

                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    openModal(){
        if (this.state.openModal === false){
            this.setState({
                openModal: true
            })
        } else {
            this.setState({
                openModal: false
            })
        }
    }

    async get_empresa(){
        
        await api.get(`api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                let empresa_list = [];

                for(let i = 0; i<results.data.length; i++){
                    results.data[i].checked = false;
                    empresa_list.push(results.data[i])
                }

                this.setState({
                    empresas: empresa_list
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    async get_promocao_empresas(){
        
        await api.get(`api/v1/empresas-promocao?id_promocao=${this.state.id_promocao}`, { headers: { Authorization: this.props.token}})
        .then(async (results)=>{
            if (results.data.length > 0){
                let empresa_list = this.state.empresas;
                
                for(let x = 0; x<results.data.length;x++){
                    for(let i = 0;  i < empresa_list.length; i++){
                        if (results.data[x].id_empresa === empresa_list[i].id_empresa){
               
                            if(results.data[x].status === true){
                                empresa_list[i].checked = true;
                            }else{
                                empresa_list[i].checked = false;
                            }
                            
                            if (results.data[x].id_promocao_empresa){
                                empresa_list[i].id_promocao_empresa = results.data[x].id_promocao_empresa;
                            }
                        }
           
                    }
                }

                await this.setState({
                    empresas: empresa_list
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    collapseEmpresa(){
        if(this.state.collapseEmpresa){
            this.setState({
                collapseEmpresa: false
            })
        }else{
            this.setState({
                collapseEmpresa: true
            })
        }
    }

    tipoState(event){
        this.setState({
            tipo: event.value,
            defaultTipo: event
        })
    }

    async marcarTodos(){
        let marcar = !this.state.marcarTodos

        this.setState({
            marcarTodos: marcar
        })

        let empresas = this.state.empresas;

        if (marcar === true){
            for(let i = 0; i < empresas.length; i++){
                empresas[i].checked = true
            }

            this.setState({
                empresas: empresas
            })

            return;
        }else if (this.state.id_promocao){
            await this.get_promocao();
            await this.get_promocao_empresas();
        }else{
            for(let i = 0; i < empresas.length; i++){
                empresas[i].checked = false
            }

            this.setState({
                empresas: empresas
            })
        }
    }

    render(){
        let default_produto;
        if (this.state.id_produto && this.state.descricao_produto){
            default_produto = {value: this.state.id_produto, text: this.state.descricao_produto}
        } else {
            default_produto = {value: 0, text: 'Selecione o produto'}
        }

        let default_grupo_pagamento;
        if (this.state.id_grupo_pagamento && this.state.descricao_grupo_pagamento){
            default_grupo_pagamento = {value: this.state.id_grupo_pagamento, text: this.state.descricao_grupo_pagamento}
        } else {
            default_grupo_pagamento = {value: 0, text: 'Selecione o grupo de pagamento'}
        }

        return (
            <div className='cadastro'>
                <div className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Promoção</h3></div>
                        </div>
                    </div>
                    <hr className='separador'/>
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Titulo</label>
                                <input className='form-control' defaultValue={this.state.titulo} name={'titulo'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Produto</label>
                                <select name='id_produto' onChange={(value)=>{this.handleNameValue(value)}} className='form-select'>
                                    <option defaultValue={default_produto.value}>{default_produto.text}</option>
                                    { 
                                        this.state.produtos.map((item, key)=>
                                            (
                                                <option key={key} value={item.value}>{item.text}</option>
                                            )
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Grupo Pagamento</label>
                                <select name='id_grupo_pagamento' onChange={(value)=>{this.handleNameValue(value)}} className='form-select'>
                                <option defaultValue={default_grupo_pagamento.value}>{default_grupo_pagamento.text}</option>
                                    { 
                                        this.state.gruposPagamento.map((item, key)=>(
                                            <option key={key} value={item.value}>{item.text}</option>
                                        ))
                                    }
                                </select>                            
                            </div>
                            
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <div className='row'>
                                    <div className="col-sm-9">
                                        <label className='cadastro__formulario__label'>Desconto por unidade</label>
                                        <input type='number' className='form-control' defaultValue={this.state.desconto_por_unidade} name={'desconto_por_unidade'} onChange={(value)=>{this.handleNameValue(value)}} />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className='label-tipo'>Tipo</label>
                                        <Select name='tipo' id={"id_tipo"} options={optionsTipo} value={this.state.defaultTipo} onChange={(value)=>{this.tipoState(value)}}/>
                                    </div>
                                </div>  
                                
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>A partir de (quantidade)</label>
                                <input type="number" className='form-control' defaultValue={this.state.quantidade} name={'quantidade'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Desconto Total</label>
                                <input type='number' className='form-control' defaultValue={this.state.desconto_total} name={'desconto_total'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Data Inicial</label>
                                <input type="date" className='form-control' defaultValue={this.state.data_ini} name={'data_ini'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Data Final</label>
                                <input type="date" className='form-control' defaultValue={this.state.data_fim} name={'data_fim'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Imagem</label>
                                <input type='file' className='form-control' multiple={false} onChangeCapture={(value)=> {this.uploadImage(value)}}/>
                                
                            </div>
                            {this.state.imagem ?
                                (
                                    <button className='bt_ver_imagem col-sm' onClick={this.openModal}>Ver Imagem</button>
                                )
                                :
                                (
                                    <div></div>
                                )
                            }
                        </div>
                        <label className='cadastro__formulario__label' style={{marginTop: 15}}>Dias com Promoção</label>
                        <div className="row mt-3 semana">
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'center' }} className='semana__col__check'>
                                    <Label htmlFor="s1" css={{ paddingRight: 15 }}>
                                        Segunda
                                    </Label>
                                    <Switch name='segunda' checked={this.state.segunda} onCheckedChange={(value)=>{this.handleCheckValue(value, 'segunda')}} id="s1">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>  
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'center' }} className='semana__col__check'>
                                    <Label htmlFor="s2" css={{ paddingRight: 15 }}>
                                        Terça
                                    </Label>
                                    <Switch name='terca' checked={this.state.terca} onCheckedChange={(value)=>{this.handleCheckValue(value, 'terca')}} id="s2">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>  
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'center' }} className='semana__col__check' >
                                    <Label htmlFor="s3" css={{ paddingRight: 15 }}>
                                        Quarta
                                    </Label>
                                    <Switch name='quarta' checked={this.state.quarta} onCheckedChange={(value)=>{this.handleCheckValue(value, 'quarta')}} id="s3">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>  
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'center' }} className='semana__col__check'>
                                    <Label htmlFor="s4" css={{ paddingRight: 15 }}>
                                        Quinta
                                    </Label>
                                    <Switch name='quinta' checked={this.state.quinta} onCheckedChange={(value)=>{this.handleCheckValue(value, 'quinta')}} id="s4">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>  
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'center' }} className='semana__col__check'>
                                    <Label htmlFor="s5" css={{ paddingRight: 15 }}>
                                        Sexta
                                    </Label>
                                    <Switch name='sexta' checked={this.state.sexta} onCheckedChange={(value)=>{this.handleCheckValue(value, 'sexta')}} id="s5">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>  
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'center' }} className='semana__col__check'>
                                    <Label htmlFor="s6" css={{ paddingRight: 15 }}>
                                        Sabado
                                    </Label>
                                    <Switch name='sabado' checked={this.state.sabado} onCheckedChange={(value)=>{this.handleCheckValue(value, 'sabado')}} id="s6">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>  
                            <div className="col-sm semana__col">
                                <Flex css={{ alignItems: 'center' }} className='semana__col__check'>
                                    <Label htmlFor="s7" css={{ paddingRight: 15 }}>
                                        Domingo
                                    </Label>
                                    <Switch name='domingo' checked={this.state.domingo} onCheckedChange={(value)=>{this.handleCheckValue(value, 'domingo')}} id="s7">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>       
                        </div>
                        <div className='row mt-3'>
                            <div className='col-sm' >
                                <div className="content-table">
                                    <ul className='list_empresas'>
                                        <li className='item_empresa'>
                                            <div className='row'>
                                                <div className='col-sm'>
                                                    Empresas
                                                </div>
                                            </div>
                                        </li>
                                        <li className='header-empresas'>
                                            <div className='row'>
                                                <button className={this.state.marcarTodos?'marcar-todos':'desliga-marcar-todos'} onClick={()=>{this.marcarTodos()}} >
                                                    {this.state.marcarTodos?(<span className="material-symbols-outlined clickIcon">remove_done</span>)
                                                    :
                                                    (<span className="material-symbols-outlined clickIcon">verified</span>)
                                                    }
                                                </button>
                                                <div className='col-sm'>Marcado</div>
                                                <div className='col-sm'>ID</div>
                                                <div className='col-sm'>Razão Social</div>
                                                <div className='col-sm'>CNPJ</div>
                                            </div>
                                        </li>
                                        <div className='scroll-table' >
                                            {
                                                this.state.empresas.map((value, index)=>(
                                                        <li onClick={()=>{this.onEmpresaClicked(value.checked, index)}} className={value.checked?'item_empresa_checked':'item_empresa'}>
                                                            <div className='row'>
                                                                <div className='col-sm col-traco'>-</div>
                                                                <div className='col-sm'>
                                                                    {value.checked?(<span className="material-symbols-outlined">verified</span>)
                                                                    :
                                                                    (<span className="material-symbols-outlined">remove_done</span>)
                                                                    }
                                                                    
                                                                </div>
                                                                <div className='col-sm'>{value.id_empresa}</div>
                                                                <div className='col-sm'>{value.razao_social}</div>
                                                                <div className='col-sm'>{value.cnpj.replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")}</div>
                                                            </div>
                                                        </li>
                                                    )
                                                )
                                            }
                                        </div>
                                       
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-sm ">
                                <Flex css={{ alignItems: 'left', float: 'left', maxWidth: '100px', marginTop: 9, marginLeft: 4}} className='semana__col__check'>
                                    <Label htmlFor="s8" css={{ paddingRight: 15 }}>
                                        Status
                                    </Label>
                                    <Switch name='status' checked={this.state.status} onCheckedChange={(value)=>{this.handleCheckValue(value, 'status')}} id="s8">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                                <button style={{ width: '100px'}} onClick={this.submitForm} className="cadastro__formulario__enviar">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
                <Modal isOpen={this.state.openModal}  ariaHideApp={false} onRequestClose={this.openModal} style={customStyles} className="card" >
                    <div className='card card-header'>
                        <h3>Visualizar Imagem</h3>
                    </div>
                    <div className='card card-body' style={{ height: '600px', overflowY: 'scroll' }}>
                        <div className='row'>
                            <div className='col-lg'></div>
                            <div className='col-lg col-image'>
                                <img alt='*' src={this.state.imagem} className='modal-image'/>
                            </div>
                            <div className='col-lg'></div>
                        </div>
                    </div>
                    <div className='card card-footer'>
                        <div className='row' style={{width: '102%'}}>
                            <div className='col-lg'>
                                <button className='bt_fechar_modal' onClick={this.openModal}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}