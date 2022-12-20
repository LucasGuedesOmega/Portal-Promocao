import React from "react";
import Chart from 'chart.js/auto';
import { Line, Bar, Doughnut, Pie, PolarArea, Radar } from "react-chartjs-2";

export class LineChart extends React.Component{
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
                    borderWidth: 1
                }
            ]
        }

        return dados
    }

    render (){
        return (
            <div>
                <Line data={this.preenche_dados()}/>
            </div>
        )
    }
}

export class BarChart extends React.Component{
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
                        'rgba(3, 80, 245, 0.9)',
                        'rgba(54, 162, 235, 0.9)',
                        'rgba(255, 206, 86, 0.9)',
                        'rgba(75, 192, 192, 0.9)',
                        'rgba(153, 102, 255, 0.9)',
                        'rgba(2, 99, 132, 0.9)',
                        'rgba(54, 2, 235, 0.9)',
                        'rgba(255, 4, 86, 0.9)',
                        'rgba(75, 192, 3, 0.9)',
                        'rgba(153, 102, 1, 0.9)',
                    ],
                    borderWidth: 1
                }
            ]
        }

        return dados
    }

    render(){
        return (
            <div>
                <Bar data={this.preenche_dados()} style={{maxHeight: 500, maxWidth: '100%'}}/>
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
                <Doughnut data={this.preenche_dados()} title={'TESTTE'} />
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
                <Radar data={this.preenche_dados()} style={{maxHeight: 360}}/>
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
                <Pie data={this.preenche_dados()}/>
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
                <PolarArea data={this.preenche_dados()} style={{maxHeight: 500, maxWidth: '100%'}}/>
            </div>
        )
    }
}
