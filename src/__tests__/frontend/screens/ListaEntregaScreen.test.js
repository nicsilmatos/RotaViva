import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'

jest.mock('../../../backend/entregas', () => ({
  listarPendentes: jest.fn(),
  listarConcluidas: jest.fn(),
}))

jest.mock('../../../backend/supabase', () => ({
  supabase: {},
}))

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  const ReactLocal = require('react')
  return {
    ...actual,
    useFocusEffect: jest.fn((callback) => {
      ReactLocal.useEffect(() => {
        callback()
      }, [])
    }),
  }
})

import ListaEntregaScreen from '../../../frontend/screens/ListaEntregaScreen'
import { listarPendentes, listarConcluidas } from '../../../backend/entregas'

async function renderizar() {
  const navigation = { navigate: jest.fn() }
  const tela = await render(
    <NavigationContainer>
      <ListaEntregaScreen navigation={navigation} />
    </NavigationContainer>
  )
  return { ...tela, navigation }
}

describe('ListaEntregaScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    listarPendentes.mockResolvedValue([
      {
        id: '1',
        codigo_pacote: 'PAC-001',
        destinatario_nome: 'João Silva',
        endereco: 'Rua A, 123',
        status: 'pendente',
        criado_em: '2026-07-09T12:00:00Z',
      },
      {
        id: '2',
        codigo_pacote: 'PAC-002',
        destinatario_nome: 'Maria Souza',
        endereco: 'Rua B, 456',
        status: 'pendente',
        criado_em: '2026-07-09T12:00:00Z',
      },
    ])

    listarConcluidas.mockResolvedValue([])
  })

  it('deve renderizar o seletor de abas', async () => {
    const { getByText } = await renderizar()
    await waitFor(() => {
      expect(getByText('Pendentes')).toBeTruthy()
      expect(getByText('Histórico')).toBeTruthy()
    })
  })

  it('deve carregar e exibir entregas pendentes ao iniciar', async () => {
    const { getByText } = await renderizar()
    await waitFor(() => {
      expect(getByText('PAC-001')).toBeTruthy()
      expect(getByText('PAC-002')).toBeTruthy()
    })
  })

  it('deve exibir indicador de entregas restantes', async () => {
    const { getByText } = await renderizar()
    await waitFor(() => {
      expect(getByText('Entregas restantes: 2')).toBeTruthy()
    })
  })

  it('deve exibir mensagem quando todas as entregas foram concluídas', async () => {
    listarPendentes.mockResolvedValue([])
    const { getByText } = await renderizar()
    await waitFor(() => {
      expect(getByText(/Todas as entregas foram concluídas/)).toBeTruthy()
    })
  })

  it('deve navegar para DetalheEntrega ao clicar em um card', async () => {
    const { getByText, navigation } = await renderizar()
    await waitFor(() => {
      expect(getByText('PAC-001')).toBeTruthy()
    })
    const cardPac001 = getByText('PAC-001')
    fireEvent.press(cardPac001.parent.parent)
    expect(navigation.navigate).toHaveBeenCalledWith('DetalheEntrega', {
      entrega: expect.objectContaining({ id: '1', codigo_pacote: 'PAC-001' }),
    })
  })

  it('deve exibir mensagem de erro quando a requisição falha', async () => {
    listarPendentes.mockRejectedValue(new Error('Erro de conexão'))
    const { getByText } = await renderizar()
    await waitFor(() => {
      expect(getByText('Erro de conexão')).toBeTruthy()
    })
  })

  it('deve exibir botão "Tentar novamente" em caso de erro', async () => {
    listarPendentes.mockRejectedValue(new Error('Erro de conexão'))
    const { getByText } = await renderizar()
    await waitFor(() => {
      expect(getByText('Tentar novamente')).toBeTruthy()
    })
  })
})
