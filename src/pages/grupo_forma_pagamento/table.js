import React from 'react'
import api from '../../services/api';
import '../../assets/app.scss';

import { styled } from '@stitches/react';
import { mauve, blackA } from '@radix-ui/colors';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import DataTable from "react-data-table-component";
import { useNavigate, Link } from "react-router-dom";
import jwtDecode from 'jwt-decode';

const columns = [
  {
    id: 1,
    name: "ID",
    selector: (row) => row.id_grupo_forma_pagamento,
    sortable: true,
    center: true,
    reorder: true
  },
  {
    id: 2,
    name: "Grupo Pagamento",
    selector: (row) => row.id_grupo_pagamento,
    sortable: true,
    center: true,
    reorder: true
  },
  {
    id: 3,
    name: "Forma Pagamento",
    selector: (row) => row.id_forma_pagamento,
    sortable: true,
    center: true,
    reorder: true
  },
  {
    id: 4,
    name: "Editar",
    selector: (row) => row.editar,
    sortable: true,
    center: true,
    reorder: true
  }
];

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

export function TableGrupoFormaPagamento(){

  let token = localStorage.getItem('tokenApi');
  const navigate = useNavigate();

  return <Table token={token} navigate={navigate}/>;
}

export class Table extends React.Component{
   
    constructor(props){
        super(props);
        this.state = {
            grupo_forma_pagamento_list: [],
            dados_table: [],

            tokenDecode: jwtDecode(this.props.token)
        };

        this.dados_table = this.dados_table.bind(this)
    }

    componentDidMount() {
      this.dados_table()
    }

    dados_table(){

      let grupoFormaPagamentoList = [];

      try{
        
        api.get(`/api/v1/grupo-forma-pagamento?id_empresa=${this.state.tokenDecode.id_empresa}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{
          if (results.data.length > 0){
            for (let i = 0; results.data.length > i; i++){
              console.log(results.data[i])
              if (results.data[i].status === true){
                results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(85, 255, 100)'}}>thumb_up</span>;
              }else{
                results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(255, 50, 50)'}}>thumb_down</span>;
              }
             
              let url_editar = `/editar-grupo-forma-pagamento/${results.data[i].id_grupo_forma_pagamento}`

              results.data[i].editar = <Link to={url_editar}><span className="material-symbols-outlined">edit</span></Link>

              let grupo_forma_pagamento_dict = results.data[i]

              grupoFormaPagamentoList.push(grupo_forma_pagamento_dict)
            }
            this.setState({
                grupo_forma_pagamento_list: grupoFormaPagamentoList
            })
          }
        })

        .catch((error)=>{
          console.log(error)
          if (error.response.data.error === "Token expirado"){
            this.props.navigate("/login")
          } else if (error.response.data.error === "n�o autorizado"){
            this.props.navigate('/login')
          } else if (error.name === "AxiosError"){
            this.props.navigate('/login')
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
                      title="Grupos de Forma de Pagamento"
                      columns={columns}
                      data={this.state.grupo_forma_pagamento_list}
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
              <button className='bt_cadastro' onClick={()=>{this.props.navigate(`/cadastrar-grupo-forma-pagamento`)}}>Cadastrar Grupo de Forma de Pagamento</button>
            </div>
        );
    }
}
