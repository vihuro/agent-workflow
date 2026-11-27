<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Plugin Fluxo v3.1.0 (Claude Code)

Plugin multi-agente universal e autocontido para orquestração de desenvolvimento padronizado (com card no Jira/Azure/TFS ou por descrição textual livre).

## Instalação no Claude Code
Dentro do Claude Code, adicione este repositório como marketplace e instale o plugin `fluxo`:
```text
/plugin marketplace add <CAMINHO_PARA_ESTE_REPOSITORIO>
/plugin install fluxo@agent-workflow
```

## Atualização (Quando já estiver instalado)
```text
/plugin marketplace update agent-workflow
/plugin update fluxo@agent-workflow
```
*(Ou rode `/plugin uninstall fluxo@agent-workflow` seguido de `/plugin install fluxo@agent-workflow` e recarregue a janela da IDE).*

## Comandos / Skills
- `/fluxo:configurar-fluxo`
- `/fluxo:orquestrador-desenvolvimento <CHAVE-TAREFA ou DESCRIÇÃO DA TAREFA>`
- `/fluxo:status-fluxo` (verifica em tempo real o painel `.fluxo/status-atual.md` e os artefatos da execução)
