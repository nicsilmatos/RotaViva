import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { capturarLocalizacao } from '../services/locationService';
import { enviarFotoParaStorage } from '../services/storageService';
import { salvarDadosDaEntrega } from '../services/entregaService';

// Fixo por enquanto: a tela de "escolher qual entrega estou fazendo" ainda não
// existe no app. Quando existir, isso vira um parâmetro de navegação.
const ENTREGA_ID_TESTE = '83229f20-c107-478d-b7ff-30b2f18ad993';

export default function RegistrarEntregaScreen() {
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [fotoUri, setFotoUri] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [carregando, setCarregando] = useState(false); // controla o spinner
  const [erro, setErro] = useState(null); // mensagem de erro pra mostrar na tela

  // Ainda consultando o sistema operacional sobre a permissão.
  if (!permissao) {
    return <SafeAreaView style={{ flex: 1 }} />;
  }

  // Já sabemos a resposta, e é "não".
  if (!permissao.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Precisamos da sua permissão para acessar a câmera</Text>
        <Button title="Solicitar Permissão" onPress={solicitarPermissao} />
      </SafeAreaView>
    );
  }

  // Orquestra o fluxo inteiro: foto -> GPS -> upload -> banco.
  // Um único try/catch cobre as 4 etapas — se qualquer uma falhar,
  // cai direto no catch e mostra o erro pro usuário.
  async function tirarFoto() {
    if (!cameraRef.current) return;

    setErro(null);
    setCarregando(true);

    try {
      const foto = await cameraRef.current.takePictureAsync();
      setFotoUri(foto.uri);

      const localizacaoAtual = await capturarLocalizacao();
      setLocalizacao(localizacaoAtual);

      const urlPublica = await enviarFotoParaStorage(foto.uri);

      await salvarDadosDaEntrega(ENTREGA_ID_TESTE, urlPublica, localizacaoAtual);
    } catch (err) {
      setErro(err.message);
    } finally {
      // finally roda sempre, com erro ou sem — garante que o spinner some.
      setCarregando(false);
    }
  }

  // Já existe uma foto: mostra prévia + status (carregando / erro / sucesso).
  if (fotoUri) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Image source={{ uri: fotoUri }} style={{ flex: 1 }} />

        {carregando && <ActivityIndicator size="large" />}

        {erro && <Text style={{ color: 'red' }}>Erro: {erro}</Text>}

        {!carregando && !erro && localizacao && (
          <Text>Entrega registrada com sucesso!</Text>
        )}

        <Button
          title="Tirar outra foto"
          onPress={() => {
            setFotoUri(null);
            setLocalizacao(null);
            setErro(null);
          }}
        />
      </SafeAreaView>
    );
  }

  // Estado padrão: câmera liberada, sem foto ainda -> mostra o preview.
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* CameraView não aceita filhos; o botão fica por fora, com absolute. */}
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        <View style={{ position: 'absolute', bottom: 40, alignSelf: 'center' }}>
          <Button title="Tirar foto" onPress={tirarFoto} />
        </View>
      </View>
    </SafeAreaView>
  );
}