import * as Location from 'expo-location';

// Tempo máximo que vamos esperar pelo GPS antes de desistir.
const TIMEOUT_GPS_MS = 15000; // 15 segundos

export async function capturarLocalizacao() {
  // Pede permissão de localização (só pergunta de verdade na primeira vez).
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de localização negada');
  }

  // accuracy: High força uma leitura NOVA do GPS, não uma posição em cache antiga.
  const buscarPosicao = Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  // Promise "concorrente": se o GPS não responder a tempo, essa rejeita primeiro.
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('GPS demorou muito para responder')), TIMEOUT_GPS_MS)
  );

  // Promise.race usa o resultado de quem terminar primeiro (posição ou timeout).
  const posicao = await Promise.race([buscarPosicao, timeout]);
  return {
    latitude: posicao.coords.latitude,
    longitude: posicao.coords.longitude,
    timestamp: posicao.timestamp,
  };
}