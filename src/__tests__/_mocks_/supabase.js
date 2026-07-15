export const supabase = {
  from: jest.fn(() => supabase),
  select: jest.fn(() => supabase),
  insert: jest.fn(() => supabase),
  update: jest.fn(() => supabase),
  eq: jest.fn(() => supabase),
  in: jest.fn(() => supabase),
  order: jest.fn(() => supabase),
  single: jest.fn(() => supabase),
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

export const createClient = jest.fn(() => supabase);
