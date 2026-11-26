// Commands & Rules Cursor
  const cmdConfigurarCursor = `${AVISO_GERADO}# Configurar Fluxo de Desenvolvimento

Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\` (referências: \`.fluxo/config-modelo.md\`, \`.fluxo/regras-modelo.md\`, \`.fluxo/mcps.md\`).

## Regra Obrigatória de Interação
- Sempre que precisar fazer perguntas ao usuário (Blocos A a I), **use obrigatoriamente a ferramenta interativa de perguntas (\`AskUserQuestion\`)**, um bloco por vez, aguardando a seleção/resposta antes de avançar para o próximo bloco.
- Não despeje perguntas em texto corrido no chat encerrando o turno.
- Nunca grave tokens ou senhas no Git.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'configurar-fluxo.md'),
    cmdConfigurarCursor
  );

  const cmdOrquestradorCursor = `${AVISO_GERADO}# Orquestrador de Desenvolvimento

1. Se \`.fluxo/config-modelo.md\` não existir, invoque \`AskUserQuestion\` perguntando se deseja executar \`/configurar-fluxo\` agora.
2. Leia e siga \`.fluxo/playbook-orquestrador.md\` como sessão principal.
3. Use \`AskUserQuestion\` para todas as confirmações obrigatórias (escopo inicial, ambiguidades do PO e autorização antes de \`git push\`).
4. Delegue cada papel aos subagentes (\`Task\`) seguindo as definições em \`.fluxo/agentes/\` sem parar o fluxo entre etapas automáticas.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'orquestrador-desenvolvimento.md'),
    cmdOrquestradorCursor
  );

  // Claude Code Skills
  const skillConfigurarClaude = `---
name: configurar-fluxo
description: Configura o fluxo de desenvolvimento no repositório atual (.fluxo/config-modelo.md)
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
---
${AVISO_GERADO}Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\` (ou \`fluxo/core/configurar-fluxo.md\`).

## Comportamento Interativo Obrigatório
- Para cada bloco de perguntas (Blocos A a I), **invoque obrigatoriamente a ferramenta \`AskUserQuestion\`** com opções objetivas sempre que aplicável (ex: Jira vs Azure DevOps, Xray vs Azure Test Plans vs Nenhum).
- Faça um bloco por vez, aguarde o retorno da ferramenta \`AskUserQuestion\` e só finalize após gravar \`.fluxo/config-modelo.md\`.
- Nunca grave segredos em arquivos rastreados pelo Git.
`;
  escreverArquivo(
    path.join(DIR_PLUGINS, 'skills', 'configurar-fluxo', 'SKILL.md'),
    skillConfigurarClaude
  );

  const skillOrquestradorClaude = `---
name: orquestrador-desenvolvimento
description: Orquestra o fluxo completo de desenvolvimento de uma história (PO, planejador, arquiteto, executor, validador, testes de aceite, QA, commits e rastreador)
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, TodoWrite, AskUserQuestion
---
${AVISO_GERADO}Atue como Orquestrador seguindo \`.fluxo/playbook-orquestrador.md\` (ou \`fluxo/core/playbook-orquestrador.md\`).

## Regras de Execução e Interação
- Crie a lista de etapas (0 a 8) usando \`TodoWrite\` logo no início para manter o progresso rastreado.
- Sempre que precisar de confirmação ou decisão humana (confirmação da chave da tarefa, dúvidas de negócio do PO, aprovação de plano ou autorização antes de \`git push\`), **use obrigatoriamente a ferramenta \`AskUserQuestion\`** para abrir a janela interativa de resposta.
- Delegue cada etapa especializada usando a ferramenta \`Task\` (subagentes \`po\`, \`planejador\`, \`arquiteto\`, \`executor\`, \`validador\`, \`especialista-testes-aceite\`, \`qa\`, \`sincronizador-tarefas\`, \`especialista-commits\`) e continue o loop automaticamente até a conclusão ou próxima barreira humana.
`;
  escreverArquivo(
    path.join(DIR_PLUGINS, 'skills', 'orquestrador-desenvolvimento', 'SKILL.md'),
    skillOrquestradorClaude
  );