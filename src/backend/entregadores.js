import { supabase } from "./supabase";

/**Busca o perfil do entregador logado (nome, identificação, role)
 * usar depois do login pra saber quem é o usuario e qual o papel dele
 */

export async function getPerfilEntregador() {
    // Pergunta para o sistema de autenticação quem é o usuário logado agora
    const {data: sessao} = await supabase.auth.getUser();
    // Se não tiver nenhum usuário logado, joga um erro na tela
    if (!sessao?.user) throw new Error('Nenhum usuário autenticado.');

    // Vai na tabela 'entregadores' e busca as informações dele
    const {data, error} = await supabase
    .from('entregadores')
    .select('*') // Pega todos os campos da tabela
    .eq('id', sessao.user.id) // Onde o ID da tabela seja igual ao ID do usuário logado
    .single(); // Garante que vai trazer apenas um registro, e não uma lista

    // Se der erro na busca do banco, avisa o sistema
    if (error) throw error;

    // Retorna os dados do entregador encontrados
    return data;
}

/**
 * Cria o registro de entregador logo após o cadastro (auth.signUp).
 * O id precisa ser o mesmo id retornado pelo Supabase Auth.
 *
 * @param id - id do usuário recém-criado no auth
 * @param nome
 * @param identificacao - matrícula, CPF, o que o projeto usar
 * @param role - 'entregador' ou 'supervisor'
 */

export async function criarPerfilEntregador(id, nome, identificacao = 'entregador'){
    // Insere os dados novos na tabela 'entregadores'
    const {data, error} = await supabase
    .from('entregadores')
    .insert({id, nome, identificacao }) // Passa as informações recebidas
    .select() // Pede para retornar os dados que acabaram de ser inseridos
    .single() // Garante que retorna apenas esse novo registro criado

    if (error) throw error;
    // Retorna os dados do novo entregador cadastrado
    return data;
}

/**
 * Lista todos os entregadores — só funciona para quem tem role 'supervisor'
 * (a RLS já bloqueia isso no banco; essa função só expõe o que o banco permite).
 */

export async function listarEntregadores() {
    const {data, error} = await supabase
    .from('entregadores')
    .select('*') // Traz todos os campos
    .order('nome') // Organiza a lista em ordem alfabética pelo nome
    
    if (error) throw error;
    // Retorna a lista de entregadores
    return data;
}