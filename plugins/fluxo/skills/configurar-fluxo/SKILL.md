---
name: configurar-fluxo
description: Configura o fluxo de desenvolvimento no repositório atual (.fluxo/config-modelo.md), MCPs, banco opcional e descoberta dinâmica de board
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---
<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

Siga integralmente as instruções do procedimento empacotado neste plugin em `${CLAUDE_PLUGIN_ROOT}/referencias/configurar-fluxo.md` (usando `${CLAUDE_PLUGIN_ROOT}/referencias/config-modelo.md` e `${CLAUDE_PLUGIN_ROOT}/referencias/regras-modelo.md` como templates base caso `.fluxo/` ainda não exista no repositório de trabalho).

## Comportamento Interativo Obrigatório
- Execute **UM bloco por vez** (Blocos A a I).
- Invoque obrigatoriamente a ferramenta `AskUserQuestion` com opções objetivas para cada bloco e aguarde o retorno antes de avançar.
- Se o MCP do rastreador estiver ativo, inspecione o projeto/board automaticamente no Bloco B para mapear colunas, estados e subtarefas.
- Ao concluir, grave `.fluxo/config-modelo.md` e `.fluxo/regras-modelo.md` no repositório de trabalho. Nunca grave segredos em arquivos rastreados pelo Git.
