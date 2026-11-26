# Procedimento de Configuração do Fluxo (`/configurar-fluxo`)

Guia prático e definitivo para parametrização, alinhamento técnico e inicialização do ciclo de vida de desenvolvimento no repositório, gerando ou atualizando `.fluxo/config-modelo.md`.

---

## 1. Ponto de Partida
Antes de iniciar a execução técnica ou a definição de tarefas, estabeleça o baseline do projeto:
- **Alinhamento de Visão:** Validação do rastreador, vocabulário e escopo de governança.
- **Mapeamento de Dependências:** Identificação de MCPs ativos, banco de dados e integrações externas.
- **Baseline do Repositório:** Verificação da branch principal, padronização de commits e comandos locais.

---

## 2. Sem Segredos (Diretrizes de Segurança de Dados)
- **Zero Hardcoding:** É estritamente proibido inserir chaves de API, senhas, tokens JWT/PATs ou strings de conexão reais em `.fluxo/config-modelo.md` ou no código-fonte.
- **Gestão de Variáveis de Ambiente:** Utilize variáveis de ambiente (`${VAR}`) ou credenciais locais em `~/.fluxo-desenvolvimento/` e garanta que arquivos `.env` locais estejam no `.gitignore`.

---

## 3. Regra Crítica de Execução (Pausa Obrigatória por Bloco)
- **NUNCA** exiba todos os blocos (A a I) de uma única vez no chat.
- Execute **UM bloco por vez** utilizando obrigatoriamente a ferramenta interativa nativa da IDE atual:
  - **Claude Code:** `AskUserQuestion`
  - **Cursor:** `AskQuestion`
  - **GitHub Copilot:** `askQuestions` (ou pergunta objetiva com opções numeradas aguardando resposta no turno antes de avançar)
- **PARE e aguarde** o retorno do usuário antes de avançar para o bloco seguinte.
- **Execução Parcial / Atualização Posterior:** Se o usuário invocar `/configurar-fluxo` apenas para conectar um MCP depois, redescobrir o board ou configurar o banco de dados posteriormente, execute somente os blocos correspondentes e preserve as demais configurações já salvas.

---

## 4. Matriz de Perguntas em Blocos (Blocos A a I — 1 interação por bloco)

### Bloco A — Rastreador de Tarefas e Vocabulário
Pergunte via ferramenta interativa:
1. Qual o provedor de tarefas (`jira`, `azure_devops`, `tfs`, `github` ou `nenhum`) e a URL/chave do projeto?
2. Como este ambiente chama o item principal e as subtarefas? (Ex: `Story` / `Sub-task` no Jira; `User Story` ou `Product Backlog Item` / `Task` no Azure Boards/TFS).

### Bloco B — Servidores MCP e Descoberta Automática do Board
Pergunte via ferramenta interativa:
1. Quais MCPs estão ativos ou deseja configurar agora? (`atlassian`, `azure-devops`, `tfs`, `github`, `aws`, `banco-dados`, `nenhum — configurar depois`).
2. Caso o usuário escolha configurar um MCP agora e ele ainda não esteja ativo no ambiente, oriente como adicionar no cliente (`mcp.json` / `.claude.json`) e pergunte se já ativou ou prefere pular e configurar depois.
3. **Introspecção Automática do Board (se o MCP do rastreador estiver ativo):**
   - Consulte imediatamente via MCP a estrutura do projeto/board: liste as **colunas reais do board**, **estados válidos**, **tipos de item** e **hierarquia de subtarefas**.
   - Mostre o mapeamento descoberto (ex: `New -> Active -> Resolved -> Closed`, criação de subtarefas `[DEV]`/`[QA]`) e confirme via modal para salvar em `rastreador.board_descoberto`.

### Bloco C — Gerenciamento de Código, Branches e Commits
Pergunte via ferramenta interativa:
1. Qual a branch principal (`main`, `master`, `develop`)?
2. Qual o padrão de nomenclatura para branches (`feature/{chave}-{descricao_curta}`) e commits (`conventional_commits`)?

### Bloco D — Comandos Locais (Build, Testes e Linter)
Pergunte via ferramenta interativa quais os comandos locais deste repositório para:
1. Build (ex: `dotnet build`, `npm run build`)
2. Testes unitários e de integração (ex: `dotnet test`, `npm test`)
3. Linter / formatação (opcional)

### Bloco E — Tolerância a Falhas, Cobertura e Quality Gate (SonarQube)
Pergunte via ferramenta interativa:
1. Qual o limite máximo de tentativas automáticas de correção de build/validação antes de escalar ao usuário? (padrão: `3`).
2. SonarQube / Quality Gate é obrigatório neste projeto? (`Sim` ou `Não`) — se `Sim`, pergunte a meta de cobertura (geral e código novo, ex: `80%` / `85%`).

### Bloco F — Contratos de API e Arquitetura
Pergunte via ferramenta interativa:
1. Há gateway de API ou OpenAPI spec que exija contrato rígido (`gateway_api.verificar_contratos`)? (`Sim` ou `Não` — se `Sim`, qual o diretório das specs?).
2. Manter revisão condicional do `Arquiteto` para mudanças estruturais (`[REVISAO_ARQUITETURA]`)? (`Sim` ou `Não`).

### Bloco G — Estratégia de Testes de Aceite e Fluxo de QA
Pergunte via ferramenta interativa:
1. Como os testes de aceite são gerenciados? (`xray`, `azure_test_plans`, `zephyr`, `nenhum`).
2. É necessária etapa de QA em ambiente de homologação (`hml`/`staging`) ou o fluxo vai direto para PR/Concluído? (`QA em homologação`, `Direto para PR/Concluído`).

### Bloco H — Infraestrutura de Banco de Dados (Opcional / Configurável Depois)
Pergunte via ferramenta interativa:
1. Deseja configurar acesso/regras de banco de dados agora ou deixar para depois? (`Configurar agora`, `Deixar para depois`).
2. Se `Configurar agora`: qual o SGBD (`sqlserver`, `postgres`, `mysql`, `oracle`, `mongodb`), se há MCP de banco ativo e qual o caminho das migrations/scripts.

### Bloco I — Perfis de Modelos de IA por Papel
Pergunte via ferramenta interativa se deseja manter os perfis padrão (`rapido`, `padrao`, `forte`) ou informar modelos customizados.

---

## 5. Aplicar Configuração
Após receber as respostas:
1. **Persistir Configurações:** Gere ou atualize `.fluxo/config-modelo.md` com os parâmetros definidos.
2. **Validar Localmente:** Confirme se `.fluxo/` está excluído do Git (caso instalação `--local`).
3. **Configuração Posterior:** Lembre o usuário de que basta rodar `/configurar-fluxo` novamente quando quiser habilitar MCPs, descobrir o board ou configurar banco de dados depois.
