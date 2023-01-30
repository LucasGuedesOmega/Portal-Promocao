import React from 'react'
import api from '../../services/api';
import { BarChart, DoughnutChart, LineChart, PieChart, PolarAreaChart, RadarChart } from '../../components/Chartsds';
import jwtDecode from 'jwt-decode';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            token: jwtDecode(localStorage.getItem('tokenApi')),
            vendas_concluidas: null,
            vendas_canceladas: null,
            vendas_emitidas: null,
            vendas: null,
            ids_promocao: null,
            loading: false
        }
    }

    async componentDidMount(){
        this.setState({
            loading: true
        })

        await this.get_vendas()

        this.setState({
            loading: false
        })
    }

    async get_vendas(){
        let vendas_concluidas = [];
        let vendas_canceladas = [];
        let vendas_emitidas = [];
        let vendas = [];
        let ids_promocao = [];

        await api.get(`api/v1/promocao`, {headers: { Authorization: localStorage.getItem('tokenApi')}})
        .then((results)=>{
            if (results.data.length > 0){
                for(let i = 0; i<results.data.length; i++){
                    ids_promocao.push(results.data[i].id_promocao)
                }

                this.setState({
                    ids_promocao: ids_promocao
                })
            }
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.erros === "Sem conexao com a api ou falta fazer login."){
                window.location.href='/login'
            }
        })

        await api.get(`api/v1/vendas`, { headers: { Authorization: localStorage.getItem('tokenApi')}})
        .then((results)=>{
            if (results.data.length > 0){
                for(let i = 0; i < results.data.length; i++){
                    if(results.data[i].status_venda === 'CONCLUIDA'){
                        vendas_concluidas.push(results.data[i])
                    }else if(results.data[i].status_venda === 'CANCELADA') {
                        vendas_canceladas.push(results.data[i])
                    }else if(results.data[i].status_venda === 'EMITIDA'){
                        vendas_emitidas.push(results.data[i])
                    }
                    vendas.push(results.data[i])
                }

                this.setState({
                    vendas_emitidas: vendas_emitidas,
                    vendas_canceladas: vendas_canceladas,
                    vendas_concluidas: vendas_concluidas,
                    vendas: vendas
                })
            } 
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.erros === "Sem conexao com a api ou falta fazer login."){
                window.location.href='/login'
            }
        })
    }

    render(){
        return this.state.loading ? (<div className='loader-container'><div className="spinner"></div></div>):(
            <div className="dashboard">
                <div className='row p-0 row-chart'>
                    <div className='col-sm'>
                        <div className="card card-header-dash">
                            <div className='content-card-header-dash'>
                                <div className='content-row-dash header-dash'>
                                    <h5>CashBack Total</h5>
                                </div>
                                <div className='content-row-dash body-dash'>
                                    <h4>0.00</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm '>
                        <div className="card card-header-dash">
                            <div className='content-card-header-dash'>
                                <div className='content-row-dash header-dash'>
                                    <h5>Descontos Total</h5>
                                </div>
                                <div className='content-row-dash body-dash'>
                                    <h4>0.00</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm '>
                        <div className="card card-header-dash">
                            <div className='content-card-header-dash'>
                                <div className='content-row-dash header-dash'>
                                    <h5>Pontos Total</h5>
                                </div>
                                <div className='content-row-dash body-dash'>
                                    <h4>0.00</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm'>
                        <div className="card card-header-dash">
                            <div className='content-card-header-dash'>
                                <div className='content-row-dash header-dash'>
                                    <h5>Resgatados Total</h5>
                                </div>
                                <div className='content-row-dash body-dash'>
                                    <h4>0.00</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
    
                <div className="row p-0 row-chart">
                    <div className="col-sm-8 p-0 m-0">
                        <div className="card-chart">
                            <LineChart data={[10, 20, 5, 75, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                        </div>
                    </div>
                    <div className="col-sm-4 p-0 m-0">
                        <div className="card-chart">
                            <PieChart data={[20, 20, 20, 20]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                        </div>
                    </div>
                </div>
                <div className="row p-0 row-chart">
                    <div className="col-sm-8 p-0 m-0">
                        <div className="card-chart">
                            <BarChart data={[10, 20, 5, 75, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                        </div>
                    </div>
                    <div className="col-sm-4 p-0 m-0">
                        <div className="card-chart">
                            <RadarChart data={[20, 20, 20, 20]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                        </div>
                    </div>
                </div>
                <div className="row p-0 row-chart">
                    <div className="col-sm p-0 m-0">
                        <div className="card-chart">
                            <DoughnutChart data={[10, 20, 5, 80, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                        </div>
                    </div>
                    <div className="col-sm p-0 m-0">
                        <div className="card-chart">
                            <PieChart data={[10, 20, 5, 80, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                        </div>
                    </div>
                    <div className="col-sm p-0 m-0">
                        <div className="card-chart">
                        <PolarAreaChart data={[10, 20, 5, 80, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}