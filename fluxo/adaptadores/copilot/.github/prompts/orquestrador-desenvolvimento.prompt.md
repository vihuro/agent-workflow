---
mode: agent
description: Orquestra o fluxo completo de desenvolvimento de uma história com card ou tarefa por descrição livre (PO, planejador, arquiteto, executor, validador, TA, QA, commits e rastreador)
tools: ['codebase', 'editFiles', 'runCommands', 'askQuestions', 'runSubagent']
---
<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Orquestrador de Desenvolvimento (Squad Agêntica)

1. Verifique se `.fluxo/config-modelo.md` existe no repositório (ou consulte `~/.fluxo-desenvolvimento/config.md`). Se não existir, use `askQuestions` perguntando se deseja executar `/configurar-fluxo` agora ou prosseguir com os padrões.
2. Leia `.fluxo/aprendizados.md` (se existir) para carregar o histórico de aprendizados da squad neste repositório.
3. Aceite tanto uma **chave/link de card** (`PROJ-123`, `AB#12345`, URL) quanto uma **descrição textual livre da tarefa** (sem atividade cadastrada no board, gerando identificador local `LOCAL-<slug>`).
4. Leia e siga `.fluxo/playbook-orquestrador.md` (ou `~/.fluxo-desenvolvimento/playbook-orquestrador.md`) como sessão principal, com acesso às ferramentas de terminal (`PowerShell` / `Bash`).
5. **Observabilidade Obrigatória:** Mantenha o painel ao vivo `.fluxo/status-atual.md` e os artefatos em `.fluxo/execucoes/<ID-TAREFA>/` atualizados a cada início e fim de etapa, e exiba banners visuais no chat (`▶️ [SQUAD | Etapa X] Acionando <Agente>...` e `✅ [SQUAD | Etapa X] <Agente> concluído...`).
6. Use `askQuestions` para confirmações obrigatórias (escopo inicial, ambiguidades do PO, estouro de tentativas de build e autorização antes de `git push`).
7. Delegue cada etapa ativa automaticamente via `runSubagent` para os agentes da squad (`po`, `planejador`, `arquiteto`, `executor`, `validador`, `especialista-testes-aceite`, `qa`, `sincronizador-tarefas`, `especialista-commits`), encadeando as etapas até a conclusão.
