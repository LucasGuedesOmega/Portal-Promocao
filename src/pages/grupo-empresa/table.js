import React from 'react'
import api from '../../services/api';
import '../../assets/app.scss';

import { styled } from '@stitches/react';
import { mauve, blackA } from '@radix-ui/colors';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import DataTable from "react-data-table-component";
import { useNavigate, Link } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
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

export function TableGrupoEmpresa(){
  
  let token = localStorage.getItem('tokenApi');
  const navigate = useNavigate();

  return <Table token={token} navigate={navigate}/>;
}


export class Table extends React.Component{
   
    constructor(props){
        super(props);
        this.state = {
            grupo_empresa_list: [],
            dados_table: [],
            tokenDecode: jwtDecode(this.props.token),
            url_grupo_empresa: null,
            columns: [
              {
                id: 1,
                name: "ID",
                selector: (row) => row.id_grupo_empresa,
                sortable: true,
                center: true,
                reorder: true,
                ativo: true
              },
              {
                id: 2,
                name: "Descrição",
                selector: (row) => row.descricao,
                sortable: true,
                center: true,
                reorder: true,
                ativo: true
              },
              {
                id: 3,
                name: "Status",
                selector: (row) => row.status,
                sortable: true,
                center: true,
                reorder: true,
                ativo: true
              },
              {
                id: 4,
                name: "Editar",
                selector: (row) => row.editar,
                sortable: true,
                center: true,
                reorder: true,
                ativo: false
              },
              {
                id: 5,
                name: "Empresa",
                selector: (row) => row.empresa,
                sortable: true,
                center: true,
                reorder: true,
                ativo: true
              },
            ]
        };

        this.dados_table = this.dados_table.bind(this)
    }

    componentDidMount() {
      this.permissao()
    }

    permissao(){
      if(this.state.tokenDecode.admin){
        this.setState({
          url_grupo_empresa: '/api/v1/grupo-empresa'
        }, (()=>{
          this.dados_table()
        }))
      }else{
        this.setState({
          url_grupo_empresa: `/api/v1/grupo-empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`  
        }, (()=>{
          this.dados_table()
        }))
      }
    }

    get_admin_columns(){
      let admin_columns = this.state.columns;
      let fill_list = [];

      for(let i = 0; i < admin_columns.length; i++){
        if (this.state.tokenDecode.admin){
          admin_columns[i].ativo = true
        }
        if (admin_columns[i].ativo){
          fill_list.push(admin_columns[i])
        }
      }

      return fill_list
    }

    dados_table(){

      let grupoEmpresaList = [];

      try{
        
        api.get(this.state.url_grupo_empresa, { headers: { Authorization: this.props.token}})
        .then((results)=>{
          if (results.data.length > 0){
            for (let i = 0; results.data.length > i; i++){
              
              if (results.data[i].status === true){
                results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(85, 255, 100)'}}>thumb_up</span>;
              }else{
                results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(255, 50, 50)'}}>thumb_down</span>;
              }
             
              let url_editar = `/editar-grupo-empresa/${results.data[i].id_grupo_empresa}`

              results.data[i].editar = <Link to={url_editar}><span className="material-symbols-outlined">edit</span></Link>
              
              let url_empresa = `/empresa/${results.data[i].id_grupo_empresa}`

              results.data[i].empresa = <Link to={url_empresa}><span className="material-symbols-outlined">apartment</span></Link>

              let grupo_empresa_dict = results.data[i]

              grupoEmpresaList.push(grupo_empresa_dict)
            }
            this.setState({
                grupo_empresa_list: grupoEmpresaList
            })
          }
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

      }catch(error){

        console.log(error)

      }
    }

    render(){
        return (
            <div className='tabela'>
              <div>
                <div className='tabela__formulario__table'>
                  <DataTable
                    title="Grupo Empresa"
                    columns={this.get_admin_columns()}
                    data={this.state.grupo_empresa_list}
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
              { this.state.tokenDecode.admin ? (
                <button className='bt_cadastro' onClick={()=>{this.props.navigate(`/cadastrar-grupo-empresa`)}}>Cadastrar Grupo de Empresa</button>
              ):(
                <div></div>
              )

              }
              
              <Toaster />
            </div>
        );
    }
}
