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

const METADADOS_AGENTES = {
  'po': {
    descricao: 'Product Owner (PO): refina requisitos de cards (Jira/Azure/TFS) ou de descrições textuais livres no padrão INVEST, define critérios de aceite BDD (Gherkin), avalia a flag tarefa_sem_qa e gera historia.md.',
    toolsClaude: 'Read, Write, Edit, Glob, Grep, AskUserQuestion',
    toolsCopilot: "['codebase', 'editFiles', 'askQuestions']",
    perfilModelo: 'padrao'
  },
  'planejador': {
    descricao: 'Planejador Técnico: analisa a codebase, historia.md e aprendizados anteriores (.fluxo/aprendizados.md) para criar plano.md com arquivos afetados, contratos OpenAPI, impacto em banco, estratégia de testes, branch e pontos [REVISAO_ARQUITETURA].',
    toolsClaude: 'Read, Write, Edit, Glob, Grep',
    toolsCopilot: "['codebase', 'editFiles']",
    perfilModelo: 'forte'
  },
  'arquiteto': {
    descricao: 'Arquiteto de Software: acionado condicionalmente quando plano.md contém [REVISAO_ARQUITETURA]; avalia requisitos não funcionais, valida padrões arquiteturais e registra parecer técnico e ADRs em arquitetura.md.',
    toolsClaude: 'Read, Write, Edit, Glob, Grep',
    toolsCopilot: "['codebase', 'editFiles']",
    perfilModelo: 'forte'
  },
  'executor': {
    descricao: 'Executor de Código: implementa alterações de código-fonte e testes unitários seguindo plano.md, arquitetura.md e .fluxo/aprendizados.md, executando build e testes locais via terminal (PowerShell/Bash) dentro do limite de tentativas.',
    toolsClaude: 'Read, Write, Edit, Bash, Glob, Grep',
    toolsCopilot: "['codebase', 'editFiles', 'runCommands']",
    perfilModelo: 'forte'
  },
  'validador': {
    descricao: 'Validador de Qualidade: audita o código sem editá-lo, executando o checklist dinâmico de 10 itens (compilação/build, testes unitários, regressão, segurança, linter, contratos OpenAPI e cobertura) via terminal (PowerShell/Bash).',
    toolsClaude: 'Read, Bash, Glob, Grep',
    toolsCopilot: "['codebase', 'runCommands']",
    perfilModelo: 'padrao'
  },
  'especialista-testes-aceite': {
    descricao: 'Especialista em Testes de Aceite: traduz critérios de historia.md em matriz de rastreabilidade, cenários BDD (Gherkin) e casos manuais (Xray/Azure Test Plans/Zephyr ou Markdown offline) e valida o quality gate interno dos testes.',
    toolsClaude: 'Read, Write, Edit, Glob, Grep',
    toolsCopilot: "['codebase', 'editFiles']",
    perfilModelo: 'padrao'
  },
  'qa': {
    descricao: 'Analista de Qualidade (QA): executa validação funcional, casos de borda, regressão e segurança básica em homologação (hml/staging) quando qa.ativo=true e tarefa_sem_qa=false, gerando o relatório qa.md.',
    toolsClaude: 'Read, Write, Edit, Bash, Glob, Grep',
    toolsCopilot: "['codebase', 'editFiles', 'runCommands']",
    perfilModelo: 'padrao'
  },
  'sincronizador-tarefas': {
    descricao: 'Sincronizador de Tarefas: sincroniza status do card, subtarefas, branch e comentários no Jira/Azure DevOps/TFS via MCP, ou gera resumo local quando offline ou quando a tarefa foi iniciada apenas por descrição sem card.',
    toolsClaude: 'Read, Write, Edit, Bash, Glob, Grep',
    toolsCopilot: "['codebase', 'editFiles', 'runCommands']",
    perfilModelo: 'rapido'
  },
  'especialista-commits': {
    descricao: 'Especialista em Commits e Versionamento: valida a branch de trabalho, organiza commits atômicos locais (Conventional Commits) via Git/terminal e prepara título e descrição da Pull Request (nunca executa git push sem autorização).',
    toolsClaude: 'Read, Bash, Glob, Grep',
    toolsCopilot: "['codebase', 'runCommands']",
    perfilModelo: 'rapido'
  }
};

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

  limparDiretorio(path.join(DIR_ADAPTADORES, 'nucleo'));
  limparDiretorio(path.join(DIR_ADAPTADORES, 'copilot'));
  limparDiretorio(path.join(DIR_ADAPTADORES, 'cursor'));
  limparDiretorio(path.join(DIR_PLUGINS, 'agents'));
  limparDiretorio(path.join(DIR_PLUGINS, 'skills'));
  limparDiretorio(path.join(DIR_PLUGINS, 'referencias'));

  for (const arquivo of arquivosAgentes) {
    const nomeBase = path.basename(arquivo, '.md');
    const meta = METADADOS_AGENTES[nomeBase] || {
      descricao: `Agente especializado em ${nomeBase} do fluxo de desenvolvimento orquestrado.`,
      toolsClaude: 'Read, Write, Edit, Bash, Glob, Grep',
      toolsCopilot: "['codebase', 'editFiles', 'runCommands']",
      perfilModelo: 'padrao'
    };
    const conteudoAgente = lerArquivo(path.join(dirAgentesCore, arquivo));
    const conteudoCompleto = `${AVISO_GERADO}${conteudoAgente.trim()}\n\n---\n\n${conteudoComum.trim()}\n`;

    escreverArquivo(path.join(DIR_ADAPTADORES, 'nucleo', 'agentes', arquivo), conteudoCompleto);

    const frontmatterClaude = `---\nname: ${nomeBase}\ndescription: ${meta.descricao}\ntools: ${meta.toolsClaude}\n---\n\n`;
    escreverArquivo(path.join(DIR_PLUGINS, 'agents', arquivo), frontmatterClaude + conteudoCompleto);

    const frontmatterCopilot = `---\ndescription: ${meta.descricao}\ntools: ${meta.toolsCopilot}\n---\n\n`;
    escreverArquivo(
      path.join(DIR_ADAPTADORES, 'copilot', '.github', 'agents', `${nomeBase}.agent.md`),
      frontmatterCopilot + conteudoCompleto
    );
  }

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
    escreverArquivo(path.join(DIR_PLUGINS, 'referencias', arq), AVISO_GERADO + cont);
  }

  escreverArquivo(path.join(DIR_ADAPTADORES, 'nucleo', 'VERSAO'), `${versao}\n`);

  // Prompts Copilot (.github/prompts/)
  const promptConfigurarCopilot = `---
mode: agent
description: Configura o fluxo de desenvolvimento no repositório (.fluxo/config-modelo.md)
tools: ['codebase', 'editFiles', 'runCommands', 'askQuestions']
---
${AVISO_GERADO}Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\` (ou \`~/.fluxo-desenvolvimento/configurar-fluxo.md\`).

## Regra Obrigatória de Interação
- Execute **UM bloco por vez** (Blocos A a I).
- Use obrigatoriamente a ferramenta \`askQuestions\` (ou pergunte com opções objetivas e pare o turno aguardando resposta) antes de avançar para o próximo bloco.
- Se o MCP do rastreador estiver ativo, realize a descoberta automática das colunas do board e subtarefas no Bloco B.
- Nunca despeje todos os blocos de uma vez e nunca grave segredos no Git.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'copilot', '.github', 'prompts', 'configurar-fluxo.prompt.md'),
    promptConfigurarCopilot
  );

  const promptOrquestradorCopilot = `---
mode: agent
description: Orquestra o fluxo completo de desenvolvimento de uma história com card ou tarefa por descrição livre (PO, planejador, arquiteto, executor, validador, TA, QA, commits e rastreador)
tools: ['codebase', 'editFiles', 'runCommands', 'askQuestions']
---
${AVISO_GERADO}# Orquestrador de Desenvolvimento

1. Verifique se \`.fluxo/config-modelo.md\` existe no repositório (ou consulte \`~/.fluxo-desenvolvimento/config.md\`). Se não existir, use \`askQuestions\` perguntando se deseja executar \`/configurar-fluxo\` agora ou prosseguir com os padrões.
2. Leia \`.fluxo/aprendizados.md\` (se existir) para carregar o histórico de aprendizados da squad neste repositório.
3. Aceite tanto uma **chave/link de card** (\`PROJ-123\`, \`AB#12345\`, URL) quanto uma **descrição textual livre da tarefa** (sem atividade cadastrada no board, gerando identificador local \`LOCAL-<slug>\`).
4. Leia e siga \`.fluxo/playbook-orquestrador.md\` (ou \`~/.fluxo-desenvolvimento/playbook-orquestrador.md\`) como sessão principal, com acesso às ferramentas de terminal (\`PowerShell\` / \`Bash\`).
5. Use \`askQuestions\` para confirmações obrigatórias (escopo inicial, ambiguidades do PO, estouro de tentativas de build e autorização antes de \`git push\`).
6. Delegue cada etapa ativa ao agente especializado correspondente (\`@po\`, \`@planejador\`, \`@arquiteto\`, \`@executor\`, \`@validador\`, \`@especialista-testes-aceite\`, \`@qa\`, \`@sincronizador-tarefas\`, \`@especialista-commits\`).
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'copilot', '.github', 'prompts', 'orquestrador-desenvolvimento.prompt.md'),
    promptOrquestradorCopilot
  );

  // Commands & Rules Cursor (.cursor/)
  const cmdConfigurarCursor = `${AVISO_GERADO}# Configurar Fluxo de Desenvolvimento

Siga integralmente as instruções de \`.fluxo/configurar-fluxo.md\` (ou \`~/.fluxo-desenvolvimento/configurar-fluxo.md\`).

## Regra Obrigatória de Interação
- Execute **UM bloco por vez** (Blocos A a I).
- Sempre que precisar fazer perguntas ao usuário, **use obrigatoriamente a ferramenta interativa \`AskQuestion\`** do Cursor, aguardando a seleção/resposta antes de avançar para o próximo bloco.
- Se o MCP do rastreador estiver ativo, realize a descoberta automática do board e subtarefas no Bloco B.
- Não despeje perguntas em texto corrido no chat encerrando o turno e nunca grave tokens ou senhas no Git.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'configurar-fluxo.md'),
    cmdConfigurarCursor
  );

  const cmdOrquestradorCursor = `${AVISO_GERADO}# Orquestrador de Desenvolvimento

1. Verifique se \`.fluxo/config-modelo.md\` existe no repositório (ou consulte \`~/.fluxo-desenvolvimento/config.md\`). Se não existir, invoque \`AskQuestion\` perguntando se deseja executar \`/configurar-fluxo\` agora ou prosseguir com os padrões.
2. Leia \`.fluxo/aprendizados.md\` (se existir) para aplicar aprendizados anteriores da squad.
3. Aceite tanto uma **chave/link de card** (\`PROJ-123\`, \`AB#12345\`, URL) quanto uma **descrição textual livre da tarefa** (sem card no board, atribuindo identificador local \`LOCAL-<slug>\`).
4. Leia e siga \`.fluxo/playbook-orquestrador.md\` (ou \`~/.fluxo-desenvolvimento/playbook-orquestrador.md\`) como sessão principal, utilizando terminal (\`PowerShell\` / \`Bash\`) quando necessário.
5. Use \`AskQuestion\` para todas as confirmações obrigatórias (escopo inicial, ambiguidades do PO, limite de tentativas de build e autorização antes de \`git push\`).
6. Delegue cada papel ativo aos subagentes (\`Task\`) seguindo as definições em \`.fluxo/agentes/\` sem parar o fluxo entre etapas automáticas.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'commands', 'orquestrador-desenvolvimento.md'),
    cmdOrquestradorCursor
  );

  const ruleCursor = `---
description: Regras do fluxo de desenvolvimento orquestrado (agent-workflow)
alwaysApply: true
---
${AVISO_GERADO}Quando o usuário iniciar desenvolvimento de história/tarefa (por link/chave de card ou por descrição textual livre) ou invocar \`/orquestrador-desenvolvimento\` ou \`/configurar-fluxo\`, siga rigorosamente \`.fluxo/playbook-orquestrador.md\`, \`.fluxo/config-modelo.md\`, \`.fluxo/regras-modelo.md\`, \`.fluxo/aprendizados.md\` e os agentes em \`.fluxo/agentes/\` (ou \`~/.fluxo-desenvolvimento/\`). Use \`AskQuestion\` sempre que precisar de confirmação ou input do usuário (um bloco por vez), delegue papéis via \`Task\`, utilize \`PowerShell\`/\`Bash\` para comandos locais, nunca faça commit direto na main/master e nunca execute git push sem aprovação explícita.
`;
  escreverArquivo(
    path.join(DIR_ADAPTADORES, 'cursor', '.cursor', 'rules', 'fluxo-desenvolvimento.mdc'),
    ruleCursor
  );

  // Claude Code Skills (plugins/fluxo/skills/) — Autocontidas com referências dentro do plugin
  const skillConfigurarClaude = `---
name: configurar-fluxo
description: Configura o fluxo de desenvolvimento no repositório atual (.fluxo/config-modelo.md), MCPs, banco opcional e descoberta dinâmica de board
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---
${AVISO_GERADO}Siga integralmente as instruções do procedimento empacotado neste plugin em \`\${CLAUDE_PLUGIN_ROOT}/referencias/configurar-fluxo.md\` (usando \`\${CLAUDE_PLUGIN_ROOT}/referencias/config-modelo.md\` e \`\${CLAUDE_PLUGIN_ROOT}/referencias/regras-modelo.md\` como templates base caso \`.fluxo/\` ainda não exista no repositório de trabalho).

## Comportamento Interativo Obrigatório
- Execute **UM bloco por vez** (Blocos A a I).
- Invoque obrigatoriamente a ferramenta \`AskUserQuestion\` com opções objetivas para cada bloco e aguarde o retorno antes de avançar.
- Se o MCP do rastreador estiver ativo, inspecione o projeto/board automaticamente no Bloco B para mapear colunas, estados e subtarefas.
- Ao concluir, grave \`.fluxo/config-modelo.md\` e \`.fluxo/regras-modelo.md\` no repositório de trabalho. Nunca grave segredos em arquivos rastreados pelo Git.
`;
  escreverArquivo(
    path.join(DIR_PLUGINS, 'skills', 'configurar-fluxo', 'SKILL.md'),
    skillConfigurarClaude
  );

  const skillOrquestradorClaude = `---
name: orquestrador-desenvolvimento
description: Orquestra o fluxo completo e adaptável de desenvolvimento de uma história com card (Jira/Azure/TFS) ou tarefa por descrição livre
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, TodoWrite, AskUserQuestion
---
${AVISO_GERADO}Atue como Orquestrador seguindo o playbook empacotado neste plugin em \`\${CLAUDE_PLUGIN_ROOT}/referencias/playbook-orquestrador.md\`.

## Fontes de Configuração e Aprendizados
1. Leia \`.fluxo/config-modelo.md\` e \`.fluxo/regras-modelo.md\` no repositório de trabalho. Caso ainda não existam no repositório, consulte \`~/.fluxo-desenvolvimento/config.md\` ou os templates padrão do plugin em \`\${CLAUDE_PLUGIN_ROOT}/referencias/config-modelo.md\` e \`\${CLAUDE_PLUGIN_ROOT}/referencias/regras-modelo.md\` (perguntando via \`AskUserQuestion\` se o usuário deseja rodar \`/fluxo:configurar-fluxo\` antes ou seguir com os padrões).
2. Leia \`.fluxo/aprendizados.md\` (se existir no repositório) logo no início e repasse os aprendizados relevantes para os subagentes.

## Entrada Flexível (Card ou Descrição Livre) e Acesso a Terminal
- **Não exija link ou ID de card como regra absoluta:** aceite tanto uma chave/URL de tarefa (\`PROJ-123\`, \`AB#12345\`) quanto uma **descrição textual direta** (para adiantar desenvolvimento ou trabalhar sem atividade no board, atribuindo um identificador local \`LOCAL-<slug>\` e pulando a sincronização externa com o board).
- Utilize \`Bash\` / \`PowerShell\` livremente para verificações de ambiente, Git, builds e testes quando necessário.

## Regras de Execução e Delegação com Prefixo do Plugin
- Crie a lista de etapas aplicáveis usando \`TodoWrite\` logo no início para manter o progresso rastreado.
- Sempre que precisar de confirmação ou decisão humana (escopo inicial na Etapa 0, dúvidas do PO, estouro do limite de tentativas de build ou autorização antes de \`git push\` na Etapa 8), invoque obrigatoriamente \`AskUserQuestion\`.
- Delegue cada etapa ativa usando a ferramenta \`Task\` com o prefixo \`fluxo:\` no \`subagent_type\`:
  - \`fluxo:po\`
  - \`fluxo:planejador\`
  - \`fluxo:arquiteto\` (condicional a \`[REVISAO_ARQUITETURA]\`)
  - \`fluxo:sincronizador-tarefas\` (somente quando houver card vinculado)
  - \`fluxo:executor\`
  - \`fluxo:validador\`
  - \`fluxo:especialista-testes-aceite\` (condicional a \`testes_aceite.ativo: true\`)
  - \`fluxo:qa\` (condicional a \`qa.ativo: true\` e \`tarefa_sem_qa: false\`)
  - \`fluxo:especialista-commits\`
- Continue o loop automaticamente entre etapas até a conclusão ou próxima barreira humana.
`;
  escreverArquivo(
    path.join(DIR_PLUGINS, 'skills', 'orquestrador-desenvolvimento', 'SKILL.md'),
    skillOrquestradorClaude
  );

  // Plugin manifest (plugins/fluxo/.claude-plugin/plugin.json) & Marketplace (.claude-plugin/marketplace.json)
  const descricaoPlugin = 'Orquestrador universal de desenvolvimento multi-agente (Jira, Azure DevOps, TFS e tarefas por descrição)';
  const pluginManifest = {
    name: 'fluxo',
    version: versao,
    description: descricaoPlugin,
    keywords: [
      'orchestrator',
      'multi-agent',
      'development-workflow',
      'jira',
      'azure-devops',
      'tfs',
      'copilot',
      'cursor',
      'claude-code'
    ]
  };
  escreverArquivo(
    path.join(DIR_PLUGINS, '.claude-plugin', 'plugin.json'),
    JSON.stringify(pluginManifest, null, 2) + '\n'
  );

  const marketplaceManifest = {
    name: 'agent-workflow',
    owner: {
      name: 'Vitor Hugo Rodrigues'
    },
    plugins: [
      {
        name: 'fluxo',
        source: './plugins/fluxo',
        description: descricaoPlugin,
        version: versao
      }
    ]
  };
  escreverArquivo(
    path.join(RAIZ_PROJETO, '.claude-plugin', 'marketplace.json'),
    JSON.stringify(marketplaceManifest, null, 2) + '\n'
  );

  const readmePlugin = `${AVISO_GERADO}# Plugin Fluxo v${versao} (Claude Code)

Plugin multi-agente universal e autocontido para orquestração de desenvolvimento padronizado (com card no Jira/Azure/TFS ou por descrição textual livre).

## Instalação no Claude Code
Dentro do Claude Code, adicione este repositório como marketplace e instale o plugin \`fluxo\`:
\`\`\`text
/plugin marketplace add <CAMINHO_PARA_ESTE_REPOSITORIO>
/plugin install fluxo@agent-workflow
\`\`\`

## Comandos / Skills
- \`/fluxo:configurar-fluxo\`
- \`/fluxo:orquestrador-desenvolvimento <CHAVE-TAREFA ou DESCRIÇÃO DA TAREFA>\`
`;
  escreverArquivo(path.join(DIR_PLUGINS, 'README.md'), readmePlugin);

  console.log(`[BUILD] Adaptadores universais gerados com sucesso para a versão ${versao}.`);
}

compilar();
