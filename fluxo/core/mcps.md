# MCPs (Model Context Protocol) Utilizados no Fluxo

## Quando Cada MCP é Necessário
- **Atlassian (`atlassian`):** Leitura/atualização de histórias e tasks no Jira e páginas no Confluence.
- **Azure DevOps (`azure-devops`):** Gestão de Work Items, pipelines e vínculos de Pull Requests no Azure Boards.
- **GitHub (`github`):** Abertura de Pull Requests, leitura de status de checks/actions e revisão de código.
- **AWS (`aws`):** Consulta de logs (CloudWatch) e validação de deploys em ambiente de homologação (opcional para QA).

## Configuração por Ferramenta

### Claude Code (`~/.claude.json` ou CLI)
```bash
claude mcp add atlassian -- npx -y @modelcontextprotocol/server-atlassian
claude mcp add github -- npx -y @modelcontextprotocol/server-github
claude mcp add azure-devops -- npx -y @modelcontextprotocol/server-azure-devops
```

### GitHub Copilot (`mcp.json`)
```json
{
  "mcpServers": {
    "atlassian": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-atlassian"]
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

### Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-atlassian"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```
