import {useCameraPermissions} from 'expo-camera';
import {useEffect} from 'react';
import {Text, Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

 export default function RegistrarEntregaScreen() {
    const [permissao , solicitarPermissao] = useCameraPermissions();

    //Enquanto o hook ainda não terminou de consultar o sistema operacional
    // permissao vem como null. 
    if (!permissao) {
        //Ainda carregando os status da permissão 
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

//Se chegar aqui a permissão já está autorizada

return (
    <SafeAreaView style={{ flex: 1 }}>
        <Text>Câmera autorizada - próxima etapa: abrir a câmera de verdade.</Text>
    </SafeAreaView>
 );
}
