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

export async function uploadComprovante(entregaId, entregadorId, fotoUri) {
    //le o arquivo local como basde64
    const base64 = await FileSystem.readAsStringAsync(fotoUri, {
        encoding: FileSystem.EncodingType.EncodingType.base64,
    });

    const caminho = `${entregadorId}/${entregaId}.jpg`;

    const {error : uploadError} = await supabase.storage
    .from('comprovantes')
    .upload(caminho, decode(base64), {
        contentType: 'image/jpeg',
        upsert: true, //permite re-tirar a foto e substituir
    }); 
    
    if (uploadError) throw uploadError;

    //salva o caminho (nao uma signed URL) no registro da entrega

    const {error: updateError} = await supabase
    .from('entregas')
    .update({foto_url: caminho})
    .eq('id', entregaId);

    if (updateError) throw updateError;

    return caminho;
}

/**
 * Gera uma URL temporária válida para exibir a foto na tela de detalhe.
 * Chamar toda vez que for MOSTRAR a foto — não guardar o resultado.
 *
 * @param caminho - valor que está salvo em entregas.foto_url
 * @param validadeSegundos - por quanto tempo a URL funciona (padrão 1h)
 */

export async function obterUrlComprovante(caminho, validadeSegundos = 3600) {
    const {data, error} = await supabase.storage
    .from('comprovantes')
    .createSignedUrl(caminho, validadeSegundos)

    if (error) throw error

    return data.signedUrl;  
}