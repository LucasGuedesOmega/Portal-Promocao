import React from 'react'

import * as HoverCard from '@radix-ui/react-hover-card';

import { styled, keyframes } from '@stitches/react';
import { Link } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const slideDown = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const HoverCardContent = styled(HoverCard.Content, {
  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  '&[data-side="top"]': { animationName: slideDown },
  '&[data-side="bottom"]': { animationName: slideUp  },
});

export class AppNagivationMenu extends React.Component{
    constructor(props){
      super(props);
      this.state = {
          activeIndex: true,
          cardHeight: '272px',
          empresa: 'Empresa Omega ltda',
          data: Date(),
          openSidebar: true
      };
      this.openCloseSideBar = this.openCloseSideBar.bind(this);
    } 

    openCloseSideBar(){
      if (this.state.openSidebar === true){
        this.setState({openSidebar: false})
      } else {
        this.setState({openSidebar: true})
      }
      
      return this.state.openSidebar
    }

    render(){
      return (
        <div>
          <SideBar dados={{activeIndex: this.state.activeIndex, cardHeight: this.state.cardHeight, empresa:this.state.empresa, data: this.state.data}} toggleSidebar={this.openCloseSideBar} isOpen={this.state.openSidebar}/>
        </div>
      );
    }
}

export class SideBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      dados: props.dados,
      token: localStorage.getItem('tokenApi'),
      sidebarNavItens: []
    }
  }
  
  async componentDidMount(){
    await this.admin_sidebar()
  }

  async admin_sidebar(){
    
    var fill_list = [];
    var token_decode = jwtDecode(this.state.token);
    let sidebarNavItens = [
      {
        display: 'Dashboard',
        icon: <i className='bx bx-home'></i>,
        to: '/',
        section: '',
        ativo: true,
        tela: 'DASHBOARD'
      },
      {
        display: 'Clientes',
        icon: <span className="material-symbols-outlined">how_to_reg</span>,
        to: '/cliente',
        ativo: true,
        section: '',
        tela: 'CLIENTE'
      },
      {
        display: 'Produtos',
        icon: <span className="material-symbols-outlined">shopping_cart</span>,
        to: '/produtos',
        ativo: true,
        section: '',
        tela: 'PRODUTO'
      },
      {
        display: 'Promoções',
        icon: <i className='bx bx-receipt'></i>,
        to: '/promocao',
        section: '',
        cardHeight: '62px',
        ativo: true,
        tela: 'PROMOCAO'
      },
      {
        display: 'Grupo de Pagamento',
        icon: <span className="material-symbols-outlined">account_balance_wallet</span>,
        to: '/grupo-pagamento',
        section: '',
        cardHeight: '62px',
        ativo: true,
        tela: 'GRUPO_PAGAMENTO'
      },
      {
        display: 'Funcionários',
        icon: <span className="material-symbols-outlined">business_center</span>,
        to: '/funcionarios',
        section: '',
        cardHeight: '62px',
        ativo: true,
        tela: 'FUNCIONARIO'
      },
      {
        display: 'Grupo de Usuarios',
        icon: <span className="material-symbols-outlined">group</span>,
        to: '/grupo-usuario',
        section: '',
        cardHeight: '62px',
        ativo: true,
        tela: 'GRUPO_USUARIO'
      },
      {
        display: 'Permissões',
        icon: <span className="material-symbols-outlined">back_hand</span>,
        to: '/permissao',
        section: '',
        cardHeight: '62px',
        ativo: true,
        tela: 'PERMISSAO'
      },
      {
        display: 'Rede',
        icon: <span className="material-symbols-outlined">apartment</span>,
        to: '/grupo-empresa',
        section: '',
        cardHeight: '62px',
        ativo: true,
        tela: 'REDE'
      },
      {
        display: 'Super Usuarios',
        icon: <span className="material-symbols-outlined">person</span>,
        to: '/usuario-relacao',
        section: '',
        cardHeight: '62px',
        ativo: false,
        tela: null
      },
    ]

    for (let i = 0; i < sidebarNavItens.length; i++){
      if (sidebarNavItens[i]){
        if (token_decode.admin === true){
          sidebarNavItens[i].ativo = true;
        }
      }
      if (sidebarNavItens[i].tela !== null){
        let dados_permissao;
        if (sidebarNavItens[i].tela){
          dados_permissao = {
            tela: sidebarNavItens[i].tela
          }
        }
  
        await api.post('api/v1/valida-permissao', dados_permissao, {headers: {Authorization: this.state.token}})
        .then((results)=>{
          console.log(results.data[0].permissao)
          sidebarNavItens[i].ativo = results.data[0].permissao;
          
        })
        .catch((error)=>{
          console.log(error)
          if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
            window.location.href="/login";
          }else if (error.response.data.error === "Token expirado"){
            window.location.href="/login";
          } else if (error.response.data.error === "não autorizado"){
            window.location.href='/login';
          } 
        })
      }
    
      if (sidebarNavItens[i].ativo === true){
        fill_list.push(sidebarNavItens[i]);
      }
    }

    this.setState({
      sidebarNavItens: fill_list
    })
  }

  render (){
    return (
      <div className="sidebar col-sm-12 hidden-lg hidden-md hidden-xs">
        <div className='sidebar__logo'>
          <div className="row">
            <div className="col-sm-10"><p>Promoção</p></div>
          </div>
        </div>
          <hr></hr>
        <div className='sidebar__menu'>
          <div className="sidebar__menu__indicator"></div>
          <div>
            {
              this.state.sidebarNavItens.map((item, index)=>(
                
                <Link to={item.to} key={index}>
                  {item.card ? (
                    <HoverCard.Root openDelay={0}>
                      <HoverCard.Trigger className={`sidebar__menu__item ${this.state.dados.activeIndex === index ? 'active': ''}`}>
                        <div className="sidebar__menu__item__icon">
                          {item.icon}
                        </div>
                        <div className="sidebar__menu__item__text">
                          {item.display}
                        </div>
                      </HoverCard.Trigger>
                      <HoverCardContent side='right' className='cardSidebar' style={{height: item.cardHeight}}>
                          <div className="cardSidebar__menu">
                            {
                              item.card.map((card_item, card_index)=>(
                                <Link to={card_item.to} key={card_index}>
                                  <div className="cardSidebar__menu__item">
                                    <div className="cardSidebar__menu__item__icon">
                                      {card_item.icon}
                                    </div>
                                    <div className="cardSidebar__menu__item__text">
                                      {card_item.display}
                                    </div>
                                  </div>
                                </Link>
                              ))
                            }
                          </div>
                      </HoverCardContent>
                    </HoverCard.Root>
                  ) : (
                    <div className={`sidebar__menu__item ${this.state.dados.activeIndex === index ? 'active': ''}`} >
                      <div className="sidebar__menu__item__icon">
                        {item.icon}
                      </div>
                      <div className="sidebar__menu__item__text">
                        {item.display}
                      </div>
                    </div>
                  )}
                  
                </Link>))
            }
          </div>
        </div> 
      </div>
    );
  }
  
};