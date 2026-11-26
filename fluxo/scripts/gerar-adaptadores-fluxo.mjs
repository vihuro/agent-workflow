#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAIZ_PROJETO = path.resolve(__dirname, '..', '..');
const DIR_CORE = path.join(RAIZ_PROJETO, 'fluxo', 'core');
const DIR_ADAPTADORES = path.join(RAIZ_PROJETO, 'fluxo', 'adaptadores');
const DIR_PLUGINS = path.join(RAIZ_PROJETO, 'plugins', 'fluxo');

const AVISO_GERADO = '<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->\n\n';

function lerArquivo(caminho) {
  return fs.readFileSync(caminho, 'utf-8');
}

function escreverArquivo(caminho, conteudo) {
  fs.mkdirSync(path.dirname(caminho), { recursive: true });
  fs.writeFileSync(caminho, conteudo, 'utf-8');
}

function limparDiretorio(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function compilar() {
  const versaoJson = JSON.parse(lerArquivo(path.join(RAIZ_PROJETO, 'fluxo', 'versao.json')));
  const versao = versaoJson.versao;

  const conteudoComum = lerArquivo(path.join(DIR_CORE, 'agentes', '_comum.md'));
  const dirAgentesCore = path.join(DIR_CORE, 'agentes');
  const arquivosAgentes = fs.readdirSync(dirAgentesCore)
    .filter((f) => f.endsWith('.md') && f !== '_comum.md')
    .sort();

  // Limpar saídas geradas
  limparDiretorio(path.join(DIR_ADAPTADORES, 'nucleo'));
  limparDiretorio(path.join(DIR_ADAPTADORES, 'copilot'));
  limparDiretorio(path.join(DIR_ADAPTADORES, 'cursor'));
  limparDiretorio(path.join(DIR_PLUGINS, 'agents'));
  limparDiretorio(path.join(DIR_PLUGINS, 'skills'));

  for (const arquivo of arquivosAgentes) {
    const nomeBase = path.basename(arquivo, '.md');
    const conteudoAgente = lerArquivo(path.join(dirAgentesCore, arquivo));
    const conteudoCompleto = `${AVISO_GERADO}${conteudoAgente.trim()}\n\n---\n\n${conteudoComum.trim()}\n`;

    // 1. Núcleo
    escreverArquivo(path.join(DIR_ADAPTADORES, 'nucleo', 'agentes', arquivo), conteudoCompleto);

    // 2. Claude Code Plugin Agents
    const frontmatterClaude = `---\nname: ${nomeBase}\ndescription: Agente especializado em ${nomeBase} do fluxo de desenvolvimento orquestrado.\n---\n\n`;
    escreverArquivo(path.join(DIR_PLUGINS, 'agents', arquivo), frontmatterClaude + conteudoCompleto);

    // 3. GitHub Copilot Agents
    const frontmatterCopilot = `---\ndescription: Agente especializado em ${nomeBase} para o fluxo de desenvolvimento.\n---\n\n`;
    escreverArquivo(
      path.join(DIR_ADAPTADORES, 'copilot', '.github', 'agents', `${nomeBase}.agent.md`),
      frontmatterCopilot + conteudoCompleto
    );
  }

  // Copiar arquivos base do core para adaptadores/nucleo
  const arquivosBase = [
    'config-modelo.md',
    'configurar-fluxo.md',
    'mcps.md',
    'playbook-orquestrador.md',
    'regras-modelo.md'
  ];

  for (const arq of arquivosBase) {
    const cont = lerArquivo(path.join(DIR_CORE, arq));
    escreverArquivo(path.join(DIR_ADAPTADORES, 'nucleo', arq), AVISO_GERADO + cont);
  }

  escreverArquivo(path.join(DIR_ADAPTADORES, 'nucleo', 'VERSAO'), `${versao}\n`);

  // Prompts Copilot (.github/prompts/)
  const promptConfigurarCopilot = `---
mode: agent
description: Configura o fluxo de desenvolvimento no repositório (.fluxo/config-modelo.md)
tools: ['codebase', 'editFiles', 'askQuestions']
---
${AVISO_GERADO}Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\`.

## Regra Obrigatória de Interação
- Execute **UM bloco por vez** (Blocos A a I).
- Use obrigatoriamente a ferramenta \`askQuestions\` (ou pergunte com opções objetivas e pare o turno aguardando resposta) antes de avançar para o próximo bloco.
- Nunca despeje todos os blocos de uma vez e nunca grave segredos no Git.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'copilot', '.github', 'prompts', 'configurar-fluxo.prompt.md'),
    promptConfigurarCopilot
  );

  const promptOrquestradorCopilot = `---
mode: agent
description: Orquestra o fluxo completo de desenvolvimento de uma história ou tarefa (PO, planejador, arquiteto, executor, validador, TA, QA, commits e rastreador)
tools: ['codebase', 'editFiles', 'runCommands', 'askQuestions']
---
${AVISO_GERADO}# Orquestrador de Desenvolvimento

1. Se \`.fluxo/config-modelo.md\` não existir, use \`askQuestions\` perguntando se deseja executar \`/configurar-fluxo\` agora.
2. Leia e siga \`.fluxo/playbook-orquestrador.md\` como sessão principal.
3. Use \`askQuestions\` para confirmações obrigatórias (escopo inicial, ambiguidades do PO e autorização antes de \`git push\`).
4. Delegue cada etapa ao agente especializado correspondente (\`@po\`, \`@planejador\`, \`@arquiteto\`, \`@executor\`, \`@validador\`, \`@especialista-testes-aceite\`, \`@qa\`, \`@sincronizador-tarefas\`, \`@especialista-commits\`).
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'copilot', '.github', 'prompts', 'orquestrador-desenvolvimento.prompt.md'),
    promptOrquestradorCopilot
  );

  // Commands & Rules Cursor (.cursor/)
  const cmdConfigurarCursor = `${AVISO_GERADO}# Configurar Fluxo de Desenvolvimento

Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\`.

## Regra Obrigatória de Interação
- Execute **UM bloco por vez** (Blocos A a I).
- Sempre que precisar fazer perguntas ao usuário, **use obrigatoriamente a ferramenta interativa \`AskQuestion\`** do Cursor, aguardando a seleção/resposta antes de avançar para o próximo bloco.
- Não despeje perguntas em texto corrido no chat encerrando o turno.
- Nunca grave tokens ou senhas no Git.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'configurar-fluxo.md'),
    cmdConfigurarCursor
  );

  const cmdOrquestradorCursor = `${AVISO_GERADO}# Orquestrador de Desenvolvimento

1. Se \`.fluxo/config-modelo.md\` não existir, invoque \`AskQuestion\` perguntando se deseja executar \`/configurar-fluxo\` agora.
2. Leia e siga \`.fluxo/playbook-orquestrador.md\` como sessão principal.
3. Use \`AskQuestion\` para todas as confirmações obrigatórias (escopo inicial, ambiguidades do PO e autorização antes de \`git push\`).
4. Delegue cada papel aos subagentes (\`Task\`) seguindo as definições em \`.fluxo/agentes/\` sem parar o fluxo entre etapas automáticas.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'orquestrador-desenvolvimento.md'),
    cmdOrquestradorCursor
  );

  const ruleCursor = `---
description: Regras do fluxo de desenvolvimento orquestrado (agent-workflow)
alwaysApply: true
---
${AVISO_GERADO}Quando o usuário iniciar desenvolvimento de história/tarefa ou invocar \`/orquestrador-desenvolvimento\` ou \`/configurar-fluxo\`, siga rigorosamente \`.fluxo/playbook-orquestrador.md\`, \`.fluxo/regras-modelo.md\` e os agentes em \`.fluxo/agentes/\`. Use \`AskQuestion\` sempre que precisar de confirmação ou input do usuário (um bloco por vez), delegue papéis via \`Task\`, nunca faça commit direto na main/master e nunca execute git push sem aprovação explícita.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'rules', 'fluxo-desenvolvimento.mdc'),
    ruleCursor
  );

  // Claude Code Skills (plugins/fluxo/skills/)
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

  // README do plugin Claude
  const readmePlugin = `${AVISO_GERADO}# Plugin Fluxo (Claude Code)

Plugin multi-agente para orquestração de desenvolvimento padronizado.

## Instalação
\`\`\`bash
claude plugin add --scope user ./plugins/fluxo
\`\`\`

## Comandos / Skills
- \`/fluxo:configurar-fluxo\`
- \`/fluxo:orquestrador-desenvolvimento <CHAVE-TAREFA>\`
`;
  escreverArquivo(path.join(DIR_PLUGINS, 'README.md'), readmePlugin);

  console.log(`[BUILD] Adaptadores gerados com sucesso para a versão ${versao}.`);
}

compilar();