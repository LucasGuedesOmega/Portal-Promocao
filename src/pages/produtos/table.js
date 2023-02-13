import React from 'react'
import api from '../../services/api';
import '../../assets/app.scss';

import { styled } from '@stitches/react';
import { mauve, blackA } from '@radix-ui/colors';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import DataTable from "react-data-table-component";
import toast, { Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

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

export function TableProduto(){

  let token = localStorage.getItem('tokenApi');
  const navigate = useNavigate();

  return <Table token={token} navigate={navigate}/>;
}

class Table extends React.Component{
   
    constructor(props){
        super(props);
        this.state = {
            produtos_list: [],
            dados_table: [],
            columns: [
              {
                id: 1,
                name: "ID",
                selector: (row) => row.id_produto,
                sortable: true,
                center: false,
                reorder: true,
                width: '4%',
                headerStyle: (selector, id) => {
                  return { textAlign: "center" };   // removed partial line here
                },
              },
              {
                id: 2,
                name: "ID Externo",
                selector: (row) => row.id_externo,
                sortable: true,
                center: false,
                reorder: true,
                width: '7%',
              },
              {
                id: 3,
                name: "Descrição",
                selector: (row) => row.descricao,
                sortable: true,
                center: false,
                reorder: true,
                width: '30%',
              },
              {
                id: 4,
                name: "Modalidade",
                selector: (row) => row.modalidade_produto,
                sortable: true,
                reorder: true,
                width: '9%',
              },
              {
                id: 5,
                name: "Código Empresa",
                selector: (row) => row.codigo_empresa,
                sortable: true,
                center: false,
                reorder: true,
                width: '10%',
              },
              {
                id: 6,
                name: "Valor",
                selector: (row) => row.valor,
                sortable: true,
                center: false,
                reorder: true,
                width: '7%',
              },
              {
                id: 7,
                name: "Código de Barra",
                selector: (row) => row.codigo_barras,
                sortable: true,
                center: false,
                reorder: true,
                width: '9%',
              },
              {
                id: 8,
                name: "NCM",
                selector: (row) => row.ncm,
                sortable: true,
                center: false,
                reorder: true,
                width: '9%',
              },
              {
                id: 9,
                name: "Status",
                selector: (row) => row.status,
                sortable: true,
                center: true,
                reorder: true
              }
            ],
            tela: 'PRODUTO',
            loading: true
        };

        this.dados_table = this.dados_table.bind(this)
    }

    async componentDidMount() {
      this.setState({
        loading: true
      })
      await this.permissao()
      
      this.setState({
        loading: false
      })
    }

    async permissao(){
      let dados_permissao = {
        tela: this.state.tela
      }

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
          }
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

      await this.dados_table()
    }

    async dados_table(){

      let produtoList = [];

      await api.get('/api/v1/integracao/produto/lista', { headers: { Authorization: this.props.token}})
      .then((results)=>{
        for (let i = 0; results.data.length > i; i++){
          
          if (results.data[i].status === true){
            results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(85, 255, 100)'}}>thumb_up</span>;
          }else{
            results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(255, 50, 50)'}}>thumb_down</span>;
          }

          let produto_dict = results.data[i]

          produtoList.push(produto_dict)
        }
        this.setState({
            produtos_list: produtoList
        })
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
        return this.state.loading ? (<div className='loader-container'><div className="spinner"></div></div>):(
            <div className='tabela'>
              <div>
                <div className='tabela__formulario__table'>
                  <DataTable
                    title="Produtos"
                    columns={this.state.columns}
                    data={this.state.produtos_list}
                    defaultSortFieldId={1}
                    pagination
                    paginationComponentOptions={{
                      rowsPerPageText: "Linhas por paginas",
                      rangeSeparatorText: "de"
                    }}
                    className='tabelas'
                    noDataComponent={<div><p style={{float: 'left', marginRight: '10px'}}>Sem resultados</p><span style={{float: 'left'}} className="material-symbols-outlined mb-3">filter_list_off</span></div>}
                    />
                </div>
              </div>
              <Toaster />
            </div>

        );
    }
}
