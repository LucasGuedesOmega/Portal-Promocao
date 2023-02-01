import React from "react";
import Chart from 'chart.js/auto';
import { Line, Bar, Doughnut, Pie, PolarArea, Radar } from "react-chartjs-2";

export class LineChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            labels: this.props.labels,
            data: this.props.data,
            titulos: this.props.titulos
        }
    }

    preenche_dados(){
        let lista_dados = []
   
        for (let i = 0; i < this.state.data.length; i++){
            lista_dados.push(
                {   
                    label: this.state.titulos[i],
                    data: this.state.data[i],
                    tension: 0.1,
                    backgroundColor: [
                        'rgba(3, 80, 245, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(255, 206, 86, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(153, 102, 255, 0.3)',
                        'rgba(2, 99, 132, 0.3)',
                        'rgba(54, 2, 235, 0.3)',
                        'rgba(255, 4, 86, 0.3)',
                        'rgba(75, 192, 3, 0.3)',
                        'rgba(153, 102, 1, 0.3)',
                    ],
                    borderColor: [
                        'rgba(3, 80, 245, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(2, 99, 132, 1)',
                        'rgba(54, 2, 235, 1)',
                        'rgba(255, 4, 86, 1)',
                        'rgba(75, 192, 3, 1)',
                        'rgba(153, 102, 1, 1)',
                    ],
                    borderWidth: 1
                }
            )
        }
        
        let dados = {
            labels: this.state.labels,
            datasets: lista_dados
        }

        return dados
    }

    render (){
        return (
            <div>
                <Line className="chart" data={this.preenche_dados()}/>
            </div>
        )
    }
}

export class BarChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            labels: this.props.labels,
            data: this.props.data,
            titulos: this.props.titulos,
            backgroundColor: this.props.backgroundColor,
            borderColor: this.props.borderColor
        }
    }

    preenche_dados(){
        let lista_dados = []
   
        for (let i = 0; i < this.state.data.length; i++){
            lista_dados.push(
                {   
                    label: this.state.titulos[i],
                    data: this.state.data[i],
                    tension: 0.1,
                    backgroundColor: this.state.backgroundColor[i],
                    borderColor: this.state.borderColor[i],
                    borderWidth: 1
                }
            )
        }
        
        let dados = {
            labels: this.state.labels,
            datasets: lista_dados
        }

        return dados
    }

    render(){
        return (
            <div>
                <Bar className="chart" data={this.preenche_dados()}/>
            </div>
        );
    }
}

export class DoughnutChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            labels: this.props.labels,
            data: this.props.data
        }
    }

    preenche_dados(){
        let dados = {
            labels: this.state.labels,
            datasets: [
                {
                    
                    data: this.state.data,
                    backgroundColor: [
                        'rgba(3, 80, 245, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(255, 206, 86, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(153, 102, 255, 0.3)',
                        'rgba(2, 99, 132, 0.3)',
                        'rgba(54, 2, 235, 0.3)',
                        'rgba(255, 4, 86, 0.3)',
                        'rgba(75, 192, 3, 0.3)',
                        'rgba(153, 102, 1, 0.3)',
                    ],
                    borderColor: [
                        'rgba(3, 80, 245, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(2, 99, 132, 1)',
                        'rgba(54, 2, 235, 1)',
                        'rgba(255, 4, 86, 1)',
                        'rgba(75, 192, 3, 1)',
                        'rgba(153, 102, 1, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        }

        return dados
    }


    render(){
        return (
            <div>
                <Doughnut className="chart" data={this.preenche_dados()} title={'TESTTE'} />
            </div>
        )
    }
}
export class RadarChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            labels: this.props.labels,
            data: this.props.data
        }
    }

    preenche_dados(){
        let dados = {
            labels: this.state.labels,
            datasets: [
                {
                    label: '1',
                    data: this.state.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(255, 206, 86, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(153, 102, 255, 0.3)',
                        'rgba(2, 99, 132, 0.3)',
                        'rgba(54, 2, 235, 0.3)',
                        'rgba(255, 4, 86, 0.3)',
                        'rgba(75, 192, 3, 0.3)',
                        'rgba(153, 102, 1, 0.3)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(2, 99, 132, 1)',
                        'rgba(54, 2, 235, 1)',
                        'rgba(255, 4, 86, 1)',
                        'rgba(75, 192, 3, 1)',
                        'rgba(153, 102, 1, 1)',
                    ],
                    borderWidth: 1,
                    fill: true
                }
            ]
        }

        return dados
    }

    render(){
        return (
            <div>
                <Radar className="chart" data={this.preenche_dados()}/>
            </div>
        )
    }
    
}
export class PieChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            labels: this.props.labels,
            data: this.props.data
        }
    }

    preenche_dados(){
        let dados = {
            labels: this.state.labels,
            datasets: [
                {
                    data: this.state.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(255, 206, 86, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(153, 102, 255, 0.3)',
                        'rgba(2, 99, 132, 0.3)',
                        'rgba(54, 2, 235, 0.3)',
                        'rgba(255, 4, 86, 0.3)',
                        'rgba(75, 192, 3, 0.3)',
                        'rgba(153, 102, 1, 0.3)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(2, 99, 132, 1)',
                        'rgba(54, 2, 235, 1)',
                        'rgba(255, 4, 86, 1)',
                        'rgba(75, 192, 3, 1)',
                        'rgba(153, 102, 1, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        }

        return dados
    }

    render(){
        return (
            <div>
                <Pie className="chart" data={this.preenche_dados()}/>
            </div>
        )
    }
}

export class PolarAreaChart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            labels: this.props.labels,
            data: this.props.data
        }
    }

    preenche_dados(){
        let dados = {
            labels: this.state.labels,
            datasets: [
                {
                    data: this.state.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(255, 206, 86, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(153, 102, 255, 0.3)',
                        'rgba(2, 99, 132, 0.3)',
                        'rgba(54, 2, 235, 0.3)',
                        'rgba(255, 4, 86, 0.3)',
                        'rgba(75, 192, 3, 0.3)',
                        'rgba(153, 102, 1, 0.3)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(2, 99, 132, 1)',
                        'rgba(54, 2, 235, 1)',
                        'rgba(255, 4, 86, 1)',
                        'rgba(75, 192, 3, 1)',
                        'rgba(153, 102, 1, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        }

        return dados
    }

    render(){
        return (
            <div>
                <PolarArea className="chart" data={this.preenche_dados()}/>
            </div>
        )
    }
}
