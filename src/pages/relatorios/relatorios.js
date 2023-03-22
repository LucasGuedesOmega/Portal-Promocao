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
                        <h1>Vendas</h1><img src={require('../../assets/images/cartao-magnetico.png')} alt='relatorios' height={35} width={35}/>
                    </div>
                    <hr></hr>
                    <div className='content-buttons-section'>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/vendas/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Vendas com voucher</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/acordo.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Todas as vendas da Rede que usaram voucher </p>
                            </div>
                        </button>
                    </div>
                </div>  
                <div className='section-relatorios'>
                    <div className='content-titulo-section'>
                        <h1>Descontos e Cashbacks</h1><img src={require('../../assets/images/super-oferta.png')} alt='relatorios' height={35} width={35}/>
                    </div>
                    <hr></hr>
                    <div className='content-buttons-section'>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/descontos/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Descontos</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/etiqueta-de-desconto.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Todos os descontos da Rede </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/cashback/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Cashbacks</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/dinheiro-de-volta.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Todos os cashbacks da Rede </p>
                            </div>
                        </button>
                    </div>
                </div>  
                <div className='section-relatorios'>
                    <div className='content-titulo-section'>
                        <h1>Resgates</h1><img src={require('../../assets/images/forma-de-pagamento.png')} alt='relatorios' height={35} width={35}/>
                    </div>
                    <hr></hr>
                    <div className='content-buttons-section'>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/resgates/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Cashbacks</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/dinheiro-de-volta.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> Resgate de cashbacks Rede </p>
                            </div>
                        </button>
                        <button className='button-relatorios' onClick={()=>{this.props.navigate('/relatorios/relacao/resgates/rede')}}>
                            <div className='header-button-relatorio' >
                                <p>Contas a Pagar entre Postos</p>
                            </div>
                            <div className='body-button-relatorio' >
                                <img src={require('../../assets/images/pontuacao-de-credito-empresarial.png')}  alt='relatorios' height={50} width={50}/>
                            </div>
                            <div className='footer-button-relatorio' >
                                <p> O quanto um posto deve ao outro de acordo com resgates.</p>
                            </div>
                        </button>
                    </div>
                </div>  
            </div>
        );
    }

}