# Projeto A1 — RotaViva Logística

**CajuHub · Formação Dev Junior · Módulo Mobile**

## Projeto A1 · Equipe Android

### RotaViva Logística
App de campo para entregadores registrarem entregas com comprovante e localização.

## Contexto

A RotaViva é uma transportadora regional que faz entregas de última milha — leva encomendas do centro de distribuição até a porta do cliente. Hoje os entregadores anotam as entregas no papel e tiram foto no WhatsApp pessoal, o que se perde e não tem controle nenhum.

A empresa quer um app que o entregador usa na rua, no próprio celular, para registrar cada entrega: o que foi entregue, onde, com foto de comprovante e a localização do momento. O supervisor precisa ver as entregas do dia.

## Recurso nativo do projeto

### O recurso que dá sentido ao app

**Câmera** (foto do comprovante de entrega) e **GPS** (localização no momento da entrega). Ambos são o coração do produto — sem eles não existe comprovação.

## Entidades de negócio

Modele estas entidades. Os campos são o mínimo — vocês podem acrescentar o que o projeto pedir.

| Entidade | Dados |
|-----------|--------|
| Entrega | Código do pacote, nome do destinatário, endereço, status (pendente / entregue / falha), data e hora, foto do comprovante, latitude e longitude do momento do registro |
| Entregador | Nome e identificação. Cada entrega pertence a um entregador |

## Telas mínimas

- Lista de entregas pendentes do entregador
- Tela para registrar uma entrega: tirar foto, capturar GPS, marcar status
- Histórico de entregas concluídas com foto e local
- Detalhe de uma entrega mostrando todos os dados, incluindo a foto e a coordenada

## Funcionalidades obrigatórias

1. Registrar entrega com foto da câmera + captura de GPS
2. Listar entregas pendentes e concluídas (separadas)
3. Atualizar o status de uma entrega
4. Persistir tudo no backend — ao reabrir o app, os dados continuam lá
5. Visualizar o detalhe de uma entrega registrada

## Desafios extras

- Ordenar a lista de entregas pendentes por proximidade da localização atual do entregador
- Indicador visual de quantas entregas faltam no dia
- Funcionar offline: registrar a entrega sem rede e sincronizar quando voltar a conexão (avançado)

## Perguntas que a defesa pode fazer

- Onde a foto fica armazenada — no banco, num storage de arquivos, ou no aparelho? Por quê?
- O que acontece se o entregador registrar uma entrega sem sinal de internet?
- Como vocês garantem que a coordenada de GPS é a do momento da entrega, e não uma antiga?
- Por que a foto do comprovante é obrigatória neste produto?

## Lembrete

O escopo mínimo é mínimo — não é arredondado para cima. A nota maior vem da defesa: saber explicar cada decisão do que vocês construíram.
