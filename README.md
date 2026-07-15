# RotaViva 

Aplicativo Android para logística de última milha (*last-mile logistics*), desenvolvido em **React Native + Expo**, com backend em **Supabase**.

O RotaViva permite que entregadores gerenciem rotas, atualizem o status de entregas, e registrem comprovantes de entrega com **foto + localização GPS em tempo real**, mesmo em cenários com conectividade instável.

---

##  Funcionalidades

- **Gerenciamento de rotas** de entrega
- **Atualização de status** das entregas
- **Persistência de dados offline**
- **Histórico detalhado** de entregas realizadas
- **Rastreamento GPS em tempo real**
- **Comprovante de entrega (Proof of Delivery)**: captura de foto via câmera nativa, com localização GPS vinculada ao instante exato da captura

---

##  Stack técnica

| Camada | Tecnologia |
|---|---|
| App mobile | React Native `0.81.5` + Expo SDK `54` |
| Linguagem | JavaScript / TypeScript |
| Backend / Banco de dados | Supabase (PostgreSQL) |
| Armazenamento de arquivos | Supabase Storage |
| Câmera | `expo-camera` |
| Geolocalização | `expo-location` |
| Sistema de arquivos | `expo-file-system` (API legacy) |
| Área segura de tela | `react-native-safe-area-context` |
| Testes | Jest |
| Build / Distribuição | EAS (Expo Application Services) |

---

##  Estrutura do projeto

```
RotaViva/
├── src/
│   ├── backend/
│   │   ├── supabase.ts        # Client do Supabase (URL + chave anon)
│   │   ├── entregas.ts        # Lógica/tipos relacionados a entregas
│   │   └── entregadores.ts    # Lógica/tipos relacionados a entregadores
│   │
│   └── frontend/
│       ├── assets/            # Ícones, splash screen, imagens
│       ├── screens/           # Telas do aplicativo
│       │   └── RegistrarEntregaScreen.js
│       └── services/          # Lógica de negócio, separada da UI
│           ├── locationService.js   # Captura de GPS com timeout de segurança
│           ├── storageService.js    # Upload de fotos ao Supabase Storage
│           └── entregaService.js    # Gravação dos dados da entrega no banco
│
├── App.js
├── app.json                   # Configuração do Expo
├── eas.json                   # Configuração de build (EAS)
├── jest.config.js / jest.setup.js
├── package.json
└── tsconfig.json
```

---

## Modelo de dados (Supabase / PostgreSQL)

### Tabela `entregas`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` | Identificador único (gerado automaticamente) |
| `entregador_id` | `uuid` | Chave estrangeira → `entregadores.id` |
| `codigo_pacote` | `text` | Código de identificação do pacote |
| `destinatario_nome` | `text` | Nome de quem recebe a entrega |
| `endereco` | `text` | Endereço de entrega |
| `status` | `text` | Status atual (ex: `Pendente`, `Entregue`) |
| `foto_url` | `text` | URL pública do comprovante fotográfico |
| `latitude` | `float8` | Latitude capturada no momento da entrega |
| `longitude` | `float8` | Longitude capturada no momento da entrega |
| `criado_em` / `atualizado_em` / `registrado_em` | `timestamptz` | Timestamps automáticos |

### Tabela `entregadores`
Armazena os dados dos entregadores vinculados às entregas.

### Storage — bucket `comprovantes`
Bucket público onde as fotos de comprovante de entrega são armazenadas, protegido por políticas de **Row Level Security (RLS)**.

---

##  Como rodar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (recomendado: v22.x LTS)
- [Git](https://git-scm.com/)
- App **Expo Go** instalado no celular (Android/iOS)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/nicsilmatos/RotaViva.git
cd RotaViva

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto:
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

```bash
# 4. Inicie o servidor de desenvolvimento
npx expo start --clear
```

Escaneie o QR code exibido no terminal com o app **Expo Go** para abrir o projeto no seu celular.

>  **Observação:** cada máquina/clone precisa rodar `npm install` individualmente, já que a pasta `node_modules` não é versionada no Git.

---

## Segurança e RLS (Row Level Security)

O bucket `comprovantes` e a tabela `entregas` utilizam políticas de RLS do Supabase para controlar quem pode inserir, ler ou atualizar dados. Como a autenticação de entregador ainda está em desenvolvimento, existe uma política temporária permitindo upload anônimo — que deve ser substituída pela política definitiva assim que o login de entregador estiver implementado.

---

##  Arquitetura da funcionalidade "Câmera + GPS"

Fluxo do registro de entrega:

```
Usuário toca em "Registrar entrega"
        ↓
Abre a câmera nativa (expo-camera)
        ↓
Foto é capturada
        ↓
Localização GPS é capturada logo em seguida (expo-location)
        ↓
Foto é enviada ao Supabase Storage
        ↓
URL pública + latitude + longitude + status
são salvos na tabela `entregas`
```

A lógica é dividida em **services** independentes (`locationService`, `storageService`, `entregaService`), enquanto a tela (`RegistrarEntregaScreen`) atua apenas como orquestradora do fluxo e da interface — separando responsabilidades e facilitando manutenção e testes.

---

##  Equipe

| Nome | GitHub |
|---|---|
| Nicole Matos | [@nicsilmatos](https://github.com/nicsilmatos) |
| Don Laranjo | [@laranjodupy](https://github.com/laranjodupy) |
| Sabryna | [@sabrynavn](https://github.com/sabrynavn) |
| Leonardo Maia | [@leonardomaiaa](https://github.com/leonardomaiaa) |

---

##  Status do projeto

Projeto em desenvolvimento ativo, no contexto de um trabalho acadêmico/profissional de manutenção e evolução de aplicações mobile.
