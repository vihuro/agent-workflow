# Configuração do Fluxo de Desenvolvimento (`.fluxo/config-modelo.md`)

> Este arquivo armazena os parâmetros específicos deste repositório. **Nunca grave senhas, tokens ou PATs aqui** (use variáveis de ambiente `${VAR}` ou credenciais locais do MCP em `~/.fluxo-desenvolvimento/`).

```yaml
versao: "3.0.0"
idioma: "pt-BR"

ferramentas_ia:
  - claude-code
  - copilot
  - cursor

rastreador:
  provedor: "azure_devops" # opcoes: jira | azure_devops | tfs | github | nenhum
  aceitar_tarefa_por_descricao: true # permite iniciar o fluxo passando apenas uma descrição textual sem link/card no rastreador
  url_base: "https://dev.azure.com/organizacao"
  projeto_chave: "PROJ"
  area_path: "" # opcional (Azure DevOps / TFS)
  sincronizacao_automatica: true
  vincular_commits: true
  mcp_ativo: false
  mcp_servidor: "" # ex: atlassian | azure-devops | tfs

  # Vocabulário e hierarquia de itens (descoberto via MCP ou informado manualmente)
  vocabulario:
    item_pai: "User Story" # ex: Story | Issue | User Story | Product Backlog Item
    subtarefa: "Task" # ex: Sub-task | Task | Subtarefa
    bug: "Bug"
    impedimento: "Impediment" # ex: Impediment | Issue | Blocker

  # Descoberta dinâmica do board (preenchida automaticamente quando mcp_ativo = true)
  board_descoberto:
    descoberto_em: ""
    colunas:
      - "New"
      - "Active"
      - "Resolved"
      - "Closed"
    mapeamento_estados:
      inicio_desenvolvimento: "Active"
      em_revisao: "Active"
      aguardando_qa: "Resolved"
      concluido: "Closed"
    criar_subtarefas_automaticamente: true
    padrao_subtarefas:
      - "[DEV] Implementação e testes unitários"
      - "[QA] Validação funcional e evidências"
    regras_transicao_observadas: ""

jira:
  url_base: "https://empresa.atlassian.net"
  projeto_chave: "PROJ"
  board_id: 0
  campos_customizados:
    pontos_historia: "customfield_10016"
    criterios_aceite: "customfield_10035"
    testes_aceite: "customfield_10020"

azure_devops:
  organizacao_url: "https://dev.azure.com/empresa"
  projeto: "Core"
  area_path: ""
  iteration_path: ""

repositorio:
  provedor: "github" # opcoes: github | gitlab | azure_repos
  branch_padrao: "main"
  branch_desenvolvimento: "develop"
  padrao_branch: "feature/{chave}-{descricao_curta}"
  padrao_branch_bugfix: "fix/{chave}-{descricao_curta}"
  estrategia_merge: "squash"
  padrao_commit: "conventional_commits"
  atribuicao_ia: true
  bloquear_push_main: true
  exigir_autorizacao_push: true

comandos:
  shell_preferencial: "powershell" # opcoes: powershell | bash | auto (acesso às ferramentas de terminal da máquina)
  build: "dotnet build"
  testes_unitarios: "dotnet test"
  testes_integracao: ""
  linter: ""

tolerancia_falhas:
  max_tentativas_build_validacao: 3
  permitir_bypass_etapa_com_aprovacao_humana: true

qualidade:
  cobertura_codigo_minima: 80.0
  cobertura_minima_novas_linhas: 85.0
  sonar:
    obrigatorio: false # true | false (false quando o fluxo vai direto para QA)
    medir_com_pipeline: false
    gate_estrito: false
  verificacoes_pre_commit:
    - "lint"
    - "test"

gateway_api:
  verificar_contratos: false
  diretorio_specs: "./docs/openapi"

arquitetura:
  exigir_revisao_condicional: true

testes_aceite:
  ativo: false
  provedor: "nenhum" # xray | azure_test_plans | zephyr | nenhum
  framework: "cucumber" # cucumber | robot | cypress | playwright

qa:
  ativo: true
  ambiente_obrigatorio: "hml" # hml | staging | qa | nenhum
  fluxo_direto_para_qa: true # true quando não há coluna/gate de Sonar intermediário
  execucao_paralela: true
  ambiente_isolado: true
  mock_servicos_externos: true
  relatorios:
    diretorio_saida: "reports/qa"

infraestrutura_banco:
  banco_configurado: false # pode ser ativado posteriormente via /configurar-fluxo
  tipo_banco: "nenhum" # sqlserver | postgres | mysql | oracle | mongodb | nenhum
  mcp_banco_ativo: false
  mcp_banco_servidor: ""
  caminho_migrations: ""
  politica_alteracao_schema: "somente_leitura_ou_migration_revisada"

modelos:
  rapido: "haiku / gpt-4o-mini"
  padrao: "sonnet / gpt-4o"
  forte: "opus / o1"

mcps: []
```
