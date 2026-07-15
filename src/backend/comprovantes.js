import { supabase } from "./supabase";
import * as FileSystem from 'expo-file-system';
import { decode } from "base64-arraybuffer";

/**
 * Sobe a foto do comprovante para o Storage e retorna o caminho salvo.
 * Chamada pela tela de registro de entrega, DEPOIS de já ter criado
 * o registro da entrega (precisamos do entregaId pra montar o caminho).
 *
 * @param entregaId - id da entrega já criada no banco
 * @param entregadorId - id do entregador logado (dono da pasta)
 * @param fotoUri - uri local do arquivo (vem da expo-camera, ex: file://...)
 */

// Função para enviar a foto do comprovante para a nuvem
export async function uploadComprovante(entregaId, entregadorId, fotoUri) {
    // Lê o arquivo de imagem do celular e transforma em um texto codificado (base64)
    const base64 = await FileSystem.readAsStringAsync(fotoUri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    // Cria a estrutura de pastas e nome do arquivo: "idDoEntregador/idDaEntrega.jpg"
    const caminho = `${entregadorId}/${entregaId}.jpg`;

    // Envia o arquivo convertido para a pasta 'comprovantes' no Storage do Supabase
    const {error : uploadError} = await supabase.storage
    .from('comprovantes')
    .upload(caminho, decode(base64), {
        contentType: 'image/jpeg', // Avisa que é uma imagem do tipo JPEG
        upsert: true, //permite re-tirar a foto e substituir
    }); 
    
    // Se der erro no envio da foto, para tudo e avisa o sistema
    if (uploadError) throw uploadError;

    // Atualiza a tabela 'entregas' para gravar o caminho da foto que acabamos de salvar

    const {error: updateError} = await supabase
    .from('entregas')
    .update({foto_url: caminho}) // Atualiza a coluna foto_url
    .eq('id', entregaId); // Apenas na entrega que tem o ID correto

    // Se der erro ao salvar o caminho no banco, para tudo e avisa
    if (updateError) throw updateError;

    // Se tudo der certo, devolve o caminho onde a foto foi salva
    return caminho;
}

/**
 * Gera uma URL temporária válida para exibir a foto na tela de detalhe.
 * Chamar toda vez que for MOSTRAR a foto — não guardar o resultado.
 *
 * @param caminho - valor que está salvo em entregas.foto_url
 * @param validadeSegundos - por quanto tempo a URL funciona (padrão 1h)
 */

// Função para criar um link seguro e temporário para conseguir ver a foto
export async function obterUrlComprovante(caminho, validadeSegundos = 3600) {
    // Pede ao Supabase um link seguro para o arquivo, que dura o tempo configurado (padrão 1 hora)
    const {data, error} = await supabase.storage
    .from('comprovantes')
    .createSignedUrl(caminho, validadeSegundos);

    // Se der erro para gerar o link, avisa o sistema   
    if (error) throw error;

    // Devolve o link gerado para que o app possa exibir a imagem na tela
    return data.signedUrl;  
}