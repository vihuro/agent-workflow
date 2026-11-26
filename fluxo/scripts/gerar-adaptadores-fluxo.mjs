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

const AVISO_GERADO = '<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

';

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
    const conteudoCompleto = `${AVISO_GERADO}${conteudoAgente.trim()}

---

${conteudoComum.trim()}
`;

    // 1. Núcleo
    escreverArquivo(path.join(DIR_ADAPTADORES, 'nucleo', 'agentes', arquivo), conteudoCompleto);

    // 2. Claude Code Plugin Agents
    const frontmatterClaude = `---
name: ${nomeBase}
description: Agente especializado em ${nomeBase} do fluxo de desenvolvimento orquestrado.
---

`;
    escreverArquivo(path.join(DIR_PLUGINS, 'agents', arquivo), frontmatterClaude + conteudoCompleto);

    // 3. GitHub Copilot Agents
    const frontmatterCopilot = `---
description: Agente especializado em ${nomeBase} para o fluxo de desenvolvimento.
---

`;
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

  escreverArquivo(path.join(DIR_ADAPTADORES, 'nucleo', 'VERSAO'), `${versao}
`);

  // Prompts Copilot
  const promptConfigurarCopilot = `---
description: Configura o fluxo de desenvolvimento no repositório (.fluxo/config-modelo.md)
---
${AVISO_GERADO}Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\` (referências: \`.fluxo/config-modelo.md\`, \`.fluxo/regras-modelo.md\`, \`.fluxo/mcps.md\`). Faça as perguntas em blocos, um bloco por vez. Nunca grave tokens ou senhas no Git.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'copilot', '.github', 'prompts', 'configurar-fluxo.prompt.md'),
    promptConfigurarCopilot
  );

  const promptOrquestradorCopilot = `---
description: Orquestra o fluxo completo de desenvolvimento de uma história ou tarefa (PO, planejador, arquiteto, executor, validador, TA, QA, commits e rastreador)
---
${AVISO_GERADO}# Orquestrador de Desenvolvimento

1. Se \`.fluxo/config-modelo.md\` não existir, peça para executar \`/configurar-fluxo\` antes.
2. Leia e siga \`.fluxo/playbook-orquestrador.md\` como sessão principal.
3. Delegue cada etapa ao agente especializado correspondente (\`@po\`, \`@planejador\`, \`@arquiteto\`, \`@executor\`, \`@validador\`, \`@especialista-testes-aceite\`, \`@qa\`, \`@sincronizador-tarefas\`, \`@especialista-commits\`).
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'copilot', '.github', 'prompts', 'orquestrador-desenvolvimento.prompt.md'),
    promptOrquestradorCopilot
  );

  // Commands & Rules Cursor
  const cmdConfigurarCursor = `${AVISO_GERADO}# Configurar Fluxo de Desenvolvimento

Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\` (referências: \`.fluxo/config-modelo.md\`, \`.fluxo/regras-modelo.md\`, \`.fluxo/mcps.md\`). Faça as perguntas em blocos, um bloco por vez. Nunca grave tokens ou senhas no Git.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'configurar-fluxo.md'),
    cmdConfigurarCursor
  );

  const cmdOrquestradorCursor = `${AVISO_GERADO}# Orquestrador de Desenvolvimento

1. Se \`.fluxo/config-modelo.md\` não existir, execute \`/configurar-fluxo\` antes.
2. Leia e siga \`.fluxo/playbook-orquestrador.md\` como sessão principal.
3. Delegue cada papel aos agentes definidos em \`.fluxo/agentes/\` conforme o playbook.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'orquestrador-desenvolvimento.md'),
    cmdOrquestradorCursor
  );

  const ruleCursor = `---
description: Regras do fluxo de desenvolvimento orquestrado (agent-workflow)
alwaysApply: true
---
${AVISO_GERADO}Quando o usuário iniciar desenvolvimento de história/tarefa ou invocar \`/orquestrador-desenvolvimento\` ou \`/configurar-fluxo\`, siga rigorosamente \`.fluxo/playbook-orquestrador.md\`, \`.fluxo/regras-modelo.md\` e os agentes em \`.fluxo/agentes/\`. Nunca faça commit direto na main/master e nunca execute git push sem aprovação explícita.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'rules', 'fluxo-desenvolvimento.mdc'),
    ruleCursor
  );

  // Claude Code Skills
  const skillConfigurarClaude = `---
name: configurar-fluxo
description: Configura o fluxo de desenvolvimento no repositório atual (.fluxo/config-modelo.md)
---
${AVISO_GERADO}Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\` (ou \`fluxo/core/configurar-fluxo.md\`). Faça as perguntas em blocos, um bloco por vez. Nunca grave segredos em arquivos rastreados pelo Git.
`;
  escreverArquivo(
    path.join(DIR_PLUGINS, 'skills', 'configurar-fluxo', 'SKILL.md'),
    skillConfigurarClaude
  );

  const skillOrquestradorClaude = `---
name: orquestrador-desenvolvimento
description: Orquestra o fluxo completo de desenvolvimento de uma história (PO, planejador, arquiteto, executor, validador, testes de aceite, QA, commits e rastreador)
---
${AVISO_GERADO}Atue como Orquestrador seguindo \`.fluxo/playbook-orquestrador.md\` (ou \`fluxo/core/playbook-orquestrador.md\`). Delegue cada etapa aos subagentes especializados do plugin \`fluxo\`.
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
claude plugin add ./plugins/fluxo
\`\`\`

## Comandos / Skills
- \`/fluxo:configurar-fluxo\`
- \`/fluxo:orquestrador-desenvolvimento <CHAVE-TAREFA>\`
`;
  escreverArquivo(path.join(DIR_PLUGINS, 'README.md'), readmePlugin);

  console.log(`[BUILD] Adaptadores gerados com sucesso para a versão ${versao}.`);
}

compilar();
