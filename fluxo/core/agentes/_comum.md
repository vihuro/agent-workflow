# Diretrizes Comuns a Todos os Agentes Especializados

## 1. Antes de Começar (Todos os Papéis)
1. Leia `.fluxo/config-modelo.md` e `.fluxo/regras-modelo.md` na raiz do repositório de trabalho (caso ainda não existam no repositório, consulte `~/.fluxo-desenvolvimento/config.md` ou os arquivos padrão empacotados no plugin em `referencias/config-modelo.md` e `referencias/regras-modelo.md`).
2. **Consumo Obrigatório de Aprendizados da Squad:** Leia `.fluxo/aprendizados.md` (se existir no repositório) e `~/.fluxo-desenvolvimento/conhecimento/<papel>.md` (se existir) **antes** de executar sua tarefa, aplicando padrões, convenções e soluções de problemas já descobertos anteriormente pela squad.
3. Respeite estritamente as travas de segurança e escopo definidas pelo Orquestrador. Não execute etapas que pertençam a outro agente sem a devida transição.

## 2. Entrada Flexível (Com Card ou Por Descrição Livre) e Ferramentas do Rastreador
- **Tarefa com Card/Link (`PROJ-123`, `AB#12345`, URL) e `rastreador.mcp_ativo: true`:** Interaja com Jira, Azure DevOps, TFS ou GitHub Issues exclusivamente via MCPs registrados, respeitando `rastreador.vocabulario` e `rastreador.board_descoberto`.
- **Tarefa por Descrição Livre (Sem Link / Sem Card no Rastreador):** O fluxo **não exige** obrigatoriamente um link ou ID de tarefa para funcionar. Quando o usuário fornecer apenas uma descrição textual da demanda (para adiantar desenvolvimento ou trabalhar sem atividade no board), utilize o identificador local atribuído pelo Orquestrador (ex: `LOCAL-<slug>`) e execute todas as etapas técnicas normalmente, ignorando chamadas externas ao rastreador sem bloquear o fluxo.
- Se uma ferramenta opcional (SonarQube, Xray, OpenAPI ou MCP de banco de dados) estiver desabilitada (`false` ou `nenhum`) em `.fluxo/config-modelo.md`, ignore-a sem bloquear o fluxo.

## 3. Execução de Comandos e Ferramentas de Sistema
- Os papéis com permissão de execução (`Orquestrador`, `Executor`, `Validador`, `QA`, `Especialista em Commits`) têm acesso às ferramentas de terminal da máquina (`PowerShell` no Windows / `Bash` no Linux e macOS) para rodar builds, testes, linters, inspeções e comandos Git necessários à tarefa.

## 4. Economia de Tokens e Nomes de Arquivos
- Seja conciso e direto: não repita trechos longos de código; referencie caminhos de arquivos e linhas relevantes.
- Toda criação ou alteração de arquivo deve seguir a convenção de nomenclatura definida em `.fluxo/regras-modelo.md`, sem espaços ou caracteres especiais não permitidos.

## 5. Registro de Aprendizados e Rastreabilidade de Execução
- Ao identificar um padrão recorrente do repositório, peculiaridade do board ou erro corrigido durante a tarefa, **leia e atualize** `.fluxo/aprendizados.md` (contendo: **Contexto/Papel**, **Problema**, **Causa Raiz** e **Solução/Prevenção**) para que os próximos agentes da squad consumam esse conhecimento automaticamente.
- Salve sempre o artefato de saída do seu papel (`historia.md`, `plano.md`, `arquitetura.md`, `validacao.md`, `testes-aceite.md`, `qa.md`) no diretório da execução ativa informado pelo Orquestrador (`.fluxo/execucoes/<ID-TAREFA>/`) e devolva um resumo executivo objetivo para que o Orquestrador atualize o painel `.fluxo/status-atual.md`.
