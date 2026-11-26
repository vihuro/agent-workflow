<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Orquestrador de Desenvolvimento

1. Se `.fluxo/config-modelo.md` não existir, invoque `AskQuestion` perguntando se deseja executar `/configurar-fluxo` agora.
2. Leia e siga `.fluxo/playbook-orquestrador.md` como sessão principal, respeitando o vocabulário e o board configurado.
3. Use `AskQuestion` para todas as confirmações obrigatórias (escopo inicial, ambiguidades do PO, limite de tentativas de build e autorização antes de `git push`).
4. Delegue cada papel ativo aos subagentes (`Task`) seguindo as definições em `.fluxo/agentes/` sem parar o fluxo entre etapas automáticas.
