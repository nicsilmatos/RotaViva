/**
 * App.js — Ponto de entrada do aplicativo RotaViva Logística.
 *
 * O app é construído com React Navigation (NativeStackNavigator)
 * e se conecta ao Supabase como backend.
 *
 * Estrutura de telas:
 *   1. ListaEntregas → listagem com abas Pendentes / Histórico
 *   2. DetalheEntrega → dados completos de uma entrega
 *
 * Mais telas serão adicionadas conforme os outros membros do grupo
 * implementarem suas partes (autenticação, registro, etc.).
 */

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/frontend/navigation/AppNavigator';

export default function App() {
  return (
    <>
      {/*
        SafeAreaProvider garante que o conteúdo não fique atrás
        da notch / barra de status em dispositivos modernos.
        Necessário para o react-navigation funcionar corretamente.
      */}
      <SafeAreaProvider>
        {/*
          AppNavigator contém toda a configuração de navegação:
          NavigationContainer + Stack.Navigator + telas.
        */}
        <AppNavigator />
      </SafeAreaProvider>

      {/*
        StatusBar do Expo: controla a aparência da barra
        de notificações do celular.
        "light" = ícones brancos (combina com o header verde).
      */}
      <StatusBar style="light" />
    </>
  );
}
