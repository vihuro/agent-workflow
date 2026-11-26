<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Guia Completo de MCPs (Model Context Protocol)

O Model Context Protocol (MCP) conecta os assistentes de IA (**Claude Code**, **GitHub Copilot** e **Cursor**) a ferramentas de gestão de tarefas, repositórios, nuvem e bancos de dados. O fluxo opera tanto **com MCPs ativos** quanto **sem MCPs** (podendo ser configurados posteriormente via `/configurar-fluxo`).

---

## 1. Visão Geral e Quando Utilizar Cada MCP

| Servidor MCP | Função Principal | Quando é Necessário? |
| :--- | :--- | :--- |
| **Atlassian** | Integração com Jira e Confluence | Leitura/atualização de histórias, criação de sub-tasks, descoberta de colunas e documentação. |
| **Azure DevOps / TFS** | Gerenciamento de Work Items e Boards | Consulta a quadros Azure Boards/TFS, descoberta de colunas, tasks filhas e vínculo de PRs. |
| **GitHub** | Gestão de Repositórios e PRs | Criação e revisão de Pull Requests, leitura de checks do GitHub Actions e inspeção de código. |
| **AWS** | Inspeção e Gestão de Infraestrutura | Consulta a logs do CloudWatch e verificação de implantação em staging (opcional para QA). |
| **Banco de Dados** | SQL Server / Postgres / MySQL | Inspeção de schema e validação de queries (ativado apenas quando `infraestrutura_banco.banco_configurado: true`). |

---

## 2. Configuração Posterior
Caso não configure os MCPs no momento da instalação inicial, basta rodar `/configurar-fluxo` a qualquer momento depois para ativar o MCP, executar a descoberta automática do board (Bloco B) ou habilitar o banco de dados (Bloco H).

---

## 3. Configurações por Ferramenta

### 3.1. Claude Code CLI (`claude_desktop_config.json` ou CLI)
```bash
claude mcp add atlassian -- npx -y @modelcontextprotocol/server-atlassian
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

### 3.2. GitHub Copilot (`mcp.json`)
```json
{
  "mcpServers": {
    "atlassian": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-atlassian"],
      "env": {
        "ATLASSIAN_HOST": "https://sua-empresa.atlassian.net",
        "ATLASSIAN_EMAIL": "usuario@empresa.com",
        "ATLASSIAN_API_TOKEN": "${env:ATLASSIAN_API_TOKEN}"
      }
    },
    "azure-devops": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-azure-devops"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/sua-organizacao",
        "AZURE_DEVOPS_PAT": "${env:AZURE_DEVOPS_PAT}"
      }
    }
  }
}
```

### 3.3. Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

---

## 4. Boas Práticas e Segurança
- Nunca insira credenciais reais em arquivos commitados; utilize variáveis de ambiente (`${env:NOME_DA_VARIAVEL}`).
- Certifique-se de que `.cursor/mcp.json`, `.vscode/mcp.json`, `mcp.json` e `.env*` estejam no `.gitignore`.
