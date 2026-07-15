#  RotaViva

O **RotaViva** é um aplicativo mobile desenvolvido em **React Native com Expo** para auxiliar no gerenciamento e registro de entregas.

O aplicativo permite cadastrar entregadores, gerenciar entregas, registrar comprovantes por meio de fotografia, capturar a localização GPS do entregador e armazenar essas informações utilizando o **Supabase**.

---

##  Funcionalidades

-  Gerenciamento de rotas
-  Atualização do status das entregas
-  Rastreamento GPS em tempo real
-  Registro de comprovante de entrega
-  Upload automático para o Supabase Storage
-  Histórico de entregas
- Persistência de dados offline

---

##  Stack Tecnológica

| Camada | Tecnologia |
|---------|------------|
| Mobile | React Native + Expo SDK 54 |
| Linguagem | JavaScript / TypeScript |
| Backend | Supabase |
| Banco | PostgreSQL |
| Storage | Supabase Storage |
| Câmera | Expo Camera |
| Localização | Expo Location |
| Arquivos | Expo File System |
| Testes | Jest |
| Build | Expo Application Services (EAS) |

---

#  Estrutura do Projeto

```text
RotaViva
├── src
│   ├── backend
│   │   ├── supabase.ts
│   │   ├── entregas.ts
│   │   ├── entregadores.ts
│   │   └── comprovantes.ts
│   │
│   └── frontend
│       ├── assets
│       ├── components
│       ├── navigation
│       ├── screens
│       └── services
│
├── App.js
├── package.json
├── app.json
├── eas.json
└── README.md
```

---

#  Banco de Dados

## Tabela `entregas`

- id
- entregador_id
- codigo_pacote
- destinatario_nome
- endereco
- status
- foto_url
- latitude
- longitude
- criado_em
- atualizado_em
- registrado_em

## Tabela `entregadores`

Responsável pelo cadastro dos entregadores vinculados às entregas.

## Bucket `comprovantes`

Armazena as imagens dos comprovantes utilizando o **Supabase Storage** com políticas de segurança (RLS).

---

#  Como executar

## Pré-requisitos

- Node.js 22+
- Git
- Expo Go

Clone o projeto:

```bash
git clone https://github.com/nicsilmatos/RotaViva.git
```

Entre na pasta:

```bash
cd RotaViva
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave
```

Execute:

```bash
npx expo start --clear
```

Depois basta escanear o QR Code pelo Expo Go.

---

#  Fluxo do Registro de Entrega

```text
Registrar entrega
        │
        ▼
Captura da foto
        │
        ▼
Captura do GPS
        │
        ▼
Upload para o Storage
        │
        ▼
URL pública da imagem
        │
        ▼
Gravação no banco
```

A lógica foi separada em serviços independentes:

- `locationService`
- `storageService`
- `entregaService`

A tela apenas coordena o fluxo, facilitando manutenção e testes.

---

#  Segurança

O projeto utiliza **Row Level Security (RLS)** no Supabase para proteger os dados.

Atualmente existe uma política temporária permitindo uploads anônimos durante o desenvolvimento, que será substituída após a implementação da autenticação.

---

#  Testes

```bash
npm test
```

---

#  Equipe

| Integrante | GitHub |
|------------|--------|
| Nicole Matos | https://github.com/nicsilmatos |
| Don Laranjo | https://github.com/laranjodupy |
| Sabryna | https://github.com/sabrynavn |
| Leonardo Maia | https://github.com/leonardomaiaa |

---

#  Status

Projeto em desenvolvimento como parte de um trabalho acadêmico voltado à manutenção e evolução de aplicações mobile.

---

# Licença

Este projeto foi desenvolvido para fins acadêmicos.
