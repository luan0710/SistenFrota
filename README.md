# Sistema de Gestão de Frota de Veículos

Sistema completo para gerenciamento de frotas de veículos com arquitetura moderna e escalável.

## Módulos Principais

1. Cadastros Básicos
2. Gestão de Manutenção
3. Controle de Abastecimento
4. Gestão de Custos
5. Controle de Viagens e Rotas
6. Gestão de Documentação
7. Dashboards e Relatórios
8. Recursos Técnicos
9. Funcionalidades Adicionais
10. Segurança e Conformidade

## Stack Tecnológico

- **Backend:** Node.js + Express
- **Frontend:** React.js + TailwindCSS
- **Mobile:** React Native
- **Banco de Dados:** MySQL2
- **Infraestrutura:** Docker, Microserviços
- **CI/CD:** Pipeline automatizado
- **Testes:** Jest, React Testing Library

## Pré-requisitos

- Node.js >= 18.x
- Docker >= 20.x
- MySQL >= 8.x
- npm >= 9.x

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd SistenFrota
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie os containers Docker:
```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:
```bash
npm run migrate
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
SistenFrota/
├── services/                # Microserviços
│   ├── auth/               # Serviço de autenticação
│   ├── vehicles/           # Serviço de veículos
│   ├── maintenance/        # Serviço de manutenção
│   └── ...
├── frontend/               # Aplicação React
├── mobile/                 # Aplicação React Native
├── docs/                   # Documentação
├── scripts/               # Scripts úteis
└── docker/                # Configurações Docker
```

## Workflow de Desenvolvimento

### Status das Tarefas

- 🔲 Não iniciado
- ⏳ Em andamento
- ✅ Concluído

### Tarefas do Projeto

#### Configuração Inicial
- ✅ Criar estrutura básica do projeto
- ✅ Configurar ambiente de desenvolvimento
- ✅ Configurar Docker e docker-compose
- ✅ Configurar ESLint e Prettier
- ✅ Configurar banco de dados e migrations
  - ✅ Configurar Sequelize
  - ✅ Criar migrations para usuários
  - ✅ Criar migrations para veículos
  - ✅ Criar migrations para manutenções
- ✅ Configurar estrutura de microserviços
- ✅ Criar documentação inicial (README)
- ✅ Implementar autenticação e autorização
  - ✅ Configurar JWT e bcrypt
  - ✅ Implementar registro de usuários
  - ✅ Implementar login
  - ✅ Implementar recuperação de senha
  - ✅ Implementar validações
  - ✅ Implementar autorização baseada em papéis (RBAC)
- 🔲 Configurar CI/CD pipeline

#### Backend (API)
- ⏳ Implementar endpoints da API
  - ✅ Autenticação de Usuários
  - ✅ Gestão de Veículos
    - ✅ Listagem com filtros
    - ✅ Formulário de cadastro/edição
    - ✅ Exclusão com confirmação
    - ✅ Status e indicadores visuais
    - ✅ Número identificador do veículo
    - ✅ Categorização por tipo de veículo
    - ✅ Busca por múltiplos campos
    - ✅ Validações de formulário
  - ✅ Manutenções
    - ✅ CRUD completo
    - ✅ Agendamento
    - ✅ Histórico
    - ✅ Custos
  - 🔲 Abastecimentos
    - 🔲 CRUD completo
    - 🔲 Controle de custos
    - 🔲 Histórico
- 🔲 Implementar validações e middlewares
  - 🔲 Validação de dados com Joi
  - 🔲 Middleware de tratamento de erros
  - 🔲 Middleware de autenticação
  - 🔲 Middleware de autorização
  - 🔲 Rate limiting
- 🔲 Configurar logs e monitoramento
- 🔲 Documentar API (Swagger/OpenAPI)

#### Frontend (React)
- 🔲 Configurar projeto React com TailwindCSS
- 🔲 Implementar layout responsivo
- 🔲 Desenvolver componentes base
  - 🔲 Layout base
  - 🔲 Navbar
  - 🔲 Sidebar
  - 🔲 Cards
  - 🔲 Botões
  - 🔲 Formulários
- 🔲 Implementar páginas
  - 🔲 Login e Registro
    - 🔲 Validação de campos
    - 🔲 Feedback visual de erros
    - 🔲 Mensagens de sucesso
    - 🔲 Link de recuperação de senha
  - 🔲 Recuperação de Senha
    - 🔲 Formulário de recuperação
    - 🔲 Validação de email
    - 🔲 Feedback visual
    - 🔲 Redirecionamento
  - 🔲 Dashboard
    - 🔲 Cards de estatísticas
    - 🔲 Atividades recentes
    - 🔲 Filtros de período
    - 🔲 Indicadores de tendência
  - 🔲 Gestão de Usuários
    - 🔲 Listagem com filtros
    - 🔲 Formulário de cadastro/edição
    - 🔲 Exclusão com confirmação
    - 🔲 Status e indicadores visuais
  - 🔲 Gestão de Veículos
    - 🔲 Listagem com filtros
    - 🔲 Formulário de cadastro/edição
    - 🔲 Exclusão com confirmação
    - 🔲 Status e indicadores visuais
    - 🔲 Número identificador do veículo
    - 🔲 Categorização por tipo de veículo
    - 🔲 Busca por múltiplos campos
    - 🔲 Validações de formulário
  - 🔲 Manutenções
    - 🔲 CRUD completo
    - 🔲 Agendamento
    - 🔲 Histórico
  - 🔲 Abastecimentos
    - 🔲 CRUD completo
    - 🔲 Controle de custos
  - 🔲 Viagens
    - 🔲 CRUD completo
    - 🔲 Agendamento
  - 🔲 Documentos
    - 🔲 CRUD completo
    - 🔲 Upload/Download
  - 🔲 Relatórios
    - 🔲 Geração de relatórios
    - 🔲 Filtros
    - 🔲 Download em PDF
- 🔲 Integrar com API
- 🔲 Implementar testes

#### Mobile (React Native)
- 🔲 Configurar projeto React Native
- 🔲 Desenvolver UI/UX mobile
- 🔲 Implementar funcionalidades principais
- 🔲 Integrar com API
- 🔲 Testes e publicação

#### Qualidade e Segurança
- 🔲 Implementar testes automatizados
  - 🔲 Testes unitários
  - 🔲 Testes de integração
  - 🔲 Testes E2E
- 🔲 Realizar análise de segurança
- 🔲 Implementar monitoramento
- 🔲 Configurar backup e recuperação

#### Documentação
- 🔲 Documentação técnica
- 🔲 Manual do usuário
- 🔲 Documentação da API
- 🔲 Guias de desenvolvimento

### Como Contribuir

1. Escolha uma tarefa não iniciada (🔲)
2. Mova para em andamento (⏳)
3. Crie uma branch: `feature/nome-da-tarefa`
4. Desenvolva a funcionalidade
5. Faça commit das alterações
6. Crie um Pull Request
7. Após aprovação e merge, marque como concluída (✅)

### Convenções de Commits

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação de código
- `refactor`: Refatoração de código
- `test`: Adição/modificação de testes
- `chore`: Alterações em arquivos de build/config

## Documentação

A documentação completa está disponível em `/docs` e inclui:
- Arquitetura do Sistema
- API Reference
- Guias de Desenvolvimento
- Padrões e Boas Práticas

## Segurança

- Autenticação JWT
- HTTPS/TLS
- Sanitização de Dados
- Logs de Auditoria
- Controle de Acesso (RBAC)

## Monitoramento

- Logs centralizados
- Métricas de performance
- Alertas automáticos
- Dashboard de status

## Licença

Este projeto está sob a licença [MIT](LICENSE).

## Roteiro de Testes

### 1. Ambiente e Configuração
- [ ] Variáveis de Ambiente
  - [ ] Verificar .env com todas variáveis necessárias
  - [ ] Validar conexões de banco de dados
  - [ ] Verificar chaves JWT
  - [ ] Conferir URLs de API e serviços

- [ ] Docker
  - [ ] Containers iniciam corretamente
  - [ ] Volumes persistem dados
  - [ ] Rede entre containers funcional
  - [ ] Logs disponíveis e corretos

- [ ] Banco de Dados
  - [ ] Migrations executam sem erro
  - [ ] Seeders populam dados iniciais
  - [ ] Backup/Restore funcional
  - [ ] Índices otimizados

### 2. Backend
- [ ] Autenticação
  - [ ] Login funcional
  - [ ] Registro de usuários
  - [ ] Recuperação de senha
  - [ ] Tokens JWT válidos
  - [ ] Refresh token implementado

- [ ] API Endpoints
  - [ ] Usuários
    - [ ] CRUD completo
    - [ ] Validações
    - [ ] Permissões
  - [ ] Veículos
    - [ ] CRUD completo
    - [ ] Filtros funcionando
    - [ ] Upload de imagens
  - [ ] Manutenções
    - [ ] Agendamento
    - [ ] Histórico
    - [ ] Alertas
  - [ ] Abastecimentos
    - [ ] Registro
    - [ ] Cálculos corretos
    - [ ] Relatórios
  - [ ] Documentos
    - [ ] Upload/Download
    - [ ] Versionamento
    - [ ] Validações

- [ ] Segurança
  - [ ] Sanitização de inputs
  - [ ] Proteção contra XSS
  - [ ] Rate limiting
  - [ ] Logs de auditoria

### 3. Frontend
- [ ] Autenticação
  - [ ] Login/Logout
  - [ ] Persistência de sessão
  - [ ] Recuperação de senha
  - [ ] Validações de formulário

- [ ] Interface
  - [ ] Responsividade
    - [ ] Mobile (320px)
    - [ ] Tablet (768px)
    - [ ] Desktop (1024px+)
  - [ ] Temas claro/escuro
  - [ ] Acessibilidade
  - [ ] Loading states

- [ ] Funcionalidades
  - [ ] Dashboard
    - [ ] Gráficos corretos
    - [ ] Filtros funcionando
    - [ ] Dados atualizados
  - [ ] Gestão de Veículos
    - [ ] Listagem com filtros
    - [ ] Formulários
    - [ ] Validações
    - [ ] Upload de imagens
  - [ ] Manutenções
    - [ ] Calendário
    - [ ] Notificações
    - [ ] Histórico
  - [ ] Relatórios
    - [ ] Geração PDF
    - [ ] Filtros
    - [ ] Exportação

## Problemas Conhecidos

### Críticos
- [ ] API Gateway apresenta instabilidade sob alta carga
- [ ] Timeout em uploads grandes de documentos
- [ ] Inconsistência no cálculo de consumo de combustível

### Importantes
- [ ] Cache do frontend não limpa adequadamente após logout
- [ ] Filtros avançados não persistem após navegação
- [ ] Relatórios demoram muito para gerar em períodos longos

### Pendências
- [ ] Implementar testes E2E
- [ ] Melhorar cobertura de testes unitários
- [ ] Documentar API completamente
- [ ] Otimizar queries do dashboard

### Workarounds Temporários
1. **API Gateway**
   - Implementado retry automático
   - Aumentado timeout para 30s

2. **Upload de Documentos**
   - Limitado tamanho máximo para 10MB
   - Compressão automática de imagens

3. **Performance**
   - Cache implementado para relatórios comuns
   - Pagina��ão forçada em listagens grandes

### Próximas Correções Prioritárias
1. Otimização do API Gateway
2. Refatoração do sistema de uploads
3. Implementação de testes automatizados
4. Melhoria na geração de relatórios
