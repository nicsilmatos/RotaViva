jest.mock('../../backend/supabase', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    auth: {
      getUser: jest.fn(),
    },
  }
  return { supabase: mockSupabase }
})

import { getPerfilEntregador, criarPerfilEntregador, listarEntregadores } from '../../backend/entregadores'
import { supabase } from '../../backend/supabase'

describe('entregadores.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve exportar todas as funções', () => {
    expect(getPerfilEntregador).toBeDefined()
    expect(criarPerfilEntregador).toBeDefined()
    expect(listarEntregadores).toBeDefined()
  })

  it('getPerfilEntregador deve ser uma função', () => {
    expect(typeof getPerfilEntregador).toBe('function')
  })

  it('criarPerfilEntregador deve ser uma função', () => {
    expect(typeof criarPerfilEntregador).toBe('function')
  })

  it('listarEntregadores deve ser uma função', () => {
    expect(typeof listarEntregadores).toBe('function')
  })

  it('getPerfilEntregador deve buscar o perfil do usuário logado', async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'teste@teste.com' } },
    })
    supabase.single.mockResolvedValue({
      data: { id: 'user-1', nome: 'João', role: 'entregador' },
      error: null,
    })

    const resultado = await getPerfilEntregador()

    expect(supabase.from).toHaveBeenCalledWith('entregadores')
    expect(supabase.eq).toHaveBeenCalledWith('id', 'user-1')
    expect(resultado.nome).toBe('João')
  })

  it('getPerfilEntregador deve lançar erro quando não há usuário autenticado', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } })

    await expect(getPerfilEntregador()).rejects.toThrow('Nenhum usuário autenticado')
  })

  it('criarPerfilEntregador deve inserir no banco', async () => {
    supabase.single.mockResolvedValue({
      data: { id: 'user-1', nome: 'João', identificacao: '123', role: 'entregador' },
      error: null,
    })

    const resultado = await criarPerfilEntregador('user-1', 'João', '123')

    expect(supabase.from).toHaveBeenCalledWith('entregadores')
    expect(supabase.insert).toHaveBeenCalledWith({
      id: 'user-1', nome: 'João', identificacao: '123', role: 'entregador',
    })
    expect(resultado.nome).toBe('João')
  })

  it('listarEntregadores deve listar todos os entregadores', async () => {
    supabase.order.mockResolvedValue({
      data: [{ id: '1', nome: 'João' }, { id: '2', nome: 'Maria' }],
      error: null,
    })

    const resultado = await listarEntregadores()

    expect(supabase.from).toHaveBeenCalledWith('entregadores')
    expect(resultado).toHaveLength(2)
  })

  it('listarEntregadores deve lançar erro quando falha', async () => {
    supabase.order.mockResolvedValue({ data: null, error: new Error('Erro') })

    await expect(listarEntregadores()).rejects.toThrow('Erro')
  })
})
