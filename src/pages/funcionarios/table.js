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

export function TableFuncionarios(){
  let token = localStorage.getItem('tokenApi');
  const navigate = useNavigate();

  return <Table token={token} navigate={navigate}/>;
}


export class Table extends React.Component{
   
    constructor(props){
        super(props);
        this.state = {
            funcionario_list: [],
            dados_table: [],
            token: jwtDecode(this.props.token),
            url_funcionario: null,
            columns: [
              {
                id: 1,
                name: "ID",
                selector: (row) => row.id_funcionario,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 2,
                name: "Nome",
                selector: (row) => row.nome,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 3,
                name: "CPF",
                selector: (row) => row.cpf,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 4,
                name: "E-mail",
                selector: (row) => row.e_mail,
                sortable: true,
                center: true,
                reorder: true
              },
              {
                id: 5,
                name: "Telefone",
                selector: (row) => row.telefone,
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
              },
              {
                id: 7,
                name: "Editar",
                selector: (row) => row.editar,
                sortable: true,
                center: true,
                reorder: true
              }
            ]
        };

        this.dados_table = this.dados_table.bind(this)
    }

    componentDidMount() {
      this.permissao()
    }

    permissao(){
      this.setState({
        url_funcionario: `/api/v1/funcionario`
      },(()=>{
        this.dados_table()
      })
      )
    }

    async dados_table(){

        let funcionarioList = [];
    
        await api.get(this.state.url_funcionario, { headers: { Authorization: this.props.token}})
        .then((results)=>{
            console.log(results)
            if (results.data.length > 0){
             
              for (let i = 0; results.data.length > i; i++){
                  
                if (results.data[i].status === true){
                  results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(85, 255, 100)'}}>thumb_up</span>;
                }else{
                  results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(255, 50, 50)'}}>thumb_down</span>;
                }
                
                let url_editar = `/editar-funcionario/${results.data[i].id_funcionario}`

                results.data[i].editar = <Link to={url_editar}><span className="material-symbols-outlined">edit</span></Link>

                let funcionario_dict = results.data[i]

                funcionarioList.push(funcionario_dict)
              }
              this.setState({
                  funcionario_list: funcionarioList
              })
            }
        })
        .catch((error)=>{
          console.log(error)
          if(error.response.data[0].erros === 'Sem conexao com a api ou falta fazer login.'){
            window.location.href="/login";
          }else if (error.response.data.error === "Token expirado"){
            window.location.href="/login";
          } else if (error.response.data.error === "não autorizado"){
            window.location.href='/login';
          } 
        })
    }

    render(){
        return (
            <div className='tabela'>
              <div>
                <div className='tabela__formulario__table'>
                  <DataTable
                    title="Funcionários"
                    columns={this.state.columns}
                    data={this.state.funcionario_list}
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
              <button className='bt_cadastro' onClick={()=>{this.props.navigate(`/cadastrar-funcionario`)}}>Cadastrar Funcionários</button>
              <Toaster />
            </div>
        );
    }
}