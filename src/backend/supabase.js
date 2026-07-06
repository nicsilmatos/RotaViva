import 'react-native-url-polyfill/auto';
import * as SecureStorage from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

//Guarda a sessão auth no SecureStore do dispositivo (não no AsyncStorage)
const ExpoSecureStoreAdapter = {
    getItem: (key) => SecureStorage.getItemAsync(key),
    setItem: (key, value) => SecureStorage.getItemAsync(key, value),
    removeItem: (key) => SecureStorage.deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});