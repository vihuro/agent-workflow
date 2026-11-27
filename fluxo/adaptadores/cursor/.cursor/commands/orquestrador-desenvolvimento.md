<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Orquestrador de Desenvolvimento (Squad Agêntica)

1. Verifique se `.fluxo/config-modelo.md` existe no repositório (ou consulte `~/.fluxo-desenvolvimento/config.md`). Se não existir, invoque `AskQuestion` perguntando se deseja executar `/configurar-fluxo` agora ou prosseguir com os padrões.
2. Leia `.fluxo/aprendizados.md` (se existir) para aplicar aprendizados anteriores da squad.
3. Aceite tanto uma **chave/link de card** (`PROJ-123`, `AB#12345`, URL) quanto uma **descrição textual livre da tarefa** (sem card no board, atribuindo identificador local `LOCAL-<slug>`).
4. Leia e siga `.fluxo/playbook-orquestrador.md` (ou `~/.fluxo-desenvolvimento/playbook-orquestrador.md`) como sessão principal, utilizando terminal (`PowerShell` / `Bash`) quando necessário.
5. **Observabilidade Obrigatória:** Atualize `.fluxo/status-atual.md` e salve os artefatos em `.fluxo/execucoes/<ID-TAREFA>/` antes e depois de cada agente, exibindo banners visuais no chat (`▶️ [SQUAD | Etapa X] Acionando <Agente>...` e `✅ [SQUAD | Etapa X] <Agente> concluído...`).
6. Use `AskQuestion` para todas as confirmações obrigatórias (escopo inicial, ambiguidades do PO, limite de tentativas de build e autorização antes de `git push`).
7. Delegue cada papel ativo automaticamente aos subagentes (`Task`) seguindo as definições em `.cursor/agents/` (ou `.fluxo/agentes/`) sem parar o fluxo entre etapas automáticas.
