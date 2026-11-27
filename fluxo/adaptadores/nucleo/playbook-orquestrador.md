<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Playbook do Orquestrador de Desenvolvimento

Guia completo de execução, controle e delegação para a sessão principal de orquestração técnica via assistentes de IA.

---

## 1. Regras de Interação Modal, Ferramentas Globais e Continuidade (Todas as IDEs)
- **Barreiras Humanas Obrigatórias:** Sempre que precisar de confirmação, escolha ou autorização do usuário (confirmação do escopo na Etapa 0, ambiguidades de negócio no PO, estouro do limite de tentativas de build ou autorização explícita antes de `git push` na Etapa 8), **invoque obrigatoriamente a ferramenta interativa nativa da IDE**:
  - **Claude Code:** `AskUserQuestion`
  - **Cursor:** `AskQuestion`
  - **GitHub Copilot:** `askQuestions` (ou pergunta objetiva aguardando resposta no turno)
- **Acesso Global a Ferramentas de Terminal e Sistema:** O Orquestrador e os agentes operacionais (`Executor`, `Validador`, `QA`, `Especialista em Commits`) possuem acesso às ferramentas de terminal da máquina (`PowerShell` no Windows / `Bash` no Linux e macOS), sistema de arquivos e Git para inspecionar o ambiente, compilar, testar e versionar sem bloqueios.
- **Execução Contínua e Observabilidade em Tempo Real:**
  - Mantenha a lista de etapas aplicáveis ativa (`TodoWrite` no Claude Code / checklist interno no Cursor e Copilot) e encadeie os subagentes (`Task` / `runSubagent`) automaticamente sem interromper o fluxo entre etapas automáticas.
  - **Painel Ao Vivo (`.fluxo/status-atual.md`) e Pasta de Artefatos (`.fluxo/execucoes/<ID-TAREFA>/`):** Atualize `.fluxo/status-atual.md` (seguindo o formato de `status-fluxo.md`) **antes** de acionar cada subagente (marcando `🔄 Em execução`) e **logo após** o retorno (marcando `✅ Concluído`, `❌ Reprovado` ou `⏭️ Pulado` e adicionando uma linha na seção *Linha do Tempo*). Salve os artefatos da tarefa em `.fluxo/execucoes/<ID-TAREFA>/`.
  - **Banners de Transição no Chat:** Emita sempre um aviso visual curto no chat ao iniciar e ao concluir cada agente da squad:
    - Ao iniciar: `▶️ [SQUAD | Etapa X] Acionando <Agente> (<objetivo curto>)...`
    - Ao concluir: `✅ [SQUAD | Etapa X] <Agente> concluído (<resumo do entregável>) -> Próximo: <Próximo Agente>` (ou `❌ [SQUAD | Etapa X] <Agente> reportou falha (Tentativa N/M)...`).

---

## 2. Antes de Tudo (Verificação Inicial de Ambiente)
1. **Carregue a Configuração e Aprendizados:**
   - Leia `.fluxo/config-modelo.md` e `.fluxo/regras-modelo.md` no repositório de trabalho (ou, se não existirem localmente, consulte `~/.fluxo-desenvolvimento/config.md` e os padrões empacotados no plugin em `referencias/config-modelo.md` e `referencias/regras-modelo.md`). Se `.fluxo/config-modelo.md` não existir no repositório, invoque o modal perguntando se deseja executar `/configurar-fluxo` agora ou prosseguir com os padrões.
   - **Leia `.fluxo/aprendizados.md`** (se existir) para carregar o histórico de decisões, armadilhas e padrões descobertos anteriormente pela squad neste repositório, repassando os pontos relevantes aos subagentes.
2. **Descoberta Dinâmica do Board:** Se houver card vinculado no rastreador, `rastreador.mcp_ativo` for `true` e `rastreador.board_descoberto.descoberto_em` estiver vazio, consulte o projeto/board via MCP antes de iniciar a Etapa 3 para mapear colunas reais, estados e padrão de subtarefas, salvando em `.fluxo/config-modelo.md`.
3. **Banco de Dados Opcional:** Só acione consultas ou validações de schema se `infraestrutura_banco.banco_configurado` for `true`.
4. **Valide a Integridade do Ambiente:** Verifique `git status` via terminal (`PowerShell` / `Bash`) e inicie o registro de decisões da sessão.

---

## 3. Como Delegar a Cada Papel (Execução Automática da Squad nas 3 IDEs)
- **Claude Code (Plugin `fluxo`):** Invoque os subagentes do plugin via ferramenta `Task` usando obrigatoriamente o prefixo `fluxo:` no `subagent_type` (`fluxo:po`, `fluxo:planejador`, `fluxo:arquiteto`, `fluxo:executor`, `fluxo:validador`, `fluxo:especialista-testes-aceite`, `fluxo:qa`, `fluxo:sincronizador-tarefas`, `fluxo:especialista-commits`).
- **GitHub Copilot (VS Code):** Invoque cada papel automaticamente via ferramenta `runSubagent` (passando o nome do agente customizado `po`, `planejador`, `arquiteto`, `executor`, `validador`, `especialista-testes-aceite`, `qa`, `sincronizador-tarefas`, `especialista-commits` ou as instruções de `.github/agents/<papel>.agent.md`), encadeando as etapas sem exigir que o usuário chame `@agente` manualmente.
- **Cursor:** Invoque cada papel automaticamente via ferramenta `Task` usando os agentes em `.cursor/agents/<papel>.md` (ou `.fluxo/agentes/<papel>.md`), mantendo a regra `@fluxo-desenvolvimento.mdc` ativa.

---

## 4. Diretriz de Escopo: Tarefa com Card ou Por Descrição Livre
- **Flexibilidade de Entrada (Com Card ou Sem Card):** O link ou ID de tarefa no rastreador (Jira, Azure DevOps, TFS, GitHub Issues) **não é obrigatório**. O usuário pode iniciar o fluxo passando:
  1. **Um link ou chave de card** (ex: `PROJ-123`, `AB#12345`, URL da tarefa); **OU**
  2. **Uma descrição textual direta da tarefa** (para adiantar desenvolvimento, criar POCs, resolver bugs rápidos ou desenvolver sem atividade cadastrada no board). Quando iniciada por descrição, gere um identificador local curto (ex: `LOCAL-001` ou `LOCAL-<slug>`) e conduza todas as etapas técnicas normalmente, pulando apenas a sincronização externa com o board.
- **Escopo Fechado na Demanda Ativa:** Nenhuma linha de código deve ser alterada, criada ou removida se não estiver vinculada diretamente aos critérios de aceite de `historia.md` (seja ela originada de um card ou de uma descrição direta).
- **Refatorações Oportunistas:** Caso seja identificado um *code smell* fora do escopo da demanda ativa, a alteração **não deve ser feita**; registre-a em `.fluxo/aprendizados.md` / débitos técnicos para priorização posterior.
- **Gold-Plating Proibido:** Implementação de recursos adicionais ou abstrações não especificadas são consideradas falhas de orquestração.

---

## 5. Papel do Orquestrador
O Orquestrador (sessão principal) atua como o **Regente Técnico**:
- **Não Escreve Código Bruto Diretamente:** A geração de código e validações são delegadas aos papéis especializados.
- **Guardião da Qualidade e Escopo:** Mantém o controle sobre os limites da demanda e garante a conformidade arquitetural.
- **Sincronizador de Contexto e Aprendizado:** Garante que todos os agentes operem com os mesmos artefatos (`historia.md`, `plano.md`, `arquitetura.md`, `qa.md`) e consumam/atualizem `.fluxo/aprendizados.md`.

---

## 6. Fluxo de Execução: Etapas 0 a 8

- **Etapa 0 — Recepção e Triagem:** Receber a chave/link da tarefa **ou** a descrição textual livre. Confirmar escopo inicial via modal, definir o identificador da sessão (`<CHAVE>` do card ou `LOCAL-<slug>`) e verificar precondições.
- **Etapa 1 — Product Owner (`fluxo:po` / `@po`):** Refinar requisitos no padrão INVEST (a partir do card no rastreador ou da descrição textual fornecida), gerar `historia.md` com critérios de aceite BDD e definir `tarefa_sem_qa`. Se houver ambiguidade crítica, escalar dúvidas ao usuário via modal.
- **Etapa 2 — Planejador Técnico (`fluxo:planejador` / `@planejador`):** Elaborar `plano.md` detalhando arquivos, estratégia de testes, impacto em contratos OpenAPI (se `gateway_api.verificar_contratos: true`), impacto em banco (se `infraestrutura_banco.banco_configurado: true`), ADRs e nome da branch.
- **Etapa 2a — Arquiteto (`fluxo:arquiteto` / `@arquiteto`) [Condicional]:** Acionado se `arquitetura.exigir_revisao_condicional: true` e o plano contiver `[REVISAO_ARQUITETURA]`. Gera parecer e ADRs em `arquitetura.md`.
- **Etapa 2c — Preparação da Branch:** Garantir isolamento criando/fazendo checkout da branch padronizada (`repositorio.padrao_branch`, ex: `feature/PROJ-123-slug` ou `feature/local-slug`).
- **Etapa 3 — Sincronizador de Tarefas (`fluxo:sincronizador-tarefas` / `@sincronizador-tarefas`) [Condicional a ter Card]:** Se houver card vinculado no rastreador, mover para o estado inicial mapeado (`board_descoberto.mapeamento_estados.inicio_desenvolvimento`), criar subtarefas padrão (se `criar_subtarefas_automaticamente: true`) e vincular a branch. Se a tarefa foi passada apenas por descrição sem card, pular sincronização externa.
- **Etapa 4 — Executor (`fluxo:executor` / `@executor`):** Implementar alterações de código e testes unitários seguindo `plano.md`, `arquitetura.md` e `.fluxo/aprendizados.md`.
- **Etapa 5 — Validador (`fluxo:validador` / `@validador`):** Executar o checklist dinâmico de 10 itens via terminal (`PowerShell` / `Bash`).
  - **Regra de Tolerância a Falhas:** Se falhar, retorne ao `Executor` até o limite configurado em `tolerancia_falhas.max_tentativas_build_validacao` (padrão `3`). Ao atingir o limite, pare e pergunte ao usuário via modal como prosseguir.
- **Etapa 6b — Especialista em Testes de Aceite (`fluxo:especialista-testes-aceite` / `@especialista-testes-aceite`) [Condicional]:** Executado apenas se `testes_aceite.ativo: true`. Gera cenários Gherkin/Manuais e realiza a verificação interna de Quality Gate dos Testes de Aceite.
- **Etapa 6c — Quality Gate / SonarQube [Condicional]:** Executado apenas se `qualidade.sonar.obrigatorio: true`. Caso `qa.fluxo_direto_para_qa: true`, siga direto para a Etapa 6d.
- **Etapa 6d — QA (`fluxo:qa` / `@qa`) [Condicional]:** Executado apenas se `qa.ativo: true` e `tarefa_sem_qa` for `false`. Valida fluxos, borda e regressão em homologação gerando `qa.md`.
- **Etapa 7 — Especialista em Commits (`fluxo:especialista-commits` / `@especialista-commits`):** Verificar branch, organizar commits atômicos (*Conventional Commits*) e preparar título/corpo da Pull Request.
- **Etapa 8 — Push Autorizado, PR e Fechamento:** Solicitar autorização explícita via modal antes do `git push`, realizar o push, abrir Pull Request e, caso exista card vinculado, acionar o `Sincronizador` para atualizar o card e registrar o comentário padrão de conclusão.

---

## 7. Relatório Final
Ao terminar, exiba o resumo executivo com: História/Demanda (`<CHAVE>` ou `LOCAL-<slug>`), Branch, PR criado, Cobertura alcançada, Status do Quality Gate (ou N/A), Aprendizados registrados em `.fluxo/aprendizados.md` e Link do card rastreador (quando aplicável).
