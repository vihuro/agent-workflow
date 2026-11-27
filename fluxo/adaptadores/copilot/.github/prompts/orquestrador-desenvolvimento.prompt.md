---
mode: agent
description: Orquestra o fluxo completo de desenvolvimento de uma história com card ou tarefa por descrição livre (PO, planejador, arquiteto, executor, validador, TA, QA, commits e rastreador)
tools: ['codebase', 'editFiles', 'runCommands', 'askQuestions']
---
<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Orquestrador de Desenvolvimento

1. Verifique se `.fluxo/config-modelo.md` existe no repositório (ou consulte `~/.fluxo-desenvolvimento/config.md`). Se não existir, use `askQuestions` perguntando se deseja executar `/configurar-fluxo` agora ou prosseguir com os padrões.
2. Leia `.fluxo/aprendizados.md` (se existir) para carregar o histórico de aprendizados da squad neste repositório.
3. Aceite tanto uma **chave/link de card** (`PROJ-123`, `AB#12345`, URL) quanto uma **descrição textual livre da tarefa** (sem atividade cadastrada no board, gerando identificador local `LOCAL-<slug>`).
4. Leia e siga `.fluxo/playbook-orquestrador.md` (ou `~/.fluxo-desenvolvimento/playbook-orquestrador.md`) como sessão principal, com acesso às ferramentas de terminal (`PowerShell` / `Bash`).
5. Use `askQuestions` para confirmações obrigatórias (escopo inicial, ambiguidades do PO, estouro de tentativas de build e autorização antes de `git push`).
6. Delegue cada etapa ativa ao agente especializado correspondente (`@po`, `@planejador`, `@arquiteto`, `@executor`, `@validador`, `@especialista-testes-aceite`, `@qa`, `@sincronizador-tarefas`, `@especialista-commits`).
