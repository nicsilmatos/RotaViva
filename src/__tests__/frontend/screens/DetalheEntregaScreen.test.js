import React from 'react'
import { render } from '@testing-library/react-native'
import DetalheEntregaScreen from '../../../frontend/screens/DetalheEntregaScreen'

function formatarDataEsperada(dataISO) {
  const data = new Date(dataISO)
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  const hora = String(data.getHours()).padStart(2, '0')
  const minuto = String(data.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`
}

describe('DetalheEntregaScreen', () => {
  const entregaMock = {
    id: '1',
    codigo_pacote: 'PAC-001',
    destinatario_nome: 'João Silva',
    endereco: 'Rua A, 123',
    latitude: '-23.550520',
    longitude: '-46.633308',
    status: 'pendente',
    foto_url: null,
    criado_em: '2026-07-09T12:00:00Z',
    registrado_em: null,
  }

  function renderizar(entrega) {
    const route = { params: { entrega: entrega || entregaMock } }
    return render(<DetalheEntregaScreen route={route} />)
  }

  it('deve exibir o código do pacote', async () => {
    const { getByText } = await renderizar()
    expect(getByText('PAC-001')).toBeTruthy()
  })

  it('deve exibir o status pendente', async () => {
    const { getByText } = await renderizar()
    expect(getByText('Pendente')).toBeTruthy()
  })

  it('deve exibir o status entregue', async () => {
    const { getByText } = await renderizar({ ...entregaMock, status: 'entregue' })
    expect(getByText('Entregue')).toBeTruthy()
  })

  it('deve exibir o status falha', async () => {
    const { getByText } = await renderizar({ ...entregaMock, status: 'falha' })
    expect(getByText('Falha')).toBeTruthy()
  })

  it('deve exibir o nome do destinatário', async () => {
    const { getByText } = await renderizar()
    expect(getByText('João Silva')).toBeTruthy()
  })

  it('deve exibir o endereço', async () => {
    const { getByText } = await renderizar()
    expect(getByText('Rua A, 123')).toBeTruthy()
  })

  it('deve exibir a latitude', async () => {
    const { getByText } = await renderizar()
    expect(getByText('-23.550520')).toBeTruthy()
  })

  it('deve exibir a longitude', async () => {
    const { getByText } = await renderizar()
    expect(getByText('-46.633308')).toBeTruthy()
  })

  it('deve exibir "Sem foto de comprovante" quando não há foto', async () => {
    const { getByText } = await renderizar()
    expect(getByText('Sem foto de comprovante')).toBeTruthy()
  })

  it('deve exibir a data de criação formatada', async () => {
    const { getByText } = await renderizar()
    expect(getByText(formatarDataEsperada(entregaMock.criado_em))).toBeTruthy()
  })

  it('deve exibir "—" para registrado_em quando for null', async () => {
    const { getByText } = await renderizar()
    expect(getByText('—')).toBeTruthy()
  })

  it('deve exibir a data de registro quando disponível', async () => {
    const dataISO = '2026-07-09T14:30:00Z'
    const { getByText } = await renderizar({
      ...entregaMock,
      status: 'entregue',
      registrado_em: dataISO,
    })
    expect(getByText(formatarDataEsperada(dataISO))).toBeTruthy()
  })
})
