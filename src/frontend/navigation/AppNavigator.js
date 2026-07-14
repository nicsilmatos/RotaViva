import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListaEntregaScreen from '../screens/ListaEntregaScreen';
import DetalheEntregaScreen from '../screens/DetalheEntregaScreen';

/**
 * AppNavigator — configuração principal de navegação do app.
 *
 * Usa NativeStackNavigator (navegação nativa com transições suaves).
 *
 * Estrutura de telas:
 *   - "ListaEntregas"   → tela principal com abas Pendentes / Histórico
 *   - "DetalheEntrega"  → detalhes completos de uma entrega (ao clicar num card da lista)
 *
 * A navegação é do tipo pilha (stack): o usuário entra na lista,
 * toca num card e vai pro detalhe, podendo voltar com o botão "Voltar".
 */

// Cria uma instância do Stack Navigator
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    // NavigationContainer é o componente raiz que gerencia o estado da navegação
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListaEntregas"  // Tela inicial ao abrir o app
        screenOptions={{
          // Estilo padrão do cabeçalho para todas as telas (pode ser sobrescrito por tela)
          headerStyle: {
            backgroundColor: '#16a34a',    // Verde RotaViva
          },
          headerTintColor: '#ffffff',       // Ícones e texto do header em branco
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerBackTitleVisible: false,    // Não mostra texto ao lado do botão Voltar
          // Animação de transição entre telas (slide vertical padrão do iOS/Android)
          animation: 'slide_from_right',
        }}
      >
        {/*
          Tela de listagem de entregas (Pendentes + Histórico em abas).
          options: esconde o título padrão para usar um customizado ou só
          deixar o título padrão "Entregas" mesmo.
        */}
        <Stack.Screen
          name="ListaEntregas"
          component={ListaEntregaScreen}
          options={{ title: 'RotaViva' }}   // Título que aparece no header
        />

        {/*
          Tela de detalhe de uma entrega.
          O título é dinâmico: mostra o código do pacote da entrega
          que foi passada via parâmetro de navegação (route.params.entrega).
        */}
        <Stack.Screen
          name="DetalheEntrega"
          component={DetalheEntregaScreen}
          options={({ route }) => ({
            title: route.params?.entrega?.codigo_pacote || 'Detalhe da Entrega',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
