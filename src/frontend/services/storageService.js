import * as FileSystem from 'expo-file-system/legacy'; // /legacy: API antiga, ainda com readAsStringAsync
import { decode } from 'base64-arraybuffer';
import { supabase } from '../../backend/supabase';

export async function enviarFotoParaStorage(uri) {
  // Lê o arquivo local da foto e transforma em texto (base64).
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Converte pra binário puro — formato que o Storage exige.
  const arrayBuffer = decode(base64);

  // Nome único por timestamp, pra não sobrescrever fotos de outras entregas.
  const nomeArquivo = `entrega-${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from('comprovantes')
    .upload(nomeArquivo, arrayBuffer, { contentType: 'image/jpeg' });

  if (error) {
    // Lançamos o erro em vez de engolir aqui — quem chamou decide o que fazer.
    throw new Error('Falha ao enviar foto: ' + error.message);
  }

  // getPublicUrl só monta a URL a partir do caminho salvo, não faz chamada de rede.
  const { data: urlData } = supabase.storage
    .from('comprovantes')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}