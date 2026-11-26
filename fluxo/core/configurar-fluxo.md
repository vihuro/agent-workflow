# Procedimento de Configuração do Fluxo (`/configurar-fluxo`)

Este assistente guia a inicialização e parametrização do fluxo de desenvolvimento em um repositório.

## Regra Crítica de Execução (Pausa Obrigatória por Bloco)
- **NUNCA** despeje todos os blocos (A a I) de uma única vez no chat.
- Execute **UM bloco por vez** utilizando a ferramenta de interação nativa do cliente atual:
  - **Claude Code:** `AskUserQuestion`
  - **Cursor:** `AskQuestion`
  - **GitHub Copilot:** `askQuestions` (ou pergunta direta objetiva com opções numeradas aguardando resposta no turno antes de avançar)
- **PARE e aguarde** o retorno do usuário antes de formular ou exibir o próximo bloco.
- **NUNCA** grave chaves de API, senhas, PATs ou tokens em arquivos rastreados pelo Git.

## Ponto de Partida
1. Verifique se `.fluxo/config-modelo.md` já existe no repositório.
2. Valide se há preferências globais em `~/.fluxo-desenvolvimento/config.md`.

## Sequência de Blocos (1 interação por bloco)

### Bloco A — Rastreador de Tarefas
Pergunte ao usuário e aguarde resposta:
1. Qual o provedor do rastreador? (`jira`, `azure_devops` ou `nenhum`)
2. Qual a URL base (ex: `https://empresa.atlassian.net`) e a chave/projeto (ex: `PROJ`)?

### Bloco B — Git, Branches e Commits
Pergunte ao usuário e aguarde resposta:
1. Qual a branch principal? (`main`, `master` ou `develop`)
2. Qual o padrão de branch feature (ex: `feature/{chave}-{descricao_curta}`) e padrão de commit (`conventional_commits`)?

### Bloco C — Comandos Locais (Build, Testes e Lint)
Pergunte ao usuário e aguarde resposta:
1. Comando de build (ex: `dotnet build`, `npm run build`)
2. Comando de testes unitários / integração (ex: `dotnet test`, `npm test`)
3. Comando de linter / formatação

### Bloco D — Cobertura e Quality Gate (SonarQube)
Pergunte ao usuário e aguarde resposta:
1. SonarQube / Quality Gate é obrigatório? (`Sim` ou `Não`)
2. Meta mínima de cobertura (ex: `80%` geral / `85%` código novo)?

### Bloco E — Contratos de API e Gateway
Pergunte ao usuário e aguarde resposta:
1. Exigir validação de contratos OpenAPI/Swagger antes da implementação? (`Sim` ou `Não`)
2. Caminho das specs OpenAPI (ex: `./docs/openapi`)?

### Bloco F — Testes de Aceite
Pergunte ao usuário e aguarde resposta:
- Qual ferramenta gerencia os testes de aceite? (`xray`, `azure_test_plans` ou `nenhum`)

### Bloco G — Homologação (QA)
Pergunte ao usuário e aguarde resposta:
- Qual o ambiente obrigatório de QA? (`hml`, `staging` ou `nenhum`)

### Bloco H — Perfis de Modelos de IA
Pergunte ao usuário e aguarde resposta:
- Deseja manter os perfis padrão (`rapido`, `padrao`, `forte`) ou informar modelos customizados?

### Bloco I — Servidores MCP Ativos
Pergunte ao usuário e aguarde resposta:
- Quais servidores MCP estão configurados no seu ambiente? (`atlassian`, `github`, `azure-devops`, `aws`)

## Aplicar Configuração
Somente após receber as respostas de todos os blocos:
1. Gere/atualize `.fluxo/config-modelo.md` com os valores coletados.
2. Se for instalação local, confirme se `.fluxo/` está em `.git/info/exclude`.
3. Apresente um resumo final da configuração aplicada.