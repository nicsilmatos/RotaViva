// Tela de registro de entrega:
// tira a foto, pega a localização e envia a imagem para o Supabase.

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

// API legacy usada porque os métodos de leitura em base64
// ainda são compatíveis com o SDK utilizado.
import * as FileSystem from 'expo-file-system/legacy';

// Converte base64 em ArrayBuffer (formato aceito pelo Storage).
import { decode } from 'base64-arraybuffer';

import { useRef, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Cliente do Supabase já configurado no projeto.
import { supabase } from '../../backend/supabase';

export default function RegistrarEntregaScreen() {
  // Permissão da câmera.
  const [permissao, solicitarPermissao] = useCameraPermissions();

  // Referência da câmera.
  const cameraRef = useRef(null);

  // Guarda a foto e a localização capturadas.
  const [fotoUri, setFotoUri] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  // Enquanto verifica a permissão.
  if (!permissao) {
    return <SafeAreaView style={{ flex: 1 }} />;
  }

  // Caso o usuário ainda não tenha liberado a câmera.
  if (!permissao.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Precisamos da sua permissão para acessar a câmera</Text>

        <Button
          title="Permitir"
          onPress={solicitarPermissao}
        />
      </SafeAreaView>
    );
  }

  // Faz o upload da foto para o Supabase Storage
  // e retorna a URL pública do arquivo.
  async function enviarFotoParaStorage(uri) {
    try {
      // Lê a imagem em base64.
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Converte para ArrayBuffer.
      const arrayBuffer = decode(base64);

      // Nome único para evitar sobrescrever arquivos.
      const nomeArquivo = `entrega-${Date.now()}.jpg`;

      // Envia a imagem para o bucket.
      const { data, error } = await supabase.storage
        .from('comprovantes')
        .upload(nomeArquivo, arrayBuffer, {
          contentType: 'image/jpeg',
        });

      if (error) {
        console.log('Erro no upload:', error.message);
        return null;
      }

      // Obtém a URL pública da imagem enviada.
      const { data: urlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(data.path);

      console.log('URL pública:', urlData.publicUrl);

      return urlData.publicUrl;
    } catch (err) {
      console.log('Erro ao enviar a foto:', err.message);
      return null;
    }
  }

  // Tira a foto, captura a localização
  // e envia a imagem para o Storage.
  async function tirarFoto() {
    if (!cameraRef.current) return;

    // Captura a foto.
    const foto = await cameraRef.current.takePictureAsync();
    setFotoUri(foto.uri);

    // Solicita permissão para acessar a localização.
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }

    // Obtém a localização atual.
    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLocalizacao({
      latitude: posicao.coords.latitude,
      longitude: posicao.coords.longitude,
      timestamp: posicao.timestamp,
    });

    // Envia a foto para o Storage.
    const urlPublica = await enviarFotoParaStorage(foto.uri);

    console.log('Foto disponível em:', urlPublica);
  }

  // Exibe a foto capturada e a localização.
  if (fotoUri) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Image source={{ uri: fotoUri }} style={{ flex: 1 }} />

        {localizacao && (
          <Text>
            Lat: {localizacao.latitude} | Long: {localizacao.longitude}
          </Text>
        )}

        <Button
          title="Tirar outra foto"
          onPress={() => {
            setFotoUri(null);
            setLocalizacao(null);
          }}
        />
      </SafeAreaView>
    );
  }

  // Tela inicial: mostra a câmera.
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        />

        {/* Botão sobreposto à câmera */}
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
          }}
        >
          <Button title="Tirar foto" onPress={tirarFoto} />
        </View>
      </View>
    </SafeAreaView>
  );
}