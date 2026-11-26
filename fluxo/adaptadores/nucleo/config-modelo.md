<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Configuração do Fluxo de Desenvolvimento

```yaml
versao: "1.0.0"
idioma: "pt-BR"

ferramentas_ia:
  - claude-code
  - copilot
  - cursor

rastreador:
  provedor: "jira" # jira | azure_devops
  projeto_chave: "PROJ"

jira:
  url: "https://empresa.atlassian.net"
  campo_testes_aceite: "customfield_10020"

azure_devops:
  organizacao: "empresa"
  projeto: "Core"

repositorio:
  branch_padrao: "main"
  padrao_branch_feature: "feature/{chave}-{descricao_curta}"
  padrao_commit: "conventional_commits"
  abrir_pr: true
  atribuicao_ia: true

qualidade:
  sonar:
    obrigatorio: true
    cobertura_minima_linhas: 80.0
    cobertura_minima_novas_linhas: 85.0
    medir_com_pipeline: true

gateway_api:
  verificar_contratos: true
  diretorio_specs: "./docs/openapi"

testes_aceite:
  provedor: "xray" # xray | azure_test_plans | nenhum

qa:
  ambiente_obrigatorio: "hml"

modelos:
  rapido: "haiku / gpt-4o-mini"
  padrao: "sonnet / gpt-4o"
  forte: "opus / o1"

mcps:
  - atlassian
  - github
  - azure-devops
```
