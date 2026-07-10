import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/frontend/screens/LoginScreen';
import ListaEntregasScreen from './src/frontend/screens/ListaEntregasScreen';
import FormularioEntregaScreen from './src/frontend/screens/FormularioEntregaScreen';
import DetalheEntregaScreen from './src/frontend/screens/DetalheEntregaScreen';
import ListaEntregadoresScreen from './src/frontend/screens/ListaEntregadoresScreen';
import FormularioEntregadorScreen from './src/frontend/screens/FormularioEntregadorScreen';

// Cria o "molde" de navegador em pilha
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // NavigationContainer precisa envolver TUDO — é o que guarda o estado
    // de navegação (qual tela está no topo da pilha agora).
    <NavigationContainer>
      {/* initialRouteName define qual tela abre primeiro quando o app inicia */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ListaEntregas" component={ListaEntregasScreen} />
        <Stack.Screen name="FormularioEntrega" component={FormularioEntregaScreen} />
        <Stack.Screen name="DetalheEntrega" component={DetalheEntregaScreen} />
        <Stack.Screen name="ListaEntregadores" component={ListaEntregadoresScreen} />
        <Stack.Screen name="FormularioEntregador" component={FormularioEntregadorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}