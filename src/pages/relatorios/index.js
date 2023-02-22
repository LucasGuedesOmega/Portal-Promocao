import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useNavigate, useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Report from 'bv-react-data-report';

export function RelatoriosRelacao(){
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();
    const { tipo, filtro } = useParams();
    
    return (<Tela token={token} tipo={tipo} filtro={filtro} navigate={navigate}/>);
}

class Tela extends React.Component{
    _Mounted = true;
    constructor(props){
        super(props);
        this.state = {
            tokenDecode: jwtDecode(this.props.token),
            listaItens: [],
            loading: false,
            
            filtros_html : {},

            listPreenchePromocao: [],
            listPreencheProduto: [],
            listPreencheCliente: [],
            listPreencheEmpesas: [],

            filtro_periodo_ini: null,
            filtro_periodo_fim: null,
            filtro_empresa: 0,
            filtro_cliente: 0,
            filtro_produto: 0,
            filtro_promocao: 0,
            filtro_contigencia: null,

            filtros: ''
        }
    }

    async componentDidMount(){
        this._Mounted = true;
        this.setState({
            loading : true,
        })

        await this.preencheLista()
        await this.preenchePromocao()
        await this.preencheProdutos()
        await this.preencheCliente()
        await this.preencheEmpresas()

        this.setState({
            loading : false,
            filtros_html: {
                empresa: <div className='col-filtros-relatorios'>
                            <label>Empresas</label>
                            <select className='form-control' name={'filtro_empresa'} onChange={(event)=>{this.handleNameValue(event)}}>
                                <option defaultValue={0} value={0}> Selecione uma empresa </option>
                                {
                                    this.state.listPreencheEmpesas.map((value, index)=>(
                                        <option key={index} value={value.value}>{value.text}{value.cnpj}</option>
                                    ))
                                }
                            </select>
                        </div>,
                clientes: <div className='col-filtros-relatorios'>
                            <label>Clientes</label>
                            <select className='form-control' name={'filtro_cliente'} onChange={(event)=>{this.handleNameValue(event)}}>
                                <option defaultValue={0} value={0}> Selecione um cliente</option>
                                {
                                    this.state.listPreencheCliente.map((value, index)=>(
                                        <option key={index} value={value.value}>{value.text}</option>
                                    ))
                                }
                            </select>
                        </div>,
                periodo: <div className='col-filtros-relatorios'>
                            <label>Periodo</label>
                            <div className='row-periodo' >
                                <input type="date" className='form-control m-1' name={'filtro_periodo_ini'} onChange={(value)=>{this.handleNameValue(value)}} />
                                <input type="date" className='form-control m-1' name={'filtro_periodo_fim'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>,
                produto: <div className='col-filtros-relatorios'>
                            <label>Produto</label>
                            <select className='form-control' name={'filtro_produto'} onChange={(event)=>{this.handleNameValue(event)}}>
                                <option defaultValue={0} value={0}> Selecione um produto</option>
                                {
                                    this.state.listPreencheProduto.map((value, index)=>(
                                        <option key={index} value={value.value}>{value.text}</option>
                                    ))
                                }
                            </select>
                        </div>,
                promocao: <div className='col-filtros-relatorios'>
                            <label>Promocao</label>
                            <select className='form-control' name={'filtro_promocao'} onChange={(event)=>{this.handleNameValue(event)}}>
                                <option defaultValue={0} value={0}> Selecione uma promoção</option>
                                {
                                    this.state.listPreenchePromocao.map((value, index)=>(
                                        <option key={index} value={value.value}>{value.text}</option>
                                    ))
                                }
                            </select>
                        </div>,

                contingencia: <div className='col-filtros-relatorios'>
                                <label>Contingencia</label>
                                <select className='form-control' name={'filtro_contigencia'} onChange={(event)=>{this.handleNameValue(event)}}>
                                    <option defaultValue={null} value={null}>Filtro vazio</option>
                                    <option value={'sim'}>Sim</option>
                                    <option value={'nao'}>Não</option>
                                </select>
                            </div>
            },
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

    async preenchePromocao(){
        let listPreenche = [];
        let dictPreenche;

        await api.get(`api/v1/promocao`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            for(let i = 0; i < results.data.length; i++){
                dictPreenche = {
                    value: results.data[i].id_promocao,
                    text: results.data[i].titulo
                }

                listPreenche.push(dictPreenche)
            }
        })

        this.setState({
            listPreenchePromocao: listPreenche
        })
    }

    async preencheProdutos(){
        let listPreenche = [];
        let dictPreenche;

        await api.get(`/api/v1/integracao/produto/lista`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            for(let i = 0; i < results.data.length; i++){
                dictPreenche = {
                    value: results.data[i].id_produto,
                    text: results.data[i].descricao
                }

                listPreenche.push(dictPreenche)
            }
        })

        this.setState({
            listPreencheProduto: listPreenche
        })
        
    }

    async preencheCliente(){
        let listPreenche = [];
        let dictPreenche;

        await api.get(`/api/v1/cliente`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            for(let i = 0; i < results.data.length; i++){
                dictPreenche = {
                    value: results.data[i].id_cliente,
                    text: results.data[i].nome
                }

                listPreenche.push(dictPreenche)
            }
        })

        this.setState({
            listPreencheCliente: listPreenche
        })
    }

    async preencheEmpresas(){
        let listPreenche = [];
        let dictPreenche;

        await api.get(`/api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            for(let i = 0; i < results.data.length; i++){
                dictPreenche = {
                    value: results.data[i].id_empresa,
                    text: results.data[i].razao_social,
                    cnpj: results.data[i].cnpj
                }
                dictPreenche.cnpj = dictPreenche.cnpj.replace(/\D/g, '')
                .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")
                listPreenche.push(dictPreenche)
            }
        })

        this.setState({
            listPreencheEmpesas: listPreenche
        })
    }

    formatDate(date){
        let data = new Date(date)
        
        let dia = data.getDate() + 1
        let mes = data.getMonth() + 1
        let ano = data.getFullYear()

        if (data.getDate() + 1 < 10){
            dia = `0${data.getDate() + 1}`
        }

        if (data.getMonth() + 1 < 10){
            mes = `0${data.getMonth() + 1}`
        }

        let data_formatada = `${dia}/${mes}/${ano}`

        return data_formatada
    }

    async aplicaFilro(){
        
        let filtro = '';
        let conta_filtro = 0;
        
        if(this.props.tipo === 'descontos' || this.props.tipo === 'cashback'){
            conta_filtro ++
        }
        
        console.log(filtro)
        if (this.state.filtro_empresa !== 0){
            if (conta_filtro>0){
                filtro += `&e.id_empresa=${this.state.filtro_empresa}`
            }else{
                filtro = `?e.id_empresa=${this.state.filtro_empresa}`
                conta_filtro ++
            }
        }

        if (this.state.filtro_cliente !== 0){
            if (conta_filtro>0){
                filtro += `&ve.id_cliente=${this.state.filtro_cliente}`
            }else{
                filtro =`?ve.id_cliente=${this.state.filtro_cliente}`
                conta_filtro ++
            }
        }

        if(this.state.filtro_produto !== 0){
            if (conta_filtro>0){
                filtro += `&p.id_produto=${this.state.filtro_produto}`
            }else{
                filtro =`?p.id_produto=${this.state.filtro_produto}`
                conta_filtro ++
            }
        }

        if(this.state.filtro_promocao !== 0){
            if (conta_filtro>0){
                filtro += `&pr.id_promocao=${this.state.filtro_promocao}`
            }else{
                filtro =`?pr.id_promocao=${this.state.filtro_promocao}`
                conta_filtro ++
            }
        }

        if(this.state.filtro_periodo_ini && this.state.filtro_periodo_fim){
            if (conta_filtro>0){
                filtro += `&ve.data_venda=${this.state.filtro_periodo_ini} and ${this.state.filtro_periodo_fim}`
            }else{
                filtro =`?ve.data_venda=${this.state.filtro_periodo_ini} and ${this.state.filtro_periodo_fim}`
                conta_filtro ++
            }
        }

        if (this.state.filtro_contigencia === 'sim'){
            if (conta_filtro>0){
                filtro += `&ve.contigencia=true`;
            }else{
                filtro = `?ve.contigencia=true`;
                conta_filtro ++;
            }
            
        }else if (this.state.filtro_contigencia === 'nao'){
            if (conta_filtro>0){
                filtro += `&ve.contigencia=false`;
                
            }else{
                filtro =`?ve.contigencia=false`;
                conta_filtro ++;
            }
        }

        if(conta_filtro === 0){
            filtro = ''
        }

        this.setState({
            filtros: filtro
        })

        await this.preencheLista();
        await this.componentDidMount();

        this.setState({
            filtro_empresa: 0,
            filtro_cliente: 0,
            filtro_promocao: 0,
            filtro_produto: 0,
            filtro_periodo_ini: null,
            filtro_periodo_fim: null,
            filtro_contigencia: null
        })
    }

    async preencheLista(){
        
        let preencheLista = [];
        let dados_dict = {};
        let url_relatorios;
        if (this.props.tipo === 'vendas'){
            url_relatorios = `api/v1/relatorio-vendas${this.state.filtros}`
        }

        if(this.props.tipo === 'descontos'){
            url_relatorios = `api/v1/relatorio-vendas?ve.tipo_desconto=DESCONTO${this.state.filtros}`
        }

        if(this.props.tipo === 'cashback'){
            url_relatorios = `api/v1/relatorio-vendas?ve.tipo_desconto=CASHBACK${this.state.filtros}`
        }

        await api.get(url_relatorios, {headers: { Authorization : this.props.token}})
        .then((results)=>{
            for(let i = 0; i<results.data.length;i++){
                results.data[i].data_venda = this.formatDate(results.data[i].data_venda)

                dados_dict = {
                    'ID Venda': `${results.data[i].id_venda}`,
                    'Produto': results.data[i].descricao,
                    'Promoção': results.data[i].titulo,
                    'Empresa': results.data[i].razao_social,
                    'F. Pagamento': results.data[i].descricao_forma_pagamento,
                    'Valor': results.data[i].valor,
                    'Desconto': results.data[i].desconto,
                    'Desc. Uni.': results.data[i].desconto_unidade,
                    'Quantidade': results.data[i].quantidade,
                    'Data Venda': results.data[i].data_venda,
                    'Hora Venda': results.data[i].hora_venda,
                }

                preencheLista.push(dados_dict)
            }

            this.setState({
                listaItens: preencheLista,
            })
        })
        .catch((error)=>{
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                window.location.href='/login'
            }
        })
    }

    async onClickExportarExcel(){
        await api.post(`api/v1/exporta-excel`, this.state.listaItens, {headers: {Authorization: this.props.token}, responseType:'blob' })
        .then((results)=>{
            if (results.data){
                const url = window.URL.createObjectURL(new Blob([results.data]));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', `relatorio.xlsx`);
                document.body.appendChild(link);
                link.click();
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    async onClickExportarPdf(){
        
        let titulo_pdf = null
        
        if (this.props.tipo === 'vendas' && this.props.filtro === 'rede'){
            titulo_pdf = "Vendas da Rede"
        }

        if (this.props.tipo === 'descontos' && this.props.filtro === 'rede'){
            titulo_pdf = "Descontos da Rede"
        }

        if (this.props.tipo === 'cashback' && this.props.filtro === 'rede'){
            titulo_pdf = "Cashback da Rede"
        }

        let dados_idct = {
            titulo: titulo_pdf,
            data: this.state.listaItens
        }

        await api.post(`api/v1/exporta-pdf`, dados_idct, {headers: {Authorization: this.props.token}, responseType:'blob' })
        .then((results)=>{
            if (results.data){
                const url = window.URL.createObjectURL(new Blob([results.data]));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', `relatorio.pdf`);
                document.body.appendChild(link);
                link.click();
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    filtros(){
        let filtros;

        if (this.props.tipo === 'vendas' && this.props.filtro === 'rede'){
            filtros = <React.Fragment>
                        <div className='row-filtros-relatorios'>
                            {this.state.filtros_html.empresa}
                            {this.state.filtros_html.clientes}
                            {this.state.filtros_html.periodo}
                            
                        </div>
                        <div className='row-filtros-relatorios'>
                            {this.state.filtros_html.produto}
                            {this.state.filtros_html.promocao}
                            {this.state.filtros_html.contingencia}
                        </div>
                    </React.Fragment>
        }

        if(this.props.tipo === 'descontos' && this.props.filtro === 'rede'){
            filtros = <React.Fragment>
                        <div className='row-filtros-relatorios'>
                            {this.state.filtros_html.empresa}
                            {this.state.filtros_html.clientes}
                            {this.state.filtros_html.periodo}
                        </div>
                      </React.Fragment>
        }

        if(this.props.tipo === 'cashback' && this.props.filtro === 'rede'){
            filtros = <React.Fragment>
                        <div className='row-filtros-relatorios'>
                            {this.state.filtros_html.empresa}
                            {this.state.filtros_html.clientes}
                            {this.state.filtros_html.periodo}
                        </div>
                      </React.Fragment>
        }

        return (
            filtros
        )
    }

    render(){

        return (
            <div className='content-relatorios'>
                <div className='filtros-relatorios' >
                    <div className='header-filtros-relatorios'>
                        <h4>Filtros</h4>
                    </div>
                    <div className='body-filtros-relatorios'>
                    {
                        this.state.loading ? 
                        (
                            <div className='loader-container-component'>
                                <div className="spinner-component"></div>
                            </div>
                        )
                        :
                        (
                            this.filtros()
                        )
                    }
                    </div>
                    <div className='footer-filtros-relatorios'>
                        <button className='button-filtro-relatorio' onClick={()=>{this.aplicaFilro()}}>
                            Filtrar
                        </button>
                    </div>
                </div>
                {
                    this.state.loading ? 
                    (
                        <div className='loader-container-component'>
                            <div className="spinner-component"></div>
                        </div>
                    )
                    :
                    (
                        <Report data={this.state.listaItens}/>
                    )
                }
                <div className='content-buttons-export' >
                    <button className='button-export__excel' onClick={()=>{this.onClickExportarExcel()}}>EXCEL</button>
                    <button className='button-export__pdf' onClick={()=>{this.onClickExportarPdf()}}>PDF</button>
                    <button className='button-export__email'>EMAIL</button>
                </div>
                
            </div>
        );
    }

}