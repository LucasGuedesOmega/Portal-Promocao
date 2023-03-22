import React from 'react';
import api from '../../services/api';
import '../../assets/app.scss';
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { styled } from '@stitches/react';
import { blackA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export function EditarPermissao(){

    const { id_permissao } = useParams();
    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_permissao={id_permissao} token={token} navigate={navigate}/>
    );
};

export function CadastrarPermissao(){

    let token = localStorage.getItem('tokenApi');
    const navigate = useNavigate();

    return (
        <Editar id_permissao={null} token={token} navigate={navigate}/>
    );
};

const StyledSwitch = styled(SwitchPrimitive.Root, {
    all: 'unset',
    width: 42,
    height: 25,
    backgroundColor: blackA.blackA9,
    borderRadius: '9999px',
    position: 'relative',
    boxShadow: `0 2px 10px ${blackA.blackA7}`,
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    '&:focus': { boxShadow: `0 0 0 2px black` },
    '&[data-state="checked"]': { backgroundColor: 'black' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
    display: 'block',
    width: 21,
    height: 21,
    backgroundColor: 'white',
    borderRadius: '9999px',
    boxShadow: `0 2px 2px ${blackA.blackA7}`,
    transition: 'transform 100ms',
    transform: 'translateX(2px)',
    willChange: 'transform',
    '&[data-state="checked"]': { transform: 'translateX(19px)' },
});

// Exports
export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;

const Flex = styled('div', { display: 'flex', alignItems: 'center' });
const Label = styled('label', {
  color: 'black',
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
});


class Editar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id_permissao: this.props.id_permissao,
            nome: null,
            telas: [],
            telas_selecionadas: [],
            tokenDecode: jwtDecode(this.props.token),
            delete_list: [],
            status: false,
            loading_permissao: false
        }
    }

    async componentDidMount(){

        this.get_telas()

        if (this.state.id_permissao){

            this.setState({
                loading_permissao: true
            })
            await this.get_permissao()
            await this.get_permissao_tela()

            this.setState({
                loading_permissao: false
            })
        }
    }

    get_telas(){
        let fill_list = [];
        api.get(`api/v1/tela-acao`, { headers: { Authorization: this.props.token}})
        .then((results)=>{
    
            if (results.data.length > 0){
                
                for(let i = 0; i < results.data.length; i++){
                    results.data[i].checked = false;
                    fill_list.push(results.data[i])
                }
                fill_list.sort((a, b)=>{
                    if( a.nome > b.nome ){
                        return 1;
                    }
                    if( a.nome < b.nome ){
                        return - 1;
                    }
                    return 0;
                })  
                this.setState({
                    telas: fill_list
                })    
            }
        })
        .catch((error)=>{
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.error === "Você não tem permissão"){
                this.props.navigate(-1)
            }
        })
    }

    async get_permissao(){
        await api.get(`api/v1/permissao?id_permissao=${this.state.id_permissao}`,  { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    id_permissao: results.data[0].id_permissao,
                    nome: results.data[0].nome,
                    status: results.data[0].status
                })
            }

        })
        .catch((error)=>{
            if (error.response.data.erros[0] === "Sem conexao com a api ou falta fazer login."){
                window.location.href="/login"
            } else if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            }
        })
    }

    async get_permissao_tela(){
        let list_telas_acao = [];
        await api.get(`api/v1/permissao-tela?id_permissao=${this.state.id_permissao}`, { headers: { Authorization: this.props.token}})
        .then((results)=>{
            if(results.data.length > 0){
                for(let i = 0; i<results.data.length;i++){
                    list_telas_acao.push(results.data[i])
                }
            }
           
        })
        .catch((error)=>{
            if (error.response.data.error === "Token expirado"){
                window.location.href="/login"
            } else if (error.response.data.error === "não autorizado"){
                window.location.href='/login'
            } else if (error.response.data.error === "Você não tem permissão"){
                this.props.navigate(-1)
            }
        })

        await this.get_telas_edit(list_telas_acao)
    }
    
    async get_telas_edit(list){
        let fill_list = [];
        for(let i = 0; list.length > i; i++){
            for(let x = 0; x < this.state.telas.length; x++){
                if(this.state.telas[x].id_tela_acao === list[i].id_tela_acao){
                    fill_list.push(this.state.telas[x])
                }
            }
        }

        this.setState({
            telas_selecionadas: fill_list,
        })

        await this.comparaListas()
    }

    async comparaListas(){
        let telas = this.state.telas;
        let telas_selecionadas = this.state.telas_selecionadas;

        for(let i = 0; i < telas_selecionadas.length; i++){
            for(let j = 0; j < telas.length; j++){

                if(telas[j].id_tela_acao === telas_selecionadas[i].id_tela_acao){
                    telas.splice(j, 1);
                }
            }
        }

        this.setState({
            telas: telas
        })
    }

    handleNameValue(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked: target.value;
        const name  = target.name;

        this.setState({
            [name]: value
        })
    }

    marcarLinhaEsquerda(item){
        let fill_list = this.state.telas;

        if(item.checked){
            item.checked = false
        }else{
            item.checked = true
        }
        
        for(let i = 0; i < fill_list.length; i++){
            if(fill_list[i].id_tela_acao === item.id_tela_acao){
                fill_list[i].checked = item.checked
            }
        }

        this.setState({
            telas: fill_list
        })
    }

    marcarLinhaDireita(item){
        let fill_list = this.state.telas_selecionadas;

        if(item.checked){
            item.checked = false
        }else{
            item.checked = true
        }
        
        for(let i = 0; i < fill_list.length; i++){
            if(fill_list[i].id_tela_acao === item.id_tela_acao){
                fill_list[i].checked = item.checked
            }
        }

        this.setState({
            telas_selecionadas: fill_list
        })
    }

    passarSelecionados(){
        let fill_list = this.state.telas_selecionadas;
        let change_list = this.state.telas;
        for(let i = 0; i < change_list.length; i++){
            if(change_list[i].checked){
                change_list[i].checked = false
                fill_list.push(change_list[i]);
                change_list.splice(i, 1);
                i--
            }
        }
        fill_list.sort((a, b)=>{
            if( a.nome > b.nome ){
                return 1;
            }
            if( a.nome < b.nome ){
                return - 1;
            }
            return 0;
        })
        change_list.sort((a, b)=>{
            if( a.nome > b.nome ){
                return 1;
            }
            if( a.nome < b.nome ){
                return - 1;
            }
            return 0;
        })
        this.setState({
            telas_selecionadas: fill_list,
            telas: change_list
        })
    }

    voltarSelecionados(){
        let fill_list = this.state.telas;
        let change_list = this.state.telas_selecionadas;
        let delete_list = this.state.delete_list;

        for(let i = 0; i < change_list.length; i++){
            if(change_list[i].checked){
                change_list[i].checked = false
                fill_list.push(change_list[i]);

                if(delete_list.indexOf(change_list[i]) === -1){
                    delete_list.push(change_list[i])
                }
                
                change_list.splice(i, 1);
                i--
            }
        }

        fill_list.sort((a, b)=>{
            if( a.nome > b.nome ){
                return 1;
            }
            if( a.nome < b.nome ){
                return - 1;
            }
            return 0;
        })
        
        change_list.sort((a, b)=>{
            if( a.nome > b.nome ){
                return 1;
            }
            if( a.nome < b.nome ){
                return - 1;
            }
            return 0;
        })

        this.setState({
            telas_selecionadas: change_list,
            telas: fill_list,
            delete_list: delete_list
        })
    }
    
    submitForm(){
        let dados_permissao = [
            {
                id_permissao: this.state.id_permissao,
                nome: this.state.nome,
                status: this.state.status,
                id_empresa: this.state.tokenDecode.id_empresa,
                id_grupo_empresa: this.state.tokenDecode.id_grupo_empresa
            }   
        ]

        api.post('api/v1/permissao', dados_permissao, {headers: {Authorization: this.props.token}})
        .then(async (results)=>{
            if(results.data[0].Sucesso){    
                this.setState({
                    id_permissao: results.data[0].id
                },(()=>{
                    this.submitFormTelas()
                }))
                
            }
            
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    submitFormTelas(){

        let submit_list = [];
        for(let i = 0; i< this.state.telas_selecionadas.length;i++){
            let submit_dict = {
                id_permissao: this.state.id_permissao,
                id_tela_acao: this.state.telas_selecionadas[i].id_tela_acao,
                tipo: 'I'
            }

            submit_list.push(submit_dict)
        }

        api.post('api/v1/permissao-tela', submit_list, {headers: {Authorization: this.props.token}})
        .then((results)=>{
            toast("Permissão cadastrada com sucesso", {
                duration: 2000,
                style:{
                    marginRight: '1%',
                    backgroundColor: '#078518',
                    color: 'white'
                },
                position: 'bottom-right',
                icon: <span className="material-symbols-outlined">sentiment_satisfied</span>,
            });
        })
        .catch((error)=>{
            console.log(error)
        })

        if(this.state.delete_list.length > 0){
            this.delete_form()
        }

    }

    delete_form(){
        let delete_list = this.state.delete_list;
        let submit_list = [];

        for(let i = 0; i < delete_list.length; i++){
            let submit_dict = {
                id_permissao: this.state.id_permissao,
                id_tela_acao: delete_list[i].id_tela_acao,
                tipo: 'D'
            }

            submit_list.push(submit_dict)
        }

        api.post('api/v1/permissao-tela', submit_list, {headers: {Authorization: this.props.token}})
        .then((results)=>{
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    handleCheckValue(value, name){
        this.setState({
            [name]: value
        });
    }

    render(){
        return (
            <div className='cadastro'>
                <div  className="cadastro__formulario" >
                    <div className="cadastro__formulario__header">
                        <div className="row">
                            <div className="col-md-10"><h3 className="cadastro__formulario__header__titulo">Permissões</h3></div>
                        </div>
                    </div>
                    <hr />
                    <div className="content w-100 cadastro__formulario__content">
                        <div className="row mt-3">
                            <div className="col-sm">
                                <label className='cadastro__formulario__label'>Nome</label>
                                <InputMask className='form-control' value={this.state.nome} name={'nome'} onChange={(value)=>{this.handleNameValue(value)}} />
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <label className='cadastro__formulario__label'>Telas e Ações Permitidas</label>
                            {
                               this.state.loading_permissao ? (
                                    <div className='loader-container-component'>
                                        <div className="spinner-component"></div>
                                    </div>
                                ):(
                                    <React.Fragment>
                                        <ul className='lista-telas col-sm' id="s1">
                                            {
                                                this.state.telas.map((tela, key)=>(
                                                    <li htmlFor="s1" className={tela.checked? 'linha-marcada' : 'linha'} key={`E${key}`} onClick={()=>{this.marcarLinhaEsquerda(tela)}}>{tela.nome}</li>
                                                ))
                                            }
                                        </ul>
                                        <div className='col-sm content-buttons-passar'>
                                            <button className='button-passar' onClick={()=>{this.passarSelecionados()}}>
                                                <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
                                            </button>
                                            <button className='button-desfazer-passar' onClick={()=>{this.voltarSelecionados()}}>
                                                <span className="material-symbols-outlined">keyboard_double_arrow_left</span>
                                            </button>
                                        </div>
                                        
                                        <ul className='lista-telas col-sm' id="s2">
                                            {
                                                this.state.telas_selecionadas.map((item, key)=>(
                                                    <li htmlFor="s2" className={item.checked? 'linha-marcada' : 'linha'} key={`D${key}`} onClick={()=>{this.marcarLinhaDireita(item)}}>{item.nome}</li>
                                                ))
                                            }
                                        </ul>
                                    </React.Fragment>
                                )
                            }
                            
                            <label>
                                    Para usar as permissões selecione a tela ou a ação e passe para o lado direito.
                            </label>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm">
                                <Flex>
                                    <Label htmlFor="s7" css={{ paddingRight: 5 }}>
                                        Status
                                    </Label>
                                    <Switch name='status' checked={this.state.status} onCheckedChange={(value)=>{this.handleCheckValue(value, 'status')}} id="s7">
                                        <SwitchThumb />
                                    </Switch>
                                </Flex>
                            </div>
                            <div className="col-sm">
                              
                            </div>

                            <div className="col-sm">
                                <button onClick={()=>{this.submitForm()}} className="cadastro__formulario__enviar">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        );
    }

}