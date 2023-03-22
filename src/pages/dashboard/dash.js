import React from 'react'
import api from '../../services/api';
import { BarChart, DoughnutChart, LineChart, PieChart, PolarAreaChart, RadarChart } from '../../components/Chartsds';
import jwtDecode from 'jwt-decode';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            token: jwtDecode(localStorage.getItem('tokenApi')),
            loading: false,

            cashbackTotal: 0.00,
            cashbacks_clientes: null,

            descontosTotal: 0.00,
            descontos_clientes: null

        }
    }

    async componentDidMount(){
        this.setState({
            loading: true
        })

        await this.get_total_cashbacks();

        this.setState({
            loading: false
        })
    }

    async get_total_cashbacks(){
        let cashbacks_clientes = [];
        let total_cashback = 0;
        api.get(`api/v1/total-cashback?tipo=CASHBACK`, {headers: { Authorization: localStorage.getItem('tokenApi')}})
        .then((results)=>{
            for (let i = 0; i < results.data.length; i++){
                cashbacks_clientes.push(results.data[i])
                total_cashback += results.data[i].valor
            }
            this.setState({
                cashbackTotal: total_cashback,
                cashbacks_clientes: cashbacks_clientes
            })
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                window.location.href='/login'
            }
        })
    }

    async get_total_descontos(){
        let descontos_clientes = [];
        let total_descontos = 0;
        api.get(`api/v1/total-cashback?tipo=DESCONTO`, {headers: { Authorization: localStorage.getItem('tokenApi')}})
        .then((results)=>{
            for (let i = 0; i < results.data.length; i++){
                descontos_clientes.push(results.data[i]);
                total_descontos += results.data[i].valor;
            }
            this.setState({
                descontosTotal: total_descontos,
                descontos_clientes: descontos_clientes
            });
        })
        .catch((error)=>{
            console.log(error)
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                window.location.href='/login'
            }
        })
    }
    render(){
        return this.state.loading ? (<div className='loader-container'><div className="spinner"></div></div>):(
            <div className="dashboard">
                <div className='row p-0 row-chart'>
                    <div className='col-sm mt-1'>
                        <div className="card card-header-dash">
                            <div className='content-card-header-dash'>
                                <div className='content-row-dash header-dash'>
                                    <p>CashBack Total</p>
                                </div>
                                <div className='content-row-dash body-dash'>
                                    <p>{this.state.cashbackTotal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm mt-1 '>
                        <div className="card card-header-dash">
                            <div className='content-card-header-dash'>
                                <div className='content-row-dash header-dash'>
                                    <p>Descontos Total</p>
                                </div>
                                <div className='content-row-dash body-dash'>
                                    <p>{this.state.descontosTotal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm mt-1'>
                        <div className="card card-header-dash">
                            <div className='content-card-header-dash'>
                                <div className='content-row-dash header-dash'>
                                    <p>Resgatados Total</p>
                                </div>
                                <div className='content-row-dash body-dash'>
                                    <p>0.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
    
                <div className="row p-0 row-chart">
                    <div className="col-sm-8 p-0 m-0">
                        <div className="card-chart">
                            <div className='card-chart-header'>
                                <p>Titulo</p>
                            </div>
                            <div className='card-chart-body'>
                                <BarChart data={
                                    [
                                        [10, -20, 5, 75, 60, 70, -50, 90, -75, 5, 15, 25, 30, 44, -67, 24, -28, 37], 
                                        [-20, 40, -10, 20, -80, 60, -30, 42, 52, -71, 20, 7, -63, -66, 53, -57, 67, -95],
                                    ]}
                                    titulos={['VALORES 1', 'VALORES 2']}
                                    labels={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']}
                                    backgroundColor={[
                                        'rgba(3, 80, 245, 0.3)',
                                        'rgba(255, 4, 86, 0.3)',
                                    ]}
                                    borderColor={
                                        [
                                            'rgb(3, 80, 245)',
                                            'rgb(255, 4, 86)',
                                        ]
                                    }
                                />
                            </div>
                            
                        </div>
                    </div>
                    <div className="col-sm-4 p-0 m-0">
                        <div className="card-chart">
                            <div className='card-chart-header'>
                                <p>Postos e Promoções</p>
                            </div>
                            <div className='card-chart-body'>
                                <PieChart data={[10, 20, 5, 80, 60]} labels={['1', '2', '3', '4', '5']}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row p-0 row-chart">
                    <div className="col-sm-8 p-0 m-0">
                        <div className="card-chart">
                            <div className='card-chart-header'>
                                <p>Uso de Promoções</p>
                            </div>
                            <div className='card-chart-body'>
                                <LineChart 
                                data={
                                    [
                                        [10, 20, 5, 75, 60, 70, 50, 90, 75, 5, 15, 25, 30, 44, 67, 24, 28, 37], 
                                        [20, 40, 10, 20, 80, 60, 30, 42, 52, 71, 20, 7, 63, 66, 53, 57, 67, 95],
                                        [20, 40, 10, 20, 80, 60, 30, 77, 24, 25, 20, 5, 25, 47, 40, 57, 85, 21],

                                    ]}
                                titulos={['LINHA 1', 'LINHA 2', 'LINHA 3']}
                                labels={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']}/>
                            </div>
                            
                        </div>
                    </div>
                    <div className="col-sm-4 p-0 m-0">
                        <div className="card-chart">
                            <div className='card-chart-header'>
                                <p>Titulo</p>
                            </div>
                            <div className='card-chart-body'>
                                <RadarChart data={[65, 59, 90, 81, 56, 55, 40]} labels={['1', '2', '3', '4', '5', '6' ,'7']}/>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="row p-0 row-chart">
                    <div className="col-sm p-0 m-0">
                        <div className="card-chart">
                            <div className='card-chart-header'>
                                <p>Titulo</p>
                            </div>
                            <div className='card-chart-body'>
                                <DoughnutChart data={[10, 20, 5, 80, 60]} labels={['1', '1', '1', '1', '1']}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm p-0 m-0">
                        <div className="card-chart">
                            <div className='card-chart-header'>
                                <p>Titulo</p>
                            </div>
                            <div className='card-chart-body'>
                                <PolarAreaChart data={[20, 50, 30, 60]} labels={['1', '2', '3', '4']}/>
                            </div>
                            
                        </div>
                    </div>
                    <div className="col-sm p-0 m-0">
                        <div className="card-chart">
                            <div className='card-chart-header'>
                                <p>Titulo</p>
                            </div>
                            <div className='card-chart-body'>
                                <PieChart data={[20, 50, 10, 70]} labels={['1', '2', '3', '5']}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}