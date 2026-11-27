---
command: /orquestrador-desenvolvimento
description: Inicia o fluxo de desenvolvimento da squad agentica, orquestrando tarefas entre agentes especializados.
---

# Comando: /orquestrador-desenvolvimento

Este comando inicia o fluxo de trabalho da squad agentica no ambiente Cursor. Ele delega a orquestração de uma tarefa de desenvolvimento ao Agente Orquestrador, que por sua vez coordena os demais agentes especializados.

## Uso

`@fluxo-desenvolvimento.mdc orquestrar-tarefa {{TASK_DESCRIPTION_OR_ID}}`

Substitua `{{TASK_DESCRIPTION_OR_ID}}` pela descrição da tarefa (ex: "Criar módulo de autenticação") ou pelo ID do card no seu sistema de gestão (ex: "PROJ-123").

## Como Funciona

Ao invocar este comando, o Cursor ativará a regra `orquestrar-tarefa` do arquivo `fluxo-desenvolvimento.mdc`. Esta regra será responsável por:
1.  Interpretar a tarefa fornecida.
2.  Invocar os agentes especializados (definidos em `plugins/fluxo/agents/`) em sequência, passando o contexto necessário.
3.  Utilizar ferramentas do Cursor (como `AskQuestion`, `Task`, `runCommand`) para interagir com o usuário e executar ações.
4.  Seguir a lógica de orquestração definida no plano `squad-agentica-flow.md`.

**Exemplos:**
*   `/orquestrador-desenvolvimento Implementar busca de produtos por categoria.`
*   `/orquestrador-desenvolvimento US-789`

**Nota:** A lógica de delegação e interação dos agentes está definida em `fluxo-desenvolvimento.mdc` e nos arquivos de agente em `plugins/fluxo/agents/`.
