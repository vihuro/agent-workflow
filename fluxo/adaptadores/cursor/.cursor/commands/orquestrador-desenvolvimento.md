<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Orquestrador de Desenvolvimento

1. Verifique se `.fluxo/config-modelo.md` existe no repositório (ou consulte `~/.fluxo-desenvolvimento/config.md`). Se não existir, invoque `AskQuestion` perguntando se deseja executar `/configurar-fluxo` agora ou prosseguir com os padrões.
2. Leia `.fluxo/aprendizados.md` (se existir) para aplicar aprendizados anteriores da squad.
3. Aceite tanto uma **chave/link de card** (`PROJ-123`, `AB#12345`, URL) quanto uma **descrição textual livre da tarefa** (sem card no board, atribuindo identificador local `LOCAL-<slug>`).
4. Leia e siga `.fluxo/playbook-orquestrador.md` (ou `~/.fluxo-desenvolvimento/playbook-orquestrador.md`) como sessão principal, utilizando terminal (`PowerShell` / `Bash`) quando necessário.
5. Use `AskQuestion` para todas as confirmações obrigatórias (escopo inicial, ambiguidades do PO, limite de tentativas de build e autorização antes de `git push`).
6. Delegue cada papel ativo aos subagentes (`Task`) seguindo as definições em `.fluxo/agentes/` sem parar o fluxo entre etapas automáticas.
