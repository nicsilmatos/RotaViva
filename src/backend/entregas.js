import { supabase } from "./supabase";

/**
 * Cria uma nova entrega. Chamar ANTES de subir a foto — precisamos
 * do id da entrega pra montar o caminho do arquivo no Storage.
 *
 * @param entregadorId - id do entregador logado
 * @param dados - { codigo_pacote, destinatario_nome, endereco, latitude, longitude }
 */

export async function criarEntrega(entregadorId, dados) {
    const {data, error} = await supabase
    .from('entregas')
    .insert({
        entregador_id: entregadorId,
        codigo_pacote: dados.codigo_pacote,
        destinatario_nome: dados.destinatario_nome,
        endereco: dados.endereco,
        latitude: dados.latitude,
        longitude: dados.longitude,
        status: 'pendente',
    })
    .select()
    .single();

    if (error) throw error;
    return data;
}

/**
 * Lista as entregas pendentes do entregador logado.
 */

export async function listarPendentes(entregadorId) {
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('entregador_id', entregadorId)
    .eq('status', 'pendente')
    .order('criado_em', { ascending: false });

    if (error) throw error;
    return data;   
}

/**
 * Busca uma entrega específica pelo id (tela de detalhe).
 */

export async function buscarEntregaPorId(entregaId) {
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('id', entregaId)
    .single();

    if (error) throw error;
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
    const {data, error} = await supabase
    .from('entregas')
    .update({
        status: novoStatus,
        registrado_em: new Date().toISOString(),
    })
    .eq('id', entregaId)
    .select()
    .single();

    if (error) throw error;
    return data;
}