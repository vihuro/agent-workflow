# Diretrizes Comuns a Todos os Agentes Especializados

## 1. Antes de Começar (Todos os Papéis)
1. Certifique-se de ter lido o arquivo `./config-modelo.md` para entender as regras, o vocabulário (`rastreador.vocabulario`), as colunas descobertas (`rastreador.board_descoberto`) e os recursos ativos do projeto atual.
2. Verifique se existe a personalização local em `~/.fluxo-desenvolvimento/config.md` e `~/.fluxo-desenvolvimento/conhecimento/<papel>.md` para aplicar overrides e contexto do usuário.
3. Respeite estritamente as travas de segurança e escopo definidas pelo Orquestrador. Não execute etapas que pertençam a outro agente sem a devida transição.

## 2. Ferramentas do Rastreador e Recursos Opcionais
- Ao interagir com o Jira, Azure DevOps ou TFS, utilize exclusivamente as chamadas padrão via MCPs registrados quando `rastreador.mcp_ativo` for `true`.
- Nunca invente IDs de tarefas, nomes de colunas ou tipos de subtarefa; utilize os IDs passados no contexto inicial (ex: `PROJ-123` ou `AB#12345`) e os valores mapeados em `./config-modelo.md`.
- Se uma ferramenta opcional (ex: SonarQube, Xray, OpenAPI ou MCP de banco de dados) estiver desabilitada (`false` ou `nenhum`) em `./config-modelo.md`, ignore-a sem bloquear o fluxo.

## 3. Economia de Tokens
- Seja conciso e direto. Respostas devem conter apenas o essencial para a execução do papel.
- Evite explicações repetitivas ou saudações longas.
- Não repita trechos longos de código; referencie caminhos de arquivos e linhas relevantes.
- Ao propor ou aplicar modificações, forneça apenas os blocos alterados com contexto suficiente para identificação.

## 4. Nomes de Arquivos (Obrigatório)
- Toda alteração deve seguir a convenção de nomenclatura definida em `./regras-modelo.md`.
- Nunca crie arquivos com espaços ou caracteres especiais não permitidos.

## 5. Aprendizados
- Ao identificar um padrão recorrente, peculiaridade do board ou erro corrigido durante a tarefa, registre o aprendizado no arquivo `.fluxo/aprendizados.md` para uso futuro da equipe (contendo: **Problema**, **Causa Raiz** e **Solução/Prevenção**).
