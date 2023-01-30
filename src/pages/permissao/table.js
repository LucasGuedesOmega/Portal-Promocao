import React from 'react'
import api from '../../services/api';
import '../../assets/app.scss';

import DataTable from "react-data-table-component";
import { useNavigate, Link } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast';
export function TablePermissao(){

  let token = localStorage.getItem('tokenApi');
  const navigate = useNavigate();

  return <Table token={token} navigate={navigate}/>;
}

export class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            permissao_list: [],

            tokenDecode: jwtDecode(this.props.token),
            columns: [
                {
                  id: 1,
                  name: "ID",
                  selector: (row) => row.id_permissao,
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
                  name: "Status",
                  selector: (row) => row.status,
                  sortable: true,
                  center: true,
                  reorder: true
                }
            ],
            tela: 'PERMISSAO',
            loading: false,
            url_permissao: null,
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
      
      this.setState({
        loading: false
      })
    }

    async coluna_editar(){
      let columns = this.state.columns;

      if(this.state.editar){
        columns.push(
          {
            id: 4,
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
        url_permissao: `api/v1/permissao`
      }, (()=>{
        this.dados_table()
      }))
    }

    dados_table(){
      let permissaoList = [];
      api.get(this.state.url_permissao, { headers: { Authorization: this.props.token}})
      .then(async (results)=>{
        for (let i = 0; results.data.length>i;i++){

          if (results.data[i].status === true){
              results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(85, 255, 100)'}}>thumb_up</span>;
          }else if (results.data[i].status === false){
              results.data[i].status = <span className="material-symbols-outlined" style={{color: 'rgb(255, 50, 50)'}}>thumb_down</span>;
          }
          
          let url_editar = `/editar-permissao/${results.data[i].id_permissao}`

          results.data[i].editar = <Link to={url_editar}><span className="material-symbols-outlined">edit</span></Link>
          
          let permissao_dict = results.data[i]

          permissaoList.push(permissao_dict)
          
        }

        this.setState({
          permissao_list: permissaoList
        })
          
        
      }).catch((error)=>{
        console.log(error)
        if (error.response.data.error === "Token expirado"){
          window.location.href="/login"
        } else if (error.response.data.error === "não autorizado"){
          window.location.href='/login'
        } else if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
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
                      title="Permissões"
                      columns={this.state.columns}
                      data={this.state.permissao_list}
                      defaultSortFieldId={1}
                      pagination
                      paginationComponentOptions={{
                        rowsPerPageText: "Linhas por páginas",
                        rangeSeparatorText: "de",
                      }}
                      className='tabelas'
                      noDataComponent={<div><p style={{float: 'left', marginRight: '10px'}}>Sem resultados</p><span style={{float: 'left'}} className="material-symbols-outlined mb-3">filter_list_off</span></div>}
                      />
                </div>
              </div>
              <button className='bt_cadastro' onClick={()=>{this.props.navigate(`/cadastrar-permissao`)}}>Cadastrar Permissão</button>
            </div>
        );
    }
}
