import { supabase } from '../../backend/supabase';

export async function salvarDadosDaEntrega(entregaId, urlFoto, localizacao) {
  // UPDATE, não INSERT: a entrega já existe (criada em outra parte do app),
  // aqui só preenchemos os campos que são responsabilidade da câmera+GPS.
  const { error } = await supabase
    .from('entregas')
    .update({
      foto_url: urlFoto,
      latitude: localizacao.latitude,
      longitude: localizacao.longitude,
      status: 'Entregue',
    })
    .eq('id', entregaId); // .eq: só atualiza a linha com esse id específico

  if (error) {
    throw new Error('Falha ao salvar entrega: ' + error.message);
  }
}