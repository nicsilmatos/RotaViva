# Briefing Geral CajuHub

**CajuHub · Formação Dev Junior · Módulo Mobile**

## Projeto Final — Módulo Mobile

**React Native + Expo · App completo com backend e banco de dados**

## O que muda agora

Até aqui vocês usaram APIs do Expo para tocar em recursos nativos do celular — sensor, câmera, GPS, notificação.

Agora o trabalho é construir um sistema completo:

- Frontend em React Native + Expo rodando no celular
- Backend conectado (a stack é decisão do grupo)
- Banco de dados persistindo os dados de verdade
- Pelo menos um recurso nativo do celular usado com propósito real no produto

## A regra que define o módulo

O app não pode funcionar só no aparelho com dados na memória. Tem que ter dados que sobrevivem, vêm de um servidor e funcionam em mais de um dispositivo.

## Equipes por plataforma

- Equipes Android — app validado e demonstrado em Android
- Equipes iOS — app validado e demonstrado em iOS

## Decisão de backend

O backend é livre. Cada grupo decide a stack: Supabase, Node próprio ou outra abordagem que saiba defender.

### O backend precisa entregar

- Persistência real dos dados
- Comunicação com o app via rede
- Autenticação, se o domínio exigir

## Como o trabalho é organizado

### Mob de arquitetura (obrigatório)

Registrar:

- Qual backend e por quê
- Quais entidades existem e como se relacionam
- Quais telas existem e quem faz cada uma
- Qual recurso nativo será usado e com qual propósito

### Git desde o início

Fluxo:

1. Branch por funcionalidade
2. Pull Request
3. Revisão antes do merge

Commits devem ser frequentes e descritivos.

### Divisão de responsabilidade

Cada membro é dono de uma parte do sistema e precisa saber explicá-la na defesa.

## Escopo mínimo obrigatório

1. App React Native + Expo
2. Backend conectado com banco de dados persistente
3. CRUD completo da entidade principal
4. Pelo menos um recurso nativo usado com propósito real
5. Navegação entre telas (lista → detalhe)
6. Tratamento de carregamento e erro
7. Documento do mob de arquitetura
8. Histórico de Git consistente

## Avaliação

| Peso | Componente |
|------|------------|
| 30% | Produto funcionando |
| 50% | Defesa individual |
| 20% | Processo (Git, PRs e documento) |

## Sobre a defesa

Exemplos de perguntas:

- Por que escolheram esse backend?
- O que acontece se o servidor estiver fora do ar?
- Onde os dados são validados?
- Como o app mantém autenticação?
- O que acontece se dois usuários editarem o mesmo dado?
- Por que esse recurso nativo?

Um app que funciona mas que o grupo não sabe explicar vale menos que um app incompleto defendido com clareza.

## Sobre uso de IA

Usar IA para acelerar é permitido.

O que não é permitido é entregar código que você não entende.

A defesa individual é o filtro: se você não consegue explicar por que uma linha está ali, o que ela faz e o que aconteceria se fosse diferente, o código não conta como seu.
