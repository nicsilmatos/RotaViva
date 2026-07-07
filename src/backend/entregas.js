import { supabase } from "./supabase";

/**
 * Cria uma nova entrega. Chamar ANTES de subir a foto — precisamos
 * do id da entrega pra montar o caminho do arquivo no Storage.
 *
 * @param entregadorId - id do entregador logado
 * @param dados - { codigo_pacote, destinatario_nome, endereco, latitude, longitude }
 */

export async function criarEntrega(entregadorId, dados) {
    // Insere as informações na tabela 'entregas'
    const {data, error} = await supabase
    .from('entregas')
    .insert({
        entregador_id: entregadorId, // Vincula ao entregador que está criando
        codigo_pacote: dados.codigo_pacote,
        destinatario_nome: dados.destinatario_nome,
        endereco: dados.endereco,
        latitude: dados.latitude,
        longitude: dados.longitude,
        status: 'pendente',  // Toda entrega nova começa com o status 'pendente'
    })
    .select() // Pede para o banco devolver os dados criados (precisamos do ID gerado)
    .single(); // Garante que retorna apenas esse registro

    if (error) throw error;
    // Retorna a entrega criada
    return data;
}

/**
 * Lista as entregas pendentes do entregador logado.
 */

export async function listarPendentes(entregadorId) {
    // Busca na tabela 'entregas'
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('entregador_id', entregadorId) // Onde o entregador seja o informado
    .eq('status', 'pendente') // E onde o status seja rigorosamente 'pendente'
    .order('criado_em', { ascending: false }); // Mostra as mais recentes primeiro

    if (error) throw error;
    // Retorna a lista de entregas pendentes
    return data;   
}

/**
 * Busca uma entrega específica pelo id (tela de detalhe).
 */

export async function buscarEntregaPorId(entregaId) {
    //busca na tabela "entregas"
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('id', entregaId) // Onde o ID seja igual ao ID que passamos para a função
    .single(); // Traz apenas essa entrega

    if (error) throw error;
    // Retorna a entrega encontrada
    return data;
}

/**
 * Atualiza o status da entrega (pendente -> entregue / falha).
 * Marca automaticamente o horário do registro nesse momento.
 *
 * @param entregaId
 * @param novoStatus - 'entregue' ou 'falha'
 */

export async function atualizarStatus(entregaId, novoStatus) {
    //atualiza a tabela "entregas"
    const {data, error} = await supabase
    .from('entregas')
    .update({
        status: novoStatus,  // Define o novo status enviado ('entregue' ou 'falha')
        registrado_em: new Date().toISOString(),  // Grava a data e hora exata de agora
    })
    .eq('id', entregaId) // Apenas na entrega com o ID correspondente
    .select()
    .single();

    if (error) throw error;
    // Retorna a entrega atualizada
    return data;
}

/**
 * Lista as entregas concluídas.
 *
 * @param entregadorId
 */
export async function listarConcluidas(entregadorId) {
    //
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('entregador_id', entregadorId)
    .in('status', ['entregue', 'falha']) //procura os pedidos com status concluídos, mesmo sendo entregue ou não, a pendência foi concluída e esse é o pedido do guia.
    .order('criado_em', {ascending: false})

    if (error) throw error;

    return data;
}

/**
 * Atualiza informações da entrega (não tem haver com o status)
 *
 * @param entregaId
 * @param dados
 */

export async function atualizarEntrega(entregaId, dados) {
     const {data, error} = await supabase
     .from('entregas')
     .update({
        codigo_pacote: dados.codigo_pacote,
        destinatario_nome: dados.destinatario_nome,
        endereco: dados.endereco,
        latitude: dados.latitude,
        longitude: dados.longitude
     })
     .eq('Id', entregaId)
     .select()
     .single()

     if (error) throw error;

     return data;
}

/**
 * Exclui uma entrega definitivamente
 *
 * @param entregaId
 */


export async function deletarEntrega(entregaId){
    const {data, error} = await supabase
    .from('entregas')
    .delete()
    .eq('id', entregaId)
    .select()
    .single()

    if (error) throw error;

    return data;
}