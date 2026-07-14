#  RotaViva

O **RotaViva** é um aplicativo mobile desenvolvido em **React Native com Expo** para auxiliar no gerenciamento e registro de entregas.

O aplicativo permite cadastrar entregadores, gerenciar entregas, registrar comprovantes por meio de fotografia, capturar a localização GPS do entregador e armazenar essas informações utilizando o **Supabase**.

---

##  Funcionalidades

- Login de usuários
- Cadastro de entregadores
- Listagem de entregadores
- Cadastro de entregas
- Listagem de entregas
- Visualização dos detalhes de uma entrega
- Registro de comprovante de entrega
- Captura de foto utilizando a câmera do dispositivo
- Captura da localização GPS
- Upload da imagem para o Supabase Storage
- Armazenamento dos dados da entrega no banco de dados
- Testes automatizados com Jest

---

##  Tecnologias Utilizadas

### Front-end

- React Native
- Expo SDK 54
- React Navigation
- Expo Camera
- Expo Location
- Expo File System

### Back-end

- Supabase
- Supabase Storage

### Testes

- Jest
- Testing Library

---

##  Estrutura do Projeto

```
src
│
├── backend
│   ├── comprovantes.js
│   ├── entregadores.js
│   ├── entregas.js
│   └── supabase.js
│
├── frontend
│   ├── assets
│   ├── components
│   ├── navigation
│   ├── screens
│   └── services
│
└── __tests__
```

---

##  Dependências Principais

- React Native
- Expo
- React Navigation
- Supabase
- Expo Camera
- Expo Location
- Expo File System
- Expo Secure Store

---

##  Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Entre na pasta:

```bash
cd RotaViva
```

Instale as dependências:

```bash
npm install
```

ou

```bash
yarn
```

---

##  Executando o Projeto

Inicie o Expo:

```bash
npm start
```

Executar no Android:

```bash
npm run android
```

Executar no iOS:

```bash
npm run ios
```

Executar na Web:

```bash
npm run web
```

---

##  Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto contendo:

```env
EXPO_PUBLIC_SUPABASE_URL=Sua_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=Sua_Chave
```

---

##  Fluxo de Registro de Entrega

1. O usuário acessa a tela de registro.
2. O aplicativo solicita permissão para uso da câmera.
3. É capturada uma foto do comprovante.
4. A localização GPS é obtida automaticamente.
5. A imagem é enviada ao Supabase Storage.
6. A URL pública da imagem é gerada.
7. Os dados da entrega são salvos no banco de dados.

---

## 🧪 Testes

Para executar os testes:

```bash
npm test
```

Os testes contemplam:

- Backend
- Componentes
- Telas
- Serviços

---

## Arquitetura

O projeto segue uma separação em camadas:

- **Frontend:** Interface do usuário
- **Services:** Regras de comunicação e serviços
- **Backend:** Comunicação com o Supabase
- **Navigation:** Controle das rotas
- **Components:** Componentes reutilizáveis
- **Tests:** Testes automatizados

---

##  Melhorias Futuras

- Autenticação completa com Supabase Auth
- Histórico de entregas
- Upload offline
- Sincronização automática
- Notificações Push
- Dashboard de entregadores
- Assinatura digital do cliente
- Mapa das entregas em tempo real

---

##  Desenvolvido com

- React Native
- Expo
- Supabase
- JavaScript

---

##  Licença

Este projeto foi desenvolvido para fins acadêmicos e de aprendizagem.
