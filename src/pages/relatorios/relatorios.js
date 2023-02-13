import React from 'react';
// import api from '../../services/api';
import '../../assets/app.scss';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export function Relatorios(){
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (<Tela token={token} navigate={navigate}/>);
}

class Tela extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tokenDecode: jwtDecode(this.props.token)
        }
    }

    render(){
        return (
            <div className='content-relatorios'>
                <div className='section-relatorios'>
                    <div className='content-titulo-section'>
                        <h1>Vendas</h1>
                    </div>
                    <hr></hr>
                    <div className='content-buttons-section'>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/vendas/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Rede</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/relatorio.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Todas as vendas da Rede </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/vendas/postos')}}>
                            <div className='header-button-relatorio' >
                                <p>Postos</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/estacao-gas.png')} alt='gas-station' height={70} width={80}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Vendas por postos </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/vendas/clientes')}}>
                            <div className='header-button-relatorio' >
                                <p>Clientes</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/cliente.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Vendas por clientes </p>
                            </div>
                        </button>
                    </div>
                </div>  
                <div className='section-relatorios'>
                    <div className='content-titulo-section'>
                        <h1>Descontos e Cashbacks</h1>
                    </div>
                    <hr></hr>
                    <div className='content-buttons-section'>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/descontos-cashback/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Rede</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/relatorio.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Todos os cashbacks e descontos da Rede </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/descontos-cashback/postos')}}>
                            <div className='header-button-relatorio' >
                                <p>Postos</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/estacao-gas.png')} alt='gas-station' height={70} width={80}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Descontos e Cashbacks por postos </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/descontos-cashback/clientes')}} >
                            <div className='header-button-relatorio' >
                                <p>Clientes</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/cliente.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Descontos e Cashbacks por clientes </p>
                            </div>
                        </button>
                    </div>
                </div>  
                <div className='section-relatorios'>
                    <div className='content-titulo-section'>
                        <h1>Resgates</h1>
                    </div>
                    <hr></hr>
                    <div className='content-buttons-section'>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/resgates/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Rede</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/relatorio.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Resgate de cashbacks e pontos da Rede </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/resgates/postos')}}>
                            <div className='header-button-relatorio' >
                                <p>Postos</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/estacao-gas.png')} alt='gas-station' height={70} width={80}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Resgate Cashbacks e pontos por postos </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/resgates/clientes')}}>
                            <div className='header-button-relatorio' >
                                <p>Clientes</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/cliente.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Resgate de Cashbacks e pontos por clientes </p>
                            </div>
                        </button>
                    </div>
                </div>  
            </div>
        );
    }

}