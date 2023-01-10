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
            ids_promocao: null
        }
    }

    componentDidMount(){
        this.get_vendas()
    }

    get_vendas(){
        let vendas_concluidas = [];
        let vendas_canceladas = [];
        let vendas_emitidas = [];
        let vendas = [];
        let ids_promocao = [];

        api.get(`api/v1/promocao`, {headers: { Authorization: localStorage.getItem('tokenApi')}})
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
            } else if (error.name === "AxiosError"){
                window.location.href='/login'
            }
        })

        api.get(`api/v1/vendas`, { headers: { Authorization: localStorage.getItem('tokenApi')}})
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
                // console.log(this.state.vendas_concluidas, 'concluida', this.state.vendas_emitidas, 'emitida', this.state.vendas_canceladas, 'cancelada')
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
    }

    render(){
        return (
            <div className="dashboard">
                <div className='dashboard__dash'>
                    <div className="row mt-2">
                        <div className="col-sm">
                            <div className="card dashboard__dash__card">
                                <div className="card card-body">
                                    <BarChart data={[10, 20, 5, 75, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm">
                            <div className="card dashboard__dash__card">
                                <div className="card card-body">
                                    <LineChart data={[10, 20, 5, 80, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="card dashboard__dash__card">
                                <div className="card card-body">
                                    <RadarChart data={[20, 20, 20, 20]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm">
                            <div className="card dashboard__dash__card">
                                <div className="card card-body">
                                    <DoughnutChart data={[10, 20, 5, 80, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="card dashboard__dash__card">
                                <div className="card card-body">
                                    <PieChart data={[10, 20, 5, 80, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="card dashboard__dash__card">
                                <div className="card card-body">
                                    <PolarAreaChart data={[10, 20, 5, 80, 60]} labels={['Teste1', 'Teste1', 'Teste1', 'Teste1', 'Teste1']}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}