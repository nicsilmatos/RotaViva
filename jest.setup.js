process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      auth: {
        getUser: jest.fn(),
      },
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn(),
          createSignedUrl: jest.fn(),
          getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://example.com/foto.jpg' } })),
        })),
      },
    };
    return mockSupabase;
  }),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { Base64: 'base64' },
}));

jest.mock('base64-arraybuffer', () => ({
  decode: jest.fn(),
}));
