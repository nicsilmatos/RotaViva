import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RegistrarEntregaScreen from './src/frontend/screens/RegistrarEntregaScreen';

export default function App() {
  return (
    <SafeAreaProvider>
    <View style={{ flex: 1 }}>
      <RegistrarEntregaScreen />
      <StatusBar style="auto" />
    </View>
    </SafeAreaProvider>
  );
}