import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CardEntrega from '../../../frontend/components/CardEntrega'

function formatarDataEsperada(dataISO) {
  const data = new Date(dataISO)
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  const hora = String(data.getHours()).padStart(2, '0')
  const minuto = String(data.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`
}

describe('CardEntrega', () => {
  const entregaMock = {
    id: '1',
    codigo_pacote: 'PAC-001',
    destinatario_nome: 'João Silva',
    endereco: 'Rua A, 123',
    status: 'pendente',
    foto_url: null,
    criado_em: '2026-07-09T12:00:00Z',
    registrado_em: null,
  }

  it('deve renderizar o código do pacote', async () => {
    const { getByText } = await render(<CardEntrega entrega={entregaMock} onPress={() => {}} />)
    expect(getByText('PAC-001')).toBeTruthy()
  })

  it('deve renderizar o nome do destinatário', async () => {
    const { getByText } = await render(<CardEntrega entrega={entregaMock} onPress={() => {}} />)
    expect(getByText('João Silva')).toBeTruthy()
  })

  it('deve renderizar o endereço', async () => {
    const { getByText } = await render(<CardEntrega entrega={entregaMock} onPress={() => {}} />)
    expect(getByText('Rua A, 123')).toBeTruthy()
  })

  it('deve exibir "Pendente" para status pendente', async () => {
    const { getByText } = await render(<CardEntrega entrega={entregaMock} onPress={() => {}} />)
    expect(getByText('Pendente')).toBeTruthy()
  })

  it('deve exibir "Entregue" para status entregue', async () => {
    const entregue = { ...entregaMock, status: 'entregue' }
    const { getByText } = await render(<CardEntrega entrega={entregue} onPress={() => {}} />)
    expect(getByText('Entregue')).toBeTruthy()
  })

  it('deve exibir "Falha" para status falha', async () => {
    const falha = { ...entregaMock, status: 'falha' }
    const { getByText } = await render(<CardEntrega entrega={falha} onPress={() => {}} />)
    expect(getByText('Falha')).toBeTruthy()
  })

  it('deve exibir a data formatada quando registrado_em existe', async () => {
    const dataISO = '2026-07-09T14:30:00Z'
    const comData = {
      ...entregaMock,
      status: 'entregue',
      registrado_em: dataISO,
    }
    const { getByText } = await render(<CardEntrega entrega={comData} onPress={() => {}} />)
    expect(getByText(formatarDataEsperada(dataISO))).toBeTruthy()
  })

  it('deve chamar onPress com a entrega ao clicar', async () => {
    const onPressMock = jest.fn()
    const { getByText } = await render(
      <CardEntrega entrega={entregaMock} onPress={onPressMock} />
    )
    const codigoText = getByText('PAC-001')
    fireEvent.press(codigoText.parent.parent)
    expect(onPressMock).toHaveBeenCalledWith(entregaMock)
  })
})
