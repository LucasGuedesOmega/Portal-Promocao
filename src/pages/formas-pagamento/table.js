import React from 'react'
import api from '../../services/api';
import '../../assets/app.scss';

import { styled } from '@stitches/react';
import { mauve, blackA } from '@radix-ui/colors';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import DataTable from "react-data-table-component";
import { useNavigate, Link, useParams } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';

const SCROLLBAR_SIZE = 10;

const StyledScrollArea = styled(ScrollAreaPrimitive.Root, {
  width: '103%',
  height: '100%',
  borderRadius: 4,
  overflow: 'hidden',
  marginLeft: '-59px',
});

const StyledViewport = styled(ScrollAreaPrimitive.Viewport, {
  width: '100%',
  height: '100%',
  backgrpundColor: 'rgb(200, 200,200)'
});

const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
  display: 'flex',
  userSelect: 'none',
  touchAction: 'none',
  padding: 2,
  background: 'rgb(200, 200, 3,0)',
  transition: 'background 160ms ease-out',
  '&:hover': { background: blackA.blackA8 },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: SCROLLBAR_SIZE,
  },
});

const StyledThumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  background: mauve.mauve10,
  borderRadius: SCROLLBAR_SIZE,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});

const StyledCorner = styled(ScrollAreaPrimitive.Corner, {
  background: blackA.blackA8,
});

// Exports
export const ScrollArea = StyledScrollArea;
export const ScrollAreaViewport = StyledViewport;
export const ScrollAreaScrollbar = StyledScrollbar;
export const ScrollAreaThumb = StyledThumb;
export const ScrollAreaCorner = StyledCorner;

export function TableFormaPagamento(){

  let token = localStorage.getItem('tokenApi');
  const { id_grupo_pagamento } = useParams();

  const navigate = useNavigate();

  return <Table id_grupo_pagamento={id_grupo_pagamento} token={token} navigate={navigate}/>;
}

export class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            forma_pagamento_list: [],
            dados_table: [],
            column:  [
              {
                id: 1,
                name: "ID",
                selector: (row) => row.id_forma_pagamento,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 2,
                name: "Descrição",
                selector: (row) => row.descricao,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 3,
                name: "ID Externo",
                selector: (row) => row.id_externo,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 4,
                name: "ID empresa",
                selector: (row) => row.id_empresa,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 5,
                name: "Tipo",
                selector: (row) => row.tipo,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 6,
                name: "Status",
                selector: (row) => row.status,
                sortable: true,
                center: true,
                reorder: true
              }
            ],

            tokenDecode: jwtDecode(this.props.token),
            tela: 'FORMA_PAGAMENTO',
            loading: false,
            cadastrar: true,
            editar: true
        };
        this.dados_table = this.dados_table.bind(this);
    }
  
    async componentDidMount() {
      this.setState({
        loading: true
      })
      await this.permissao()

      this.dados_table()
      
      this.setState({
        loading: false
      })
    }
    
    async coluna_editar(){
      let columns = this.state.column;
      
      if(this.state.editar){
        columns.push(
          {
            id: 7,
            name: "Editar",
            selector: (row) => row.editar,
            sortable: true,
            center: true,
            reorder: true,
            esconde: false
          }
        )
      }
      
      this.setState({
        columns: columns
      })
    }

    async permissao(){
      let dados_permissao = {
        tela: this.state.tela
      };
      
      await api.post("api/v1/valida-permissao-tela", dados_permissao, {headers: {Authorization: this.props.token}})
      .then((results)=>{  
        if(results.data.length>0){
          if (!results.data[0].permissao){
            this.props.navigate('/')
            toast("Não autorizado !!!", {
                duration: 2000,
                style:{
                    marginRight: '1%',
                    backgroundColor: '#851C00',
                    color: 'white'
                },
                position: 'bottom-right',
                icon: <span className="material-symbols-outlined">sentiment_dissatisfied</span>,
            });
            return;
          }

          this.setState({
            cadastrar: results.data[0].cadastro,
            editar: results.data[0].editar
          }, (async ()=>{
            await this.coluna_editar()
          }))
        }
      })
      .catch((error)=>{
          console.log(error)
          if (error.response.data.error === "Token expirado"){
            window.location.href="/login"
          } else if (error.response.data.error === "não autorizado"){
            window.location.href='/login'
          } else if (error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
            window.location.href='/login'
          }
      })
    }

    async dados_table(){
      let formaPagamentoList = [];
      await api.get(`api/v1/grupo-pagamento?id_grupo_pagamento=${this.props.id_grupo_pagamento}`, { headers: { Authorization: this.props.token}})
      .then(async (results)=>{

        for (let i = 0; results.data.length>i;i++){
          await api.get(`api/v1/forma-pagamento`, { headers: { Authorization: this.props.token}})
          .then((results_forma_pagamento)=>{

            if(results_forma_pagamento.data.length > 0){

              if (results_forma_pagamento.data[0].status === true){
                results_forma_pagamento.data[0].status = <span className="material-symbols-outlined" style={{color: 'rgb(85, 255, 100)'}}>thumb_up</span>;
              }else{
                results_forma_pagamento.data[0].status = <span className="material-symbols-outlined" style={{color: 'rgb(255, 50, 50)'}}>thumb_down</span>;
              }

              let url_editar = `/editar-forma-pagamento/${results_forma_pagamento.data[0].id_forma_pagamento}/${this.props.id_grupo_pagamento}`

              results_forma_pagamento.data[0].editar = <Link to={url_editar}><span className="material-symbols-outlined">edit</span></Link>
              
              let forma_pagamento_dict = results_forma_pagamento.data[0]

              formaPagamentoList.push(forma_pagamento_dict)
            }
          })
          .catch((error)=>{
            console.log(error)
          })
        }
        this.setState({
          forma_pagamento_list: formaPagamentoList
        })
          
        
      }).catch((error)=>{
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
        return this.state.loading ? (<div className='loader-container'><div className="spinner"></div></div>):(
            <div className='tabela'>
              <div>
                <div className='tabela__formulario__table'>
                    <DataTable
                      title="Formas de Pagamento"
                      columns={this.state.columns}
                      data={this.state.forma_pagamento_list}
                      defaultSortFieldId={1}
                      pagination
                      paginationComponentOptions={{
                        rowsPerPageText: "Linhas por paginas",
                        rangeSeparatorText: "de",
                      }}
                      className='tabelas'
                      noDataComponent={<div><p style={{float: 'left', marginRight: '10px'}}>Sem resultados</p><span style={{float: 'left'}} className="material-symbols-outlined mb-3">filter_list_off</span></div>}
                      />
                </div>
              </div>
              {this.state.cadastrar?
              (
                <button className='bt_cadastro' onClick={()=>{this.props.navigate(`/cadastrar-forma-pagamento/${this.props.id_grupo_pagamento}`)}}>Cadastrar Forma de Pagamento</button>
              ):(
                <div></div>
              )

              }
              
              <Toaster/>
            </div>
        );
    }
}
