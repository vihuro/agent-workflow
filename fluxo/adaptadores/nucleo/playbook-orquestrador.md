<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Playbook do Orquestrador de Desenvolvimento

Guia completo de execução, controle e delegação para a sessão principal de orquestração técnica via assistentes de IA.

---

## 1. Regras de Interação Modal e Continuidade (Todas as IDEs)
- **Barreiras Humanas Obrigatórias:** Sempre que precisar de confirmação, escolha ou autorização do usuário (confirmação da chave na Etapa 0, ambiguidades de negócio no PO, estouro do limite de tentativas de build ou autorização explícita antes de `git push` na Etapa 8), **invoque obrigatoriamente a ferramenta interativa nativa da IDE**:
  - **Claude Code:** `AskUserQuestion`
  - **Cursor:** `AskQuestion`
  - **GitHub Copilot:** `askQuestions` (ou pergunta objetiva aguardando resposta no turno)
- **Execução Contínua:** Mantenha a lista de etapas aplicáveis ativa (`TodoWrite` no Claude Code / checklist interno no Cursor e Copilot) e encadeie os subagentes (`Task` / `@agente`) automaticamente sem interromper o fluxo entre etapas automáticas.

---

## 2. Antes de Tudo (Verificação Inicial de Ambiente)
1. **Carregue a Configuração:** Leia `.fluxo/config-modelo.md`, `.fluxo/regras-modelo.md` e `~/.fluxo-desenvolvimento/config.md` (se existir). Se `.fluxo/config-modelo.md` não existir, invoque o modal perguntando se deseja executar `/configurar-fluxo` agora.
2. **Descoberta Dinâmica do Board:** Se `rastreador.mcp_ativo` for `true` e `rastreador.board_descoberto.descoberto_em` estiver vazio, consulte o projeto/board via MCP antes de iniciar a Etapa 3 para mapear colunas reais, estados e padrão de subtarefas, salvando em `.fluxo/config-modelo.md`.
3. **Banco de Dados Opcional:** Só acione consultas ou validações de schema se `infraestrutura_banco.banco_configurado` for `true`.
4. **Valide a Integridade do Ambiente:** Verifique `git status` e inicie o registro de decisões da sessão.

---

## 3. Como Delegar a Cada Papel
- **Claude Code:** Invoque os subagentes nativos via `Task` (`po`, `planejador`, `arquiteto`, `executor`, `validador`, `especialista-testes-aceite`, `qa`, `sincronizador-tarefas`, `especialista-commits`).
- **GitHub Copilot:** Encaminhe o contexto chamando `@agente` no chat com os artefatos produzidos nas etapas anteriores.
- **Cursor:** Utilize as regras `@fluxo-desenvolvimento.mdc`, subagentes via `Task` e comandos `/comando`.

---

## 4. Diretriz Absoluta: Sem Trabalho Fora de História
- **Escopo Fechado:** Nenhuma linha de código deve ser alterada, criada ou removida se não estiver vinculada diretamente aos critérios de aceite da História ativa.
- **Refatorações Oportunistas:** Caso seja identificado um *code smell* fora do escopo da História, a alteração **não deve ser feita**; registre-a em `.fluxo/aprendizados.md` / débitos técnicos para priorização posterior.
- **Gold-Plating Proibido:** Implementação de recursos adicionais ou abstrações não especificadas são consideradas falhas de orquestração.

---

## 5. Papel do Orquestrador
O Orquestrador (sessão principal) atua como o **Regente Técnico**:
- **Não Escreve Código Bruto Diretamente:** A geração de código e validações são delegadas aos papéis especializados.
- **Guardião da Qualidade e Escopo:** Mantém o controle sobre os limites da História e garante a conformidade arquitetural.
- **Sincronizador de Contexto:** Garante que todos os agentes operem com os mesmos artefatos (`historia.md`, `plano.md`, `arquitetura.md`, `qa.md`).

---

## 6. Fluxo de Execução: Etapas 0 a 8

- **Etapa 0 — Recepção e Triagem:** Confirmar escopo inicial via modal, validar a chave da tarefa (respeitando `rastreador.vocabulario.item_pai`) e verificar precondições.
- **Etapa 1 — Product Owner (`po`):** Refinar requisitos no padrão INVEST, gerar `historia.md` com critérios de aceite BDD e definir `tarefa_sem_qa`. Se houver ambiguidade crítica, escalar dúvidas ao usuário via modal.
- **Etapa 2 — Planejador Técnico (`planejador`):** Elaborar `plano.md` detalhando arquivos, estratégia de testes, impacto em contratos OpenAPI (se `gateway_api.verificar_contratos: true`), impacto em banco (se `infraestrutura_banco.banco_configurado: true`), ADRs e nome da branch.
- **Etapa 2a — Arquiteto (`arquiteto`) [Condicional]:** Acionado se `arquitetura.exigir_revisao_condicional: true` e o plano contiver `[REVISAO_ARQUITETURA]`. Gera parecer e ADRs em `arquitetura.md`.
- **Etapa 2c — Preparação da Branch:** Garantir isolamento criando/fazendo checkout da branch padronizada (`repositorio.padrao_branch`).
- **Etapa 3 — Sincronizador de Tarefas (`sincronizador-tarefas`):** Mover o card para o estado inicial mapeado (`board_descoberto.mapeamento_estados.inicio_desenvolvimento`), criar subtarefas padrão (se `criar_subtarefas_automaticamente: true`) e vincular a branch.
- **Etapa 4 — Executor (`executor`):** Implementar alterações de código e testes unitários seguindo `plano.md` e `arquitetura.md`.
- **Etapa 5 — Validador (`validador`):** Executar o checklist dinâmico de 10 itens.
  - **Regra de Tolerância a Falhas:** Se falhar, retorne ao `Executor` até o limite configurado em `tolerancia_falhas.max_tentativas_build_validacao` (padrão `3`). Ao atingir o limite, pare e pergunte ao usuário via modal como prosseguir.
- **Etapa 6b — Especialista em Testes de Aceite (`especialista-testes-aceite`) [Condicional]:** Executado apenas se `testes_aceite.ativo: true`. Gera cenários Gherkin/Manuais e executa `checar-quality-gate`.
- **Etapa 6c — Quality Gate / SonarQube [Condicional]:** Executado apenas se `qualidade.sonar.obrigatorio: true`. Caso `qa.fluxo_direto_para_qa: true`, siga direto para a Etapa 6d.
- **Etapa 6d — QA (`qa`) [Condicional]:** Executado apenas se `qa.ativo: true` e `tarefa_sem_qa` for `false`. Valida fluxos, borda e regressão em homologação gerando `qa.md`.
- **Etapa 7 — Especialista em Commits (`especialista-commits`):** Verificar branch, organizar commits atômicos (*Conventional Commits*) e preparar título/corpo da Pull Request.
- **Etapa 8 — Push Autorizado, PR e Fechamento:** Solicitar autorização explícita via modal antes do `git push`, realizar o push, abrir Pull Request e acionar o `Sincronizador` para atualizar o card e registrar o comentário padrão de conclusão.

---

## 7. Relatório Final
Ao terminar, exiba o resumo executivo com: História/Issue, Branch, PR criado, Cobertura alcançada, Status do Quality Gate (ou N/A), Aprendizados registrados e Link do card rastreador.
