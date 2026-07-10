import 'react-native-url-polyfill/auto';
import * as SecureStorage from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

//Guarda a sessão auth no SecureStore do dispositivo (não no AsyncStorage)
const ExpoSecureStoreAdapter = {
    // Função para buscar o dado salvo usando uma chave
    getItem: (key) => SecureStorage.getItemAsync(key),
    // Função para salvar o dado usando uma chave e um valor
    setItem: (key, value) => SecureStorage.setItemAsync(key, value),
    // Função para deletar o dado salvo usando a chave
    removeItem: (key) => SecureStorage.deleteItemAsync(key),
};

// Pega a URL do projeto do Supabase que está salva nas variáveis de ambiente (.env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Pega a chave pública do Supabase que também está salva nas variáveis de ambiente
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Cria e exporta a conexão oficial com o banco de dados que todos os outros arquivos vão usar
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,  // Usa o nosso adaptador seguro configurado acima
        autoRefreshToken: true,  // Renova o token de login do usuário sozinho quando expirar
        persistSession: true,  // Mantém o usuário logado mesmo se ele fechar o aplicativo
        detectSessionInUrl: false,  // Desativa detecção por URL (usado mais em sites, não em apps)
    },
});