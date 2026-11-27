<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Observabilidade e Monitoramento da Squad (`/status-fluxo`)

Procedimento para inspeção em tempo real e auditoria do que cada agente da squad está executando ou já executou no repositório.

---

## 1. Estrutura de Rastreamento e Painel Ao Vivo

Durante toda execução do `/orquestrador-desenvolvimento`, o Orquestrador mantém dois recursos sincronizados em `.fluxo/`:

1. **Painel Ao Vivo (`.fluxo/status-atual.md`):**
   - Dashboard atualizado a cada início e término de etapa.
   - Pode ser mantido aberto no editor (VS Code / Cursor) com *Markdown Preview* para acompanhar a squad em tempo real.
2. **Diretório da Execução (`.fluxo/execucoes/<ID-TAREFA>/`):**
   - Armazena os artefatos produzidos pelos agentes na tarefa ativa:
     - `historia.md` (Product Owner)
     - `plano.md` (Planejador Técnico)
     - `arquitetura.md` (Arquiteto — quando acionado)
     - `validacao.md` (Validador — checklist de 10 itens e tentativas)
     - `testes-aceite.md` (Especialista em Testes de Aceite — quando acionado)
     - `qa.md` (Analista de QA — quando acionado)

---

## 2. Formato Obrigatório do Painel (`.fluxo/status-atual.md`)

```markdown
# Painel de Execução da Squad Agêntica

- **Tarefa / Demanda:** `<CHAVE ou LOCAL-slug>` — <Título curto>
- **Modo de Entrada:** `Card Rastreador` | `Descrição Livre (Sem Card)`
- **Branch Ativa:** `<nome-da-branch>`
- **Status Geral:** `🔄 EM EXECUÇÃO` | `⏸️ AGUARDANDO USUÁRIO (MODAL)` | `✅ CONCLUÍDO` | `❌ BLOQUEADO`
- **Agente Ativo Agora:** `<Nome do Agente>` (Etapa `<X>`)
- **Tentativas Build/Validação:** `<atual>/<max>`
- **Última Atualização:** `<YYYY-MM-DD HH:mm:ss>`

## Progresso dos Agentes da Squad

| Etapa | Agente | Status | Duração / Tentativa | Artefato / Saída Principal |
| :--- | :--- | :---: | :---: | :--- |
| **0. Triagem** | Orquestrador | ✅ Concluído | - | Escopo confirmado e aprendizados lidos |
| **1. Requisitos** | Product Owner (`po`) | ✅ Concluído | - | `.fluxo/execucoes/<ID>/historia.md` (`tarefa_sem_qa: false`) |
| **2. Planejamento** | Planejador (`planejador`) | ✅ Concluído | - | `.fluxo/execucoes/<ID>/plano.md` |
| **2a. Arquitetura** | Arquiteto (`arquiteto`) | ⏭️ Pulado | - | Sem `[REVISAO_ARQUITETURA]` |
| **3. Rastreador** | Sincronizador (`sincronizador-tarefas`) | ✅ Concluído | - | Card movido / Branch vinculada |
| **4. Implementação** | Executor (`executor`) | 🔄 Em execução | Tentativa 1/3 | Editando arquivos e testes unitários |
| **5. Auditoria** | Validador (`validador`) | ⏳ Pendente | - | `.fluxo/execucoes/<ID>/validacao.md` |
| **6b. Testes Aceite** | Esp. Testes Aceite (`especialista-testes-aceite`) | ⏳ Pendente | - | Condicional (`testes_aceite.ativo`) |
| **6d. Homologação** | QA (`qa`) | ⏳ Pendente | - | `.fluxo/execucoes/<ID>/qa.md` |
| **7. Versionamento** | Esp. Commits (`especialista-commits`) | ⏳ Pendente | - | Commits atômicos e corpo da PR |
| **8. Entrega** | Orquestrador + Sincronizador | ⏳ Pendente | - | Push autorizado e Pull Request |

## Linha do Tempo (Log de Eventos da Squad)

- `[HH:mm:ss]` **Orquestrador:** Início da execução para `<ID>`. Lidos `.fluxo/config-modelo.md` e `.fluxo/aprendizados.md`.
- `[HH:mm:ss]` **PO (`po`):** Gerou `historia.md` com 3 critérios BDD.
- `[HH:mm:ss]` **Planejador (`planejador`):** Gerou `plano.md` (4 arquivos mapeados, branch `feature/...`).
- `[HH:mm:ss]` **Executor (`executor`):** Iniciou implementação do código e testes (Tentativa 1/3).
```

---

## 3. Como Executar o Comando `/status-fluxo`

Quando o usuário invocar `/status-fluxo` (ou `/fluxo:status-fluxo` no Claude Code):
1. Leia `.fluxo/status-atual.md` (se existir) e liste os diretórios em `.fluxo/execucoes/` (se existirem).
2. Verifique também `git status --short` e `git branch --show-current` para cruzar o estado real do repositório com o painel.
3. Apresente ao usuário um resumo claro contendo:
   - **Tarefa ativa, branch atual, agente em execução (ou última etapa concluída) e contador de tentativas do loop Executor → Validador.**
   - **Tabela resumida das etapas** e links clicáveis para os artefatos gerados em `.fluxo/execucoes/<ID-TAREFA>/`.
   - **Últimos 5 eventos da Linha do Tempo** e, se houver algum bloqueio ou modal pendente, qual ação é esperada.
4. Caso `.fluxo/status-atual.md` ainda não exista no repositório, informe que nenhuma execução ativa foi iniciada e mostre como iniciar com `/orquestrador-desenvolvimento <CARD ou DESCRIÇÃO>`.
