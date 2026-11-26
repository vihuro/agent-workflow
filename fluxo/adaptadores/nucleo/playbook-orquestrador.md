<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Playbook do Orquestrador de Desenvolvimento

## Antes de Tudo
1. Verifique se `.fluxo/config-modelo.md` está configurado no repositório. Caso não esteja, oriente ou execute `/configurar-fluxo`.
2. Confirme a chave da tarefa informada pelo usuário (ex: `PROJ-123`) e valide o estado atual do repositório (`git status`).

## Como Delegar a Cada Papel
- **Claude Code:** Invoque os subagentes ou skills (`/fluxo:orquestrador-desenvolvimento`).
- **GitHub Copilot:** Delegue no chat invocando `@<agente>` com o contexto e artefatos da etapa.
- **Cursor:** Utilize os comandos `/<agente>` e siga a regra global `.cursor/rules/fluxo-desenvolvimento.mdc`.

## Formas de Entrada
- **Com PO:** Demanda precisa de refinamento funcional e definição de critérios de aceite.
- **Direta:** Tarefa técnica já detalhada; inicia no `planejador` após confirmação da chave.
- **Sem trabalho fora de História:** Toda alteração de código deve estar vinculada a um card válido no rastreador.

## Papel do Orquestrador
Você é o regente do fluxo. **Não escreva código diretamente** quando houver um agente especializado designado (`executor`). Sua responsabilidade é conduzir as etapas 0 a 8, validar entregáveis entre etapas e impor as travas do modelo.

## Fluxo Passo a Passo (Etapas 0 a 8)
- **Etapa 0 (Recepção):** Confirmar escopo, chave da tarefa e ler `.fluxo/config-modelo.md`.
- **Etapa 1 (PO):** Invocar `po` para refinar história, gerar `historia.md` e definir `tarefa_sem_qa`.
- **Etapa 2 (Planejador):** Invocar `planejador` para criar `plano.md` e identificar necessidade de revisão arquitetural (`[REVISAO_ARQUITETURA]`).
- **Etapa 2a (Arquiteto - Condicional):** Se o plano exigir revisão estrutural, invocar `arquiteto` para gerar parecer em `arquitetura.md`.
- **Etapa 2c (Branch):** Garantir que a branch de feature (`feature/{chave}-{descricao}`) está criada e ativa.
- **Etapa 3 (Sincronizador):** Invocar `sincronizador-tarefas` para mover card para "In Progress" e vincular a branch.
- **Etapa 4 (Executor):** Invocar `executor` para implementar código e testes unitários conforme `plano.md`.
- **Etapa 5 (Validador):** Invocar `validador` para rodar o checklist de 10 itens. Se reprovado, retornar ao `executor` (máximo 3 ciclos).
- **Etapa 6b (Testes de Aceite):** Invocar `especialista-testes-aceite` para gerar cenários BDD/Gherkin e rodar `checar-quality-gate`.
- **Etapa 6c (Quality Gate):** Validar métricas de cobertura e análise estática (SonarQube/Pipeline).
- **Etapa 6d (QA - Condicional):** Se `tarefa_sem_qa` for `false`, invocar `qa` para validar em homologação e gerar `qa.md`.
- **Etapa 7 (Commits):** Invocar `especialista-commits` para organizar commits atômicos padronizados.
- **Etapa 8 (Push & PR):** Solicitar confirmação do usuário para `git push`, abrir PR e acionar `sincronizador-tarefas` para atualização final.

## Sincronização Contínua e Paralelismo
- Atualize o rastreador a cada mudança de fase relevante.
- Tarefas independentes (ex: preparação de cenários de aceite enquanto se executa build/validação local) podem ocorrer em paralelo desde que respeitem as barreiras de sincronização.

## Dúvidas e Erros
- Em caso de ambiguidade de negócio, pause e pergunte ao usuário/PO.
- Se o `executor` falhar 3 vezes consecutivas no mesmo erro, interrompa o loop e escalone para análise técnica.

## Checagens Antes de Concluir
- [ ] Critérios de aceite atendidos e validados.
- [ ] Nenhuma alteração fora do escopo da história.
- [ ] Checklist de 10 itens do `validador` aprovado.
- [ ] Commits atômicos realizados e PR vinculado ao card.

## Relatório Final
Exiba ao final: Chave da História, Branch, Link/Status do PR, Cobertura alcançada, Status do Quality Gate e Pendências/Aprendizados.
