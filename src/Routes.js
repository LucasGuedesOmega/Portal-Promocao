import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, {Fragment} from 'react'
import './assets/app.scss';
import { PaginaPrincipal } from "./pages/principal";
import { TableCliente } from "./pages/clientes/table";
import { CadastrarCliente, EditarCliente } from "./pages/clientes/editar";
import Dashboard from "./pages/dashboard/dash";
import { TableProduto } from "./pages/produtos/table";
import { Login } from "./pages/login";
import { TablePromocao } from "./pages/promocao/table";
import { CadastrarPromocao, EditarPromocao } from "./pages/promocao/editar";
import { Usuario } from "./pages/usuarios/usuario";
import PrivateRoutes from "./pages/login/privateroute";
import { TableEmpresa } from "./pages/empresas/table";
import { EditarEmpresa, CadastrarEmpresa } from "./pages/empresas/editar";
import { TableGrupoEmpresa } from "./pages/grupo-empresa/table";
import { CadastrarGrupoEmpresa, EditarGrupoEmpresa } from "./pages/grupo-empresa/editar";
import { TableUsuario } from "./pages/usuarios/table";
import { CadastrarUusario, EditarUsuario } from "./pages/usuarios/editar";
import { TableFormaPagamento } from "./pages/formas-pagamento/table";
import { CadastrarFormaPagamento, EditarFormaPagamento } from "./pages/formas-pagamento/editar";
import { TableGrupoPagamento } from "./pages/grupo_pagamento/table";
import { CadastrarGrupoPagamento, EditarGrupoPagamento } from "./pages/grupo_pagamento/editar";

export class AppRotas extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            token: true
        }
    }

    render(){
        return (
        <Router>
            <Fragment>
                <Routes>   
                    <Route path="/Login" element={<Login/>}></Route>
                    <Route element={<PrivateRoutes/>}>
                        <Route path="/" element={<PaginaPrincipal/>}>
                            <Route path="/" element={<Dashboard/>}/>
                        
                            <Route path="/cliente" element={<TableCliente/>}/>
                            <Route path="/cadastrar-cliente" element={<CadastrarCliente/>}/>
                            <Route path="/editar-cliente/:id_cliente" element={<EditarCliente/>}/>

                            <Route path="/produtos" element={<TableProduto/>}/>

                            <Route path="/promocao" element={<TablePromocao/>}/>
                            <Route path="/cadastrar-promocao" element={<CadastrarPromocao/>}/>
                            <Route path="/editar-promocao/:id_promocao" element={<EditarPromocao/>}/>

                            <Route path="/usuario" element={<Usuario/>}/>
                            <Route path="/usuario-relacao" element={<TableUsuario/>}/>
                            <Route path="/editar-usuario/:id_usuario" element={<EditarUsuario/>}/>
                            <Route path="/cadastrar-usuario" element={<CadastrarUusario/>}/>

                            <Route path="/grupo-empresa" element={<TableGrupoEmpresa/>}/>
                            <Route path="/editar-grupo-empresa/:id_grupo_empresa" element={<EditarGrupoEmpresa/>}/>
                            <Route path="/cadastrar-grupo-empresa" element={<CadastrarGrupoEmpresa/>}/>

                            <Route path="/empresa/:id_grupo_empresa" element={<TableEmpresa/>}/>
                            <Route path="/editar-empresa/:id_empresa/:id_grupo_empresa" element={<EditarEmpresa/>}/>
                            <Route path="/cadastrar-empresa/:id_grupo_empresa" element={<CadastrarEmpresa/>}/>

                            <Route path="/forma-pagamento/:id_grupo_pagamento" element={<TableFormaPagamento/>}/>
                            <Route path="/editar-forma-pagamento/:id_forma_pagamento/:id_grupo_pagamento" element={<EditarFormaPagamento/>}/>
                            <Route path="/cadastrar-forma-pagamento/:id_grupo_pagamento" element={<CadastrarFormaPagamento/>}/>

                            <Route path="/grupo-pagamento" element={<TableGrupoPagamento/>}/>
                            <Route path="/editar-grupo-pagamento/:id_grupo_pagamento" element={<EditarGrupoPagamento/>}/>
                            <Route path="/cadastrar-grupo-pagamento" element={<CadastrarGrupoPagamento/>}/>

                            <Route path="/*" element={<Dashboard/>}/>
                        </Route>
                    </Route>
                </Routes>
            </Fragment>    
        </Router>
        );
    }
}