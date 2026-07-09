import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { useRef, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../backend/supabase';

export default function RegistrarEntregaScreen() {
  // Hook que verifica o status da permissão da câmera
  // e fornece a função para solicitar essa permissão.
  const [permissao, solicitarPermissao] = useCameraPermissions();

  // Referência para acessar a câmera (ex.: tirar foto via cameraRef.current.takePictureAsync()).
  const cameraRef = useRef(null);

  // Guarda o caminho local da última foto tirada.
  const [fotoUri, setFotoUri] = useState(null);

  // Guarda a localização capturada logo após a foto.
  const [localizacao, setLocalizacao] = useState(null);

  // Enquanto o status da permissão de câmera ainda está sendo carregado.
  if (!permissao) {
    return <SafeAreaView style={{ flex: 1 }} />;
  }

  // Caso o usuário ainda não tenha permitido o acesso à câmera.
  if (!permissao.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Precisamos da sua permissão para acessar a câmera</Text>
        <Button title="Solicitar Permissão" onPress={solicitarPermissao} />
      </SafeAreaView>
    );
  }

  // Lê o arquivo local da foto e envia para o Supabase Storage.
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

    return data.path;
  } catch (err) {
    console.log('Erro inesperado ao processar/enviar a foto:', err.message);
    return null;
  }
}

  // Fluxo principal: tira a foto -> captura o GPS -> envia pro Storage.
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

    setLocalizacao({
      latitude: posicao.coords.latitude,
      longitude: posicao.coords.longitude,
      timestamp: posicao.timestamp,
    });

    const caminhoNoStorage = await enviarFotoParaStorage(foto.uri);
    console.log('Foto salva em:', caminhoNoStorage);
  }

  // Se já existe uma foto tirada, mostra a prévia dela em vez da câmera.
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

  // Se a permissão de câmera foi concedida e não há foto ainda, mostra o preview.
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