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
      sidebarNavItens: [],
      telas_api_list: []
    }
  }
  
  async componentDidMount(){
    await this.get_telas_permissao()
    await this.admin_sidebar()
  }

  async get_telas_permissao(){
    var telas_api_list = [];
    await api.get('api/v1/valida-permissao', {headers: {Authorization: this.state.token}})
    .then((results)=>{
      for(let i = 0; i < results.data.length; i++){
        
        telas_api_list.push(results.data[i].nome)
      }

      this.setState({
        telas_api_list: telas_api_list
      })
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

  async admin_sidebar(){
    var fill_list = [];
    
    var token_decode = jwtDecode(this.state.token);

    let sidebarNavItens = [
      {
        display: 'Dashboard',
        icon: <i className='bx bx-home'></i>,
        to: '/dash',
        section: '',
        ativo: false,
        tela: 'DASHBOARD'
      },
      {
        display: 'Clientes',
        icon: <span className="material-symbols-outlined">how_to_reg</span>,
        to: '/cliente',
        ativo: false,
        section: '',
        tela: 'CLIENTE'
      },
      {
        display: 'Produtos',
        icon: <span className="material-symbols-outlined">shopping_cart</span>,
        to: '/produtos',
        ativo: false,
        section: '',
        tela: 'PRODUTO'
      },
      {
        display: 'Promoções',
        icon: <span class="material-symbols-outlined">storefront</span>,
        to: '/promocao',
        section: '',
        cardHeight: '62px',
        ativo: false,
        tela: 'PROMOCAO'
      },
      {
        display: 'Grupo de Pagamento',
        icon: <span className="material-symbols-outlined">account_balance_wallet</span>,
        to: '/grupo-pagamento',
        section: '',
        cardHeight: '62px',
        ativo: false,
        tela: 'GRUPO_PAGAMENTO'
      },
      {
        display: 'Funcionários',
        icon: <span className="material-symbols-outlined">business_center</span>,
        to: '/funcionarios',
        section: '',
        cardHeight: '62px',
        ativo: false,
        tela: 'FUNCIONARIO'
      },
      {
        display: 'Grupo de Usuarios',
        icon: <span className="material-symbols-outlined">group</span>,
        to: '/grupo-usuario',
        section: '',
        cardHeight: '62px',
        ativo: false,
        tela: 'GRUPO_USUARIO'
      },
      {
        display: 'Permissões',
        icon: <span className="material-symbols-outlined">back_hand</span>,
        to: '/permissao',
        section: '',
        cardHeight: '62px',
        ativo: false,
        tela: 'PERMISSAO'
      },
      {
        display: 'Rede',
        icon: <span className="material-symbols-outlined">apartment</span>,
        to: '/grupo-empresa',
        section: '',
        cardHeight: '62px',
        ativo: false,
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

    if (token_decode.admin === true){
      for (let i = 0; i < sidebarNavItens.length; i++){
        if (sidebarNavItens[i]){
          sidebarNavItens[i].ativo = true;
        }
        
        if (sidebarNavItens[i].ativo === true){
          fill_list.push(sidebarNavItens[i]);
        }
      }
    }else{
      for(let j = 0;j<sidebarNavItens.length;j++){
        for(let i = 0; i<this.state.telas_api_list.length; i++){
          if(this.state.telas_api_list[i] === sidebarNavItens[j].tela){
            
            sidebarNavItens[j].ativo = true;
          }
        }

        if (sidebarNavItens[j].ativo === true){
          fill_list.push(sidebarNavItens[j]);
        }
      }
    }
    this.setState({
      sidebarNavItens: fill_list
    })
  }

  render (){
    return (
      <div className="sidebar">
        <div className='sidebar__logo'>
          <div className="row">
            <Link to={'/'} className="col-sm-10 text-logo"><p>Promoção</p></Link>
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
                    <HoverCard.Root title={item.display} openDelay={0}>
                      <HoverCard.Trigger  className={`sidebar__menu__item ${this.state.dados.activeIndex === index ? 'active': ''}`}>
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
                    <div title={item.display} className={`sidebar__menu__item ${this.state.dados.activeIndex === index ? 'active': ''}`} >
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