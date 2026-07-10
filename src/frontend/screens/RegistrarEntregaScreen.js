import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { useRef, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../backend/supabase';

const ENTREGA_ID_TESTE = '83229f20-c107-478d-b7ff-30b2f18ad993';

export default function RegistrarEntregaScreen() {
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [fotoUri, setFotoUri] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  if (!permissao) {
    return <SafeAreaView style={{ flex: 1 }} />;
  }

  if (!permissao.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Precisamos da sua permissão para acessar a câmera</Text>
        <Button title="Solicitar Permissão" onPress={solicitarPermissao} />
      </SafeAreaView>
    );
  }

  async function enviarFotoParaStorage(uri) {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBuffer = decode(base64);
      const nomeArquivo = `entrega-${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('comprovantes')
        .upload(nomeArquivo, arrayBuffer, { contentType: 'image/jpeg' });

      if (error) {
        console.log('Erro no upload:', error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(data.path);

      console.log('URL pública:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err) {
      console.log('Erro inesperado ao processar/enviar a foto:', err.message);
      return null;
    }
  }

  async function salvarDadosDaEntrega(urlFoto, localizacaoAtual) {
    const { data, error } = await supabase
      .from('entregas')
      .update({
        foto_url: urlFoto,
        latitude: localizacaoAtual.latitude,   
        longitude: localizacaoAtual.longitude,
        status: 'Entregue',
     })
      .eq('id', ENTREGA_ID_TESTE);

    if (error) {
      console.log('Erro ao salvar no banco:', error.message);
      return false;
    }

    console.log('Entrega atualizada com sucesso!');
    return true;
  }

  async function tirarFoto() {
    if (!cameraRef.current) return;

    const foto = await cameraRef.current.takePictureAsync();
    setFotoUri(foto.uri);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }

    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const localizacaoAtual = {
      latitude: posicao.coords.latitude,
      longitude: posicao.coords.longitude,
      timestamp: posicao.timestamp,
    };
    setLocalizacao(localizacaoAtual);

    const urlPublica = await enviarFotoParaStorage(foto.uri);
    console.log('Foto disponível em:', urlPublica);

    if (urlPublica) {
      await salvarDadosDaEntrega(urlPublica, localizacaoAtual);
    }
  }

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        <View style={{ position: 'absolute', bottom: 40, alignSelf: 'center' }}>
          <Button title="Tirar foto" onPress={tirarFoto} />
        </View>
      </View>
    </SafeAreaView>
  );
}