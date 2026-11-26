# Fluxo de Trabalho da Squad Agentica (Automatizado)

Este documento descreve o fluxo de trabalho automatizado para uma squad agentica, orquestrada por um Agente Orquestrador central. O objetivo é maximizar a autonomia e minimizar a intervenção humana, utilizando os agentes especializados para cada etapa do ciclo de desenvolvimento.

## Princípios Fundamentais

*   **Autonomia:** Agentes executam tarefas complexas com supervisão mínima.
*   **Adaptação:** Capacidade de reagir a falhas e ajustar o plano.
*   **Aprendizado Contínuo:** Feedback e melhoria baseados em execuções anteriores.
*   **Observabilidade:** Geração de relatórios claros em cada etapa.
*   **Tolerância a Falhas:** Mecanismos para lidar com erros e escalar quando necessário.

## Componentes da Squad Agentica

*   **Agente Orquestrador (Principal):** Coordena o fluxo, delega tarefas, gerencia o estado e lida com escaladas para o usuário.
*   **Agente Product Owner (PO):** Refina requisitos e gera `historia.md`.
*   **Agente Planejador Técnico:** Elabora `plano.md`, incluindo estratégia de testes, impacto e ADRs.
*   **Agente Arquiteto de Software:** Revisa aspectos arquiteturais e gera `arquitetura.md` (condicional).
*   **Agente Executor de Código:** Implementa código e testes unitários.
*   **Agente Validador de Qualidade:** Executa checklists, build e testes unitários/integração.
*   **Agente Especialista em Testes de Aceite:** Gera e executa testes de aceite (condicional).
*   **Agente Analista de Qualidade (QA):** Valida em ambiente de homologação (condicional).
*   **Agente Especialista em Commits e Versionamento:** Prepara commits atômicos e Pull Requests.
*   **Agente Sincronizador de Tarefas:** Atualiza o sistema de gestão de tarefas (Jira/Azure DevOps/GitHub Issues).

## Fluxo de Execução Detalhado

### Etapa 0: Início e Configuração (Orquestrador)
*   **Ações:**
    *   Carrega `.fluxo/config-modelo.md` e `.fluxo/regras-modelo.md`.
    *   Se `rastreador.mcp_ativo` for `true` e `rastreador.board_descoberto.descoberto_em` estiver vazio, invoca `configurar-fluxo` para descoberta dinâmica do board.
    *   Valida `git status` e inicia registro de decisões.
*   **Ferramentas:** `view` para ler arquivos, `powershell` para `git status`, `ask_user` para `configurar-fluxo` se necessário.
*   **Condições de Saída:** Ambiente configurado, board (se aplicável) descoberto.

### Etapa 1: Refinamento da História (PO)
*   **Delegado a:** Agente Product Owner (`po`).
*   **Entradas:** Descrição da tarefa (via link ou descrição direta do usuário), `config-modelo.md`.
*   **Ações:**
    *   Interpreta a demanda e estrutura no padrão INVEST.
    *   Define critérios de aceite e regras de negócio.
    *   Gera `historia.md`.
    *   Define `tarefa_sem_qa`.
    *   Se `rastreador.mcp_ativo: true`, atualiza o card no rastreador via MCP.
*   **Ferramentas:** `view` (historia.md), `edit` (historia.md), `github-mcp-server-issue_read`, `github-mcp-server-issue_add_comment` (se MCP ativo).
*   **Condições de Saída:** `historia.md` criada/atualizada, card atualizado (se MCP ativo).

### Etapa 2: Planejamento Técnico (Planejador)
*   **Delegado a:** Agente Planejador Técnico (`planejador`).
*   **Entradas:** `historia.md`, código-fonte do projeto, `config-modelo.md`, `regras-modelo.md`.
*   **Ações:**
    *   Traduz requisitos em plano de execução sequencial (`plano.md`).
    *   Define contratos de API (se `gateway_api.verificar_contratos: true`).
    *   Identifica arquivos/módulos afetados e mapeia impacto (incluindo banco de dados se `infraestrutura_banco.banco_configurado: true`).
    *   Define estratégia de testes.
    *   Define nome da branch (`feature/{chave}-{descricao_curta}` ou `fix/{chave}-{descricao_curta}`).
    *   Marca pontos com `[REVISAO_ARQUITETURA]` se `arquitetura.exigir_revisao_condicional: true`.
*   **Ferramentas:** `view`, `edit` (plano.md), `grep` (para análise de impacto).
*   **Condições de Saída:** `plano.md` criado/atualizado.

### Etapa 2a: Revisão Arquitetural (Arquiteto - Condicional)
*   **Delegado a:** Agente Arquiteto de Software (`arquiteto`).
*   **Entradas:** `plano.md` (com `[REVISAO_ARQUITETURA]`), `historia.md`, `config-modelo.md`.
*   **Condição de Execução:** Se `arquitetura.exigir_revisao_condicional: true` e `plano.md` contiver `[REVISAO_ARQUITETURA]`.
*   **Ações:**
    *   Avalia impactos não funcionais.
    *   Revisa pontos `[REVISAO_ARQUITETURA]`.
    *   Modelar dados/interfaces.
    *   Gera `arquitetura.md` com parecer (APROVADO/REJEITADO) e ADRs.
*   **Ferramentas:** `view`, `edit` (arquitetura.md).
*   **Condições de Saída:** `arquitetura.md` gerada.

### Etapa 2c: Preparação da Branch (Orquestrador)
*   **Ações:**
    *   Cria ou faz checkout da branch padronizada conforme definida em `plano.md`.
*   **Ferramentas:** `GitKraken-git_branch` (create), `GitKraken-git_checkout`.
*   **Condições de Saída:** Branch correta criada/ativa.

### Etapa 3: Sincronização de Tarefas (Sincronizador)
*   **Delegado a:** Agente Sincronizador de Tarefas (`sincronizador-tarefas`).
*   **Entradas:** Chave da tarefa, `config-modelo.md`, nome da branch.
*   **Ações:**
    *   Move o card para `board_descoberto.mapeamento_estados.inicio_desenvolvimento`.
    *   Cria subtarefas (se `criar_subtarefas_automaticamente: true`).
    *   Vincula a branch ao card.
*   **Ferramentas:** `github-mcp-server-issue_read`, `github-mcp-server-issue_add_comment`, ferramentas de atualização de status (MCPs).
*   **Condições de Saída:** Card atualizado no rastreador.

### Etapa 4: Execução do Código (Executor)
*   **Delegado a:** Agente Executor de Código (`executor`).
*   **Entradas:** `historia.md`, `plano.md`, `arquitetura.md` (se existir), código-fonte.
*   **Ações:**
    *   Lê e interpreta os planos.
    *   Edita/cria arquivos de código-fonte conforme `plano.md`.
    *   Cria/atualiza testes unitários.
*   **Ferramentas:** `view`, `edit` (arquivos de código), `grep`.
*   **Condições de Saída:** Arquivos modificados/criados, testes unitários implementados.

### Etapa 5: Validação de Qualidade (Validador)
*   **Delegado a:** Agente Validador de Qualidade (`validador`).
*   **Entradas:** Código-fonte modificado, `config-modelo.md`, `historia.md`, `plano.md`.
*   **Ações:**
    *   Executa `comandos.build` e `comandos.testes_unitarios`.
    *   Verifica linter (`comandos.linter` se configurado).
    *   Verifica cobertura de código.
    *   Valida contratos de API (se `gateway_api.verificar_contratos: true`).
    *   Gera relatório de validação.
    *   **Loop de Correção:** Se houver falhas, notifica o Orquestrador, que retorna ao `Executor` para correção, respeitando `tolerancia_falhas.max_tentativas_build_validacao`. Se o limite for atingido, escala para o usuário.
*   **Ferramentas:** `powershell` (para build, testes, linter), `ask_user` (para escalada).
*   **Condições de Saída:** Relatório de validação (APROVADO/REPROVADO), ciclo de correção concluído ou escalado.

### Etapa 6a: Testes de Aceite (Especialista em Testes de Aceite - Condicional)
*   **Delegado a:** Agente Especialista em Testes de Aceite (`especialista-testes-aceite`).
*   **Entradas:** `historia.md`, `config-modelo.md`, pacote de testes de aceite.
*   **Condição de Execução:** Somente se `testes_aceite.ativo: true`.
*   **Ações:**
    *   Traduz critérios de aceite em cenários BDD/manuais.
    *   Gera pacote de testes de aceite.
    *   Executa `checar-quality-gate <CHAVE>` (internamente).
*   **Ferramentas:** `view`, `edit` (arquivos de teste gerados), ferramentas de integração de testes (se houver MCP).
*   **Condições de Saída:** Pacote de testes de aceite gerado, Quality Gate aprovado/reprovado.

### Etapa 6b: Quality Gate / SonarQube (Condicional)
*   **Delegado a:** Agente Validador de Qualidade (`validador`).
*   **Entradas:** Código-fonte, `config-modelo.md`.
*   **Condição de Execução:** Somente se `qualidade.sonar.obrigatorio: true` ou `qualidade.medir_com_pipeline: true`.
*   **Ações:**
    *   Integra com SonarQube para análise.
    *   Verifica se os thresholds do Quality Gate foram atingidos.
*   **Ferramentas:** `powershell` (para comandos Sonar/pipeline).
*   **Condições de Saída:** Status do Quality Gate.

### Etapa 6c: QA (Analista de Qualidade - Condicional)
*   **Delegado a:** Agente Analista de Qualidade (`qa`).
*   **Entradas:** `historia.md`, `config-modelo.md`, pacote de testes de aceite.
*   **Condição de Execução:** Somente se `qa.ativo: true` e `tarefa_sem_qa` for `false`.
*   **Ações:**
    *   Executa validações em ambiente de homologação.
    *   Testa fluxos, casos de borda e regressão.
    *   Identifica e detalha bugs.
    *   Gera `qa.md` com status (APROVADO/REPROVADO).
*   **Ferramentas:** `powershell` (para execução de testes automatizados se houver), `view` (logs), `edit` (qa.md), `ask_user` (se precisar de input manual de QA).
*   **Condições de Saída:** Relatório de QA gerado.

### Etapa 7: Geração de Commits (Especialista em Commits)
*   **Delegado a:** Agente Especialista em Commits e Versionamento (`especialista-commits`).
*   **Entradas:** Arquivos modificados, `config-modelo.md`, nome da branch.
*   **Ações:**
    *   Verifica a branch.
    *   Agrupa alterações em commits atômicos (`Conventional Commits`).
    *   Prepara título e descrição do Pull Request.
*   **Ferramentas:** `GitKraken-git_add`, `GitKraken-git_commit`, `GitKraken-git_status`.
*   **Condições de Saída:** Commits criados localmente, PR pronta para envio.

### Etapa 8: Push Autorizado, PR e Fechamento (Orquestrador)
*   **Ações:**
    *   Solicita autorização explícita do usuário para o `git push` via modal.
    *   Executa `git push`.
    *   Abre Pull Request (via MCP ou CLI).
    *   Invoca o `Sincronizador` para mover o card para `concluido` e registrar o comentário padrão de conclusão.
*   **Ferramentas:** `ask_user`, `GitKraken-git_push`, `github-mcp-server-list_pull_requests`, `github-mcp-server-pull_request_create` (ou ferramentas de MCP correspondentes).
*   **Condições de Saída:** Push realizado, PR aberta, card concluído no rastreador.

### Relatório Final (Orquestrador)
*   **Ações:** Exibe um resumo executivo da tarefa, incluindo:
    *   História/Issue
    *   Branch
    *   PR criado (link)
    *   Cobertura alcançada
    *   Status do Quality Gate
    *   Aprendizados registrados (de `.fluxo/aprendizados.md`)
    *   Link do card rastreador
*   **Ferramentas:** `view` (para ler relatórios gerados).

## Mecanismos de Orquestração

O Agente Orquestrador será responsável por:
*   Gerenciar o fluxo sequencial e condicional das etapas.
*   Interagir com o usuário via `ask_user` para aprovações ou inputs críticos.
*   Delegar tarefas aos agentes especializados usando a ferramenta `task` ou chamadas `@agente` (dependendo do ambiente).
*   Monitorar o estado e o resultado de cada agente para determinar o próximo passo.
*   Tratar falhas, incluindo o loop de correção e a escalada para o usuário quando os limites de tolerância são atingidos.
*   Manter um log de auditoria das ações e decisões.

Este plano visa ser um guia abrangente para a implementação do fluxo automatizado.
