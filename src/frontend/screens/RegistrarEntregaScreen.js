import {CameraView, useCameraPermissions} from 'expo-camera';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import {View,Text,Button , Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

 export default function RegistrarEntregaScreen() {
    const [permissao , solicitarPermissao] = useCameraPermissions();
     const cameraRef = useRef(null);
     const [fotoUri, setFotoUri] = useState(null);
     const [localizacao, setLocalizacao] = useState(null);


    //Enquanto o hook ainda não terminou de consultar o sistema operacional
    // permissão vem com null 
    if (!permissao) { 
       return <SafeAreaView style={{ flex: 1 }} />;
 }

 //Se a permissão existe (não é mais null) mas ainda não foi autorizada

 if (!permissao.granted) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>Precisamos da sua permissão para acessar a câmera</Text>
            <Button title="Solicitar Permissão" onPress={solicitarPermissao}/>
        </SafeAreaView>
    );
            //conecta o toque no botão diretamente à função que o hook nos deu
            //Quando o usuário toca, o sistema operacional (não o seu JS)
            //mostra o diálogo nativo.
            //Depois que o usuário responde, o hook atualiza permissao sozinho 
            //e o componente re-renderiza automaticamente 
}

 async function tirarFoto() {
    if (!cameraRef.current) return;
    const foto = await cameraRef.current.takePictureAsync();
    setFotoUri(foto.uri);

    // Pede permissão de localização (se ainda não tiver)
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }

    // Captura a posição ATUAL (não uma posição em cache/antiga)
    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLocalizacao({
      latitude: posicao.coords.latitude,
      longitude: posicao.coords.longitude,
      timestamp: posicao.timestamp,
    });
  }
  

  // Se já existe uma foto tirada, mostramos a prévia dela
  if (fotoUri) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Image source={{ uri: fotoUri }} style={{ flex: 1 }} />
        {localizacao && (
             <Text>
            Lat: {localizacao.latitude} | Long: {localizacao.longitude}
          </Text>
        )}

        <Button title="Tirar outra foto"
         onPress={() => {
            setFotoUri(null)
            setLocalizacao(null)
        }}
         />
      </SafeAreaView>
    );
  }

//Se chegar aqui a permissão já está autorizada  

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
