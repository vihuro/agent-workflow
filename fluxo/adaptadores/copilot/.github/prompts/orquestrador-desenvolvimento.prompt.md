---
mode: agent
description: Orquestra o fluxo completo de desenvolvimento de uma história ou tarefa (PO, planejador, arquiteto, executor, validador, TA, QA, commits e rastreador)
tools: ['codebase', 'editFiles', 'runCommands', 'askQuestions']
---
<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Orquestrador de Desenvolvimento

1. Se `.fluxo/config-modelo.md` não existir, use `askQuestions` perguntando se deseja executar `/configurar-fluxo` agora.
2. Leia e siga `.fluxo/playbook-orquestrador.md` como sessão principal, respeitando o vocabulário e board descoberto.
3. Use `askQuestions` para confirmações obrigatórias (escopo inicial, ambiguidades do PO, estouro de tentativas de build e autorização antes de `git push`).
4. Delegue cada etapa ativa ao agente especializado correspondente (`@po`, `@planejador`, `@arquiteto`, `@executor`, `@validador`, `@especialista-testes-aceite`, `@qa`, `@sincronizador-tarefas`, `@especialista-commits`).
