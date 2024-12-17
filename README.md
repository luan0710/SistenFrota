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
- ⏳ Configurar Docker e docker-compose
  - ✅ Arquivos de configuração criados
  - 🔲 Testar e validar em produção
- ✅ Configurar ESLint e Prettier
- ✅ Configurar banco de dados e migrations
  - ✅ Configurar Sequelize
  - ✅ Criar migrations para usuários
  - ✅ Criar migrations para veículos
  - ✅ Criar migrations para manutenções
- ✅ Configurar estrutura de microserviços
- ⏳ Criar documentação inicial (README)
  - ✅ Estrutura básica
  - 🔲 Documentação técnica detalhada
- ⏳ Implementar autenticação e autorização
  - ✅ Configurar JWT e bcrypt
  - ✅ Implementar registro de usuários
  - ✅ Implementar login
  - ✅ Implementar recuperação de senha básica
  - ⏳ Implementar recuperação de senha com email
  - ✅ Implementar autorização baseada em papéis (RBAC)
- 🔲 Configurar CI/CD pipeline

#### Backend (API)
- ⏳ Implementar endpoints da API
  - ✅ Autenticação de Usuários
  - ✅ Gestão de Veículos (CRUD básico)
  - ✅ Manutenções (CRUD básico)
  - 🔲 Abastecimentos
- 🔲 Implementar validações avançadas
  - 🔲 Validação de dados com Joi
  - ⏳ Middleware de tratamento de erros
  - 🔲 Rate limiting
- 🔲 Configurar logs e monitoramento
- 🔲 Documentar API (Swagger/OpenAPI)

#### Frontend (React)
- 🔲 Todo o desenvolvimento frontend ainda não foi iniciado

#### Mobile (React Native)
- 🔲 Todo o desenvolvimento mobile ainda não foi iniciado

#### Qualidade e Segurança
- 🔲 Implementar testes automatizados
- 🔲 Realizar análise de segurança
- 🔲 Implementar monitoramento
- 🔲 Configurar backup e recuperação

#### Documentação
- ⏳ Documentação técnica
- 🔲 Manual do usuário
- 🔲 Documentação da API
- 🔲 Guias de desenvolvimento

#### Autenticação e Segurança
- 🔲 Implementar proteções adicionais
  - 🔲 Rate limiting para tentativas de login
  - 🔲 Bloqueio temporário após 3 tentativas falhas
  - 🔲 Política de senha forte
  - 🔲 Autenticação em duas etapas (2FA)
  
- 🔲 Melhorias no processo de login
  - 🔲 Implementar remember me
  - 🔲 Gerenciamento de sessões ativas
  - 🔲 Logout em todos dispositivos
  - 🔲 Histórico de logins

- ⏳ Sistema de recuperação de senha
  - ✅ Recuperação básica
  - 🔲 Templates de email
  - 🔲 Tokens temporários
  - 🔲 Validação de links expirados

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
   - Paginação forçada em listagens grandes

### Próximas Correções Prioritárias
1. Otimização do API Gateway
2. Refatoração do sistema de uploads
3. Implementação de testes automatizados
4. Melhoria na geração de relatórios

#### Testes de Autenticação
- [ ] Login
  - [ ] Validar credenciais corretas
  - [ ] Testar credenciais inválidas
  - [ ] Verificar bloqueio após tentativas falhas
  - [ ] Testar expiração de token
  - [ ] Validar refresh token
  
- [ ] Recuperação de Senha
  - [ ] Envio de email
  - [ ] Validação de token
  - [ ] Expiração de link
  - [ ] Alteração efetiva da senha

#### Autenticação
- [ ] Tokens JWT não invalidados após logout
- [ ] Ausência de proteção contra força bruta
- [ ] Falta de auditoria detalhada de tentativas de login
- [ ] Recuperação de senha via email não implementada
