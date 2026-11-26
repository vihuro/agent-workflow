<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Procedimento de Configuração do Fluxo (`/configurar-fluxo`)

Este assistente guia a inicialização e parametrização do fluxo de desenvolvimento em um repositório.

## Ponto de Partida
1. Verifique se `.fluxo/config-modelo.md` já existe no repositório.
2. Valide se há preferências globais em `~/.fluxo-desenvolvimento/config.md`.

## Regras de Segurança (Sem Segredos)
- **NUNCA** grave chaves de API, senhas, PATs ou tokens em arquivos rastreados pelo Git.
- Todos os segredos devem ser referenciados via variáveis de ambiente (`${ENV_VAR}`) ou configurados localmente fora do controle de versão.

## Perguntas em Blocos (Blocos A a I)

- **Bloco A (Rastreador):** Qual o rastreador de tarefas (`jira` ou `azure_devops`), URL base e chave do projeto?
- **Bloco B (Git & Branches):** Qual a branch principal (`main`/`master`) e o padrão de nomenclatura para branches e commits?
- **Bloco C (Build & Testes Locais):** Quais os comandos locais para build, execução de testes unitários, integração e linter?
- **Bloco D (Qualidade & SonarQube):** Qual a meta mínima de cobertura (geral e código novo) e se há pipeline de medição automática?
- **Bloco E (Contratos de API):** O projeto utiliza OpenAPI/Swagger ou API Gateway que exija validação de contrato antes da implementação?
- **Bloco F (Testes de Aceite):** Como os testes de aceite são gerenciados (`xray`, `azure_test_plans` ou `nenhum`)?
- **Bloco G (Homologação QA):** Qual o ambiente obrigatório de QA (ex: `hml`, `staging`) e quais critérios definem `tarefa_sem_qa`?
- **Bloco H (Perfis de Modelos):** Quais modelos estão configurados para os perfis `rapido`, `padrao` e `forte`?
- **Bloco I (Servidores MCP):** Quais servidores MCP estão ativos no cliente local (Atlassian, GitHub, Azure DevOps, AWS)?

## Aplicar Configuração
Após coletar as respostas:
1. Gere/atualize `.fluxo/config-modelo.md` com os valores definidos.
2. Valide se `.fluxo/` está listado em `.git/info/exclude` (caso instalação local).
3. Confirme a conclusão ao usuário.
