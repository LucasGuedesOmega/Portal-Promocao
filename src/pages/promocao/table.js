import React from 'react'
import api from '../../services/api';
import '../../assets/app.scss';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@stitches/react';
import { mauve, blackA } from '@radix-ui/colors';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import DataTable from "react-data-table-component";
import toast, { Toaster } from 'react-hot-toast';
import jwtDecode from 'jwt-decode';

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

export function TablePromocao(){
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return <Table navigate={navigate} token={token}/>;
}

class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            promocoes_list: [],
            dados_table: [],
            tokenDecode: jwtDecode(this.props.token),
            url_promocao: null,
            columns: [
              {
                id: 1,
                name: "ID",
                selector: (row) => row.id_promocao,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 2,
                name: "Titulo",
                selector: (row) => row.titulo,
                sortable: true,
                center: true,
                reorder: true,
                width: '200px'
              },
              {
                id: 3,
                name: "Tipo",
                selector: (row) => row.tipo,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 4,
                name: "Desconto T.",
                selector: (row) => row.desconto_total,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 5,
                name: "Desconto U.",
                selector: (row) => row.desconto_por_unidade,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 6,
                name: "Produto",
                selector: (row) => row.id_produto,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 7,
                name: "Data inicio",
                selector: (row) => row.data_format_ini,
                sortable: true,
                center: true,
                reorder: true,
                width: '200px'
              },
              {
                id: 8,
                name: "Data fim",
                selector: (row) => row.data_format_fim,
                sortable: true,
                center: true,
                reorder: true,
                width: '200px'
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
            tela: 'PROMOCAO',
            loading: false,
            cadastrar: true,
            editar: true
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

    async coluna_editar(){
      let columns = this.state.columns;

      if(this.state.editar){
        columns.push(
          {
            id: 10,
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

      this.setState({
        url_promocao: `/api/v1/promocao`
      },(()=>{
        this.dados_table()
      })
      )
    }

    async dados_table(){

      let promocaoList = [];

      try{
        await api.get(this.state.url_promocao, { headers: { Authorization: this.props.token}})
        .then((results)=>{

          if (results.data.length > 0){
            for (let i = 0; results.data.length > i; i++){
              
              if (results.data[i].status === true){
                results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(85, 255, 100)'}}>thumb_up</span>;
              }else{
                results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(255, 50, 50)'}}>thumb_down</span>;
              }
 
              api.get(`/api/v1/integracao/produto/lista?id_produto=${results.data[i].id_produto}`, { headers: { Authorization: this.props.token}})
              .then((results_produto)=>{
                results.data[i].produto =`${results_produto.data[0].descricao}`; 
              })

              let url_editar = `/editar-promocao/${results.data[i].id_promocao}`
              results.data[i].editar = <Link to={url_editar}><span className="material-symbols-outlined">edit</span></Link>
              results.data[i].data_format_ini = new Date(results.data[i].data_ini).toLocaleString("lookup")
              results.data[i].data_format_fim = new Date(results.data[i].data_fim).toLocaleString("lookup")
        
              let promocao_dict = results.data[i]

              promocaoList.push(promocao_dict)
            }

            this.setState({
              promocoes_list: promocaoList
            })
          }
        })
        .catch((error)=>{
          console.log(error)
          if (error.response.data.error === "Token expirado"){
            window.location.href="/login"
          } else if (error.response.data.error === "n�o autorizado"){
            window.location.href='/login'
          } else if (error.name === "AxiosError"){
            window.location.href='/login'
          }
        })

      }catch(error){

        console.log(error)

      }
    }

    render(){
        return this.state.loading ? (<div className='loader-container'><div className="spinner"></div></div>):(
            <div className='tabela'>
                <div>
                  <div className='tabela__formulario__table'>
                    <DataTable
                      title="Promoções"
                      columns={this.state.columns}
                      data={this.state.promocoes_list}
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
                  <button className='bt_cadastro' onClick={()=>{this.props.navigate(`/cadastrar-promocao`)}}>Cadastrar Promoção</button>
                </div>
                <Toaster />
            </div>

        );
    }
}
