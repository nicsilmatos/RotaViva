jest.mock('../../backend/supabase', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  }
  return { supabase: mockSupabase }
})

import { criarEntrega, listarPendentes, buscarEntregaPorId, listarConcluidas, atualizarStatus } from '../../backend/entregas'
import { supabase } from '../../backend/supabase'

describe('entregas.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve exportar todas as funções', () => {
    expect(criarEntrega).toBeDefined()
    expect(listarPendentes).toBeDefined()
    expect(buscarEntregaPorId).toBeDefined()
    expect(listarConcluidas).toBeDefined()
    expect(atualizarStatus).toBeDefined()
  })

  it('criarEntrega deve ser uma função', () => {
    expect(typeof criarEntrega).toBe('function')
  })

  it('listarPendentes deve ser uma função', () => {
    expect(typeof listarPendentes).toBe('function')
  })

  it('buscarEntregaPorId deve ser uma função', () => {
    expect(typeof buscarEntregaPorId).toBe('function')
  })

  it('listarConcluidas deve ser uma função', () => {
    expect(typeof listarConcluidas).toBe('function')
  })

  it('atualizarStatus deve ser uma função', () => {
    expect(typeof atualizarStatus).toBe('function')
  })

  it('criarEntrega deve inserir no banco e retornar os dados', async () => {
    const dadosMock = { id: '1', codigo_pacote: 'PAC-001' }
    supabase.single.mockResolvedValue({ data: dadosMock, error: null })

    const resultado = await criarEntrega('entregador-1', {
      codigo_pacote: 'PAC-001',
      destinatario_nome: 'João',
      endereco: 'Rua A',
      latitude: '123',
      longitude: '456',
    })

    expect(supabase.from).toHaveBeenCalledWith('entregas')
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ codigo_pacote: 'PAC-001', status: 'pendente' })
    )
    expect(resultado).toEqual(dadosMock)
  })

  it('criarEntrega deve lançar erro quando o banco falha', async () => {
    supabase.single.mockResolvedValue({ data: null, error: new Error('Erro no banco') })

    await expect(criarEntrega('entregador-1', {
      codigo_pacote: 'PAC-001',
      destinatario_nome: 'João',
      endereco: 'Rua A',
      latitude: '123',
      longitude: '456',
    })).rejects.toThrow('Erro no banco')
  })

  it('listarPendentes deve buscar entregas pendentes do entregador', async () => {
    const dadosMock = [{ id: '1', status: 'pendente' }]
    supabase.order.mockResolvedValue({ data: dadosMock, error: null })

    const resultado = await listarPendentes('entregador-1')

    expect(supabase.from).toHaveBeenCalledWith('entregas')
    expect(supabase.eq).toHaveBeenCalledWith('entregador_id', 'entregador-1')
    expect(supabase.eq).toHaveBeenCalledWith('status', 'pendente')
    expect(resultado).toEqual(dadosMock)
  })

  it('listarPendentes deve lançar erro quando falha', async () => {
    supabase.order.mockResolvedValue({ data: null, error: new Error('Erro') })

    await expect(listarPendentes('entregador-1')).rejects.toThrow('Erro')
  })

  it('buscarEntregaPorId deve buscar entrega pelo id', async () => {
    const dadosMock = { id: '1' }
    supabase.single.mockResolvedValue({ data: dadosMock, error: null })

    const resultado = await buscarEntregaPorId('1')

    expect(supabase.from).toHaveBeenCalledWith('entregas')
    expect(supabase.eq).toHaveBeenCalledWith('id', '1')
    expect(resultado).toEqual(dadosMock)
  })

  it('listarConcluidas deve buscar entregas com status entregue ou falha', async () => {
    const dadosMock = [{ id: '1', status: 'entregue' }]
    supabase.order.mockResolvedValue({ data: dadosMock, error: null })

    const resultado = await listarConcluidas('entregador-1')

    expect(supabase.from).toHaveBeenCalledWith('entregas')
    expect(supabase.in).toHaveBeenCalledWith('status', ['entregue', 'falha'])
    expect(resultado).toEqual(dadosMock)
  })

  it('atualizarStatus deve atualizar o status da entrega', async () => {
    const dadosMock = { id: '1', status: 'entregue' }
    supabase.single.mockResolvedValue({ data: dadosMock, error: null })

    const resultado = await atualizarStatus('1', 'entregue')

    expect(supabase.from).toHaveBeenCalledWith('entregas')
    expect(supabase.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'entregue' })
    )
    expect(resultado).toEqual(dadosMock)
  })
})
