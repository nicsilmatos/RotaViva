import { supabase } from "./supabase";

/**Busca o perfil do entregador logado (nome, identificação, role)
 * usar depois do login pra saber quem é o usuario e qual o papel dele
 */

export async function getPerfilEntregador() {
    const {data: sessao} = await supabase.auth.getUser();
    if (!sessao?.user) throw new Error('Nenhum usuário autenticado.');

    const {data, error} = await supabase
    .from('entregadores')
    .select('*')
    .eq('id', sessao.user.id)
    .single();

    if (error) throw new error;
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

export async function criarPerfilEntregador(id, nome, identificacao, role = 'entregador'){
    const {data, error} = await supabase
    .from('entregadores')
    .insert({id, nome, identificacao, role})
    .select()
    .single()

    if (error) throw error;
    return data;
}

/**
 * Lista todos os entregadores — só funciona para quem tem role 'supervisor'
 * (a RLS já bloqueia isso no banco; essa função só expõe o que o banco permite).
 */

export async function listaEntregadores() {
    const {data, error} = await supabase
    .from('entregadores')
    .select('*')
    .order('nome')
    
    if (error) throw error;
    return data;
}