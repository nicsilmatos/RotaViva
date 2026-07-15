jest.mock('../../backend/supabase', () => {
  const mockUpload = jest.fn().mockResolvedValue({ error: null })
  const mockCreateSignedUrl = jest.fn().mockResolvedValue({
    data: { signedUrl: 'https://example.com/signed-url' },
    error: null,
  })

  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        createSignedUrl: mockCreateSignedUrl,
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://example.com/foto.jpg' } })),
      })),
    },
  }
  return { supabase: mockSupabase }
})

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { Base64: 'base64' },
}))

jest.mock('base64-arraybuffer', () => ({
  decode: jest.fn(),
}))

import { uploadComprovante, obterUrlComprovante } from '../../backend/comprovantes'
import { supabase } from '../../backend/supabase'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'

describe('comprovantes.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve exportar todas as funções', () => {
    expect(uploadComprovante).toBeDefined()
    expect(obterUrlComprovante).toBeDefined()
  })

  it('uploadComprovante deve ser uma função', () => {
    expect(typeof uploadComprovante).toBe('function')
  })

  it('obterUrlComprovante deve ser uma função', () => {
    expect(typeof obterUrlComprovante).toBe('function')
  })

  it('uploadComprovante deve fazer upload e atualizar foto_url', async () => {
    FileSystem.readAsStringAsync.mockResolvedValue('base64-fake')
    decode.mockReturnValue(new ArrayBuffer(8))
    const storageFrom = supabase.storage.from()
    storageFrom.upload.mockResolvedValue({ error: null })

    const caminho = await uploadComprovante('entrega-1', 'entregador-1', 'file:///foto.jpg')

    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file:///foto.jpg', {
      encoding: 'base64',
    })
    expect(supabase.storage.from).toHaveBeenCalledWith('comprovantes')
    expect(storageFrom.upload).toHaveBeenCalledWith(
      'entregador-1/entrega-1.jpg',
      expect.any(ArrayBuffer),
      { contentType: 'image/jpeg', upsert: true }
    )
    expect(supabase.from).toHaveBeenCalledWith('entregas')
    expect(supabase.update).toHaveBeenCalledWith({ foto_url: caminho })
    expect(supabase.eq).toHaveBeenCalledWith('id', 'entrega-1')
    expect(caminho).toBe('entregador-1/entrega-1.jpg')
  })

  it('uploadComprovante deve lançar erro quando upload falha', async () => {
    FileSystem.readAsStringAsync.mockResolvedValue('base64-fake')
    decode.mockReturnValue(new ArrayBuffer(8))
    const storageFrom = supabase.storage.from()
    storageFrom.upload.mockResolvedValue({ error: new Error('Upload falhou') })

    await expect(
      uploadComprovante('entrega-1', 'entregador-1', 'file:///foto.jpg')
    ).rejects.toThrow('Upload falhou')
  })

  it('obterUrlComprovante deve gerar URL temporária', async () => {
    const storageFrom = supabase.storage.from()
    storageFrom.createSignedUrl.mockResolvedValue({
      data: { signedUrl: 'https://example.com/signed-url' },
      error: null,
    })

    const url = await obterUrlComprovante('entregador-1/entrega-1.jpg', 3600)

    expect(supabase.storage.from).toHaveBeenCalledWith('comprovantes')
    expect(storageFrom.createSignedUrl).toHaveBeenCalledWith(
      'entregador-1/entrega-1.jpg', 3600
    )
    expect(url).toBe('https://example.com/signed-url')
  })

  it('obterUrlComprovante deve lançar erro quando falha', async () => {
    const storageFrom = supabase.storage.from()
    storageFrom.createSignedUrl.mockResolvedValue({
      data: null,
      error: new Error('Erro ao gerar URL'),
    })

    await expect(
      obterUrlComprovante('entregador-1/entrega-1.jpg')
    ).rejects.toThrow('Erro ao gerar URL')
  })
})
