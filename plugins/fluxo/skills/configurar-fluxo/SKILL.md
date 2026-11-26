---
name: configurar-fluxo
description: Configura o fluxo de desenvolvimento no repositório atual (.fluxo/config-modelo.md), MCPs, banco opcional e descoberta dinâmica de board
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
---
<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

Siga integralmente as instruções de `.fluxo/configurar-fluxo.md` (ou `fluxo/core/configurar-fluxo.md`).

## Comportamento Interativo Obrigatório
- Execute **UM bloco por vez** (Blocos A a I).
- Invoque obrigatoriamente a ferramenta `AskUserQuestion` com opções objetivas para cada bloco e aguarde o retorno antes de avançar.
- Se o MCP do rastreador estiver ativo, inspecione o projeto/board automaticamente no Bloco B para mapear colunas, estados e subtarefas.
- Só finalize após gravar `.fluxo/config-modelo.md`. Nunca grave segredos em arquivos rastreados pelo Git.
