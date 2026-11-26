#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAIZ_PLUGIN = path.resolve(__dirname, '..', '..');

const args = process.argv.slice(2);

function obterArg(nome) {
  const idx = args.indexOf(nome);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  const prefixo = `${nome}=`;
  const encontrado = args.find((a) => a.startsWith(prefixo));
  return encontrado ? encontrado.slice(prefixo.length) : null;
}

const alvoArg = obterArg('--alvo') || '.';
const ferramentasArg = obterArg('--ferramentas') || 'copilot,cursor,claude';
const ehLocal = args.includes('--local');
const ehGlobal = args.includes('--global');
const ehSimulacao = args.includes('--simular');

const caminhoAlvo = path.resolve(alvoArg);
const ferramentas = ferramentasArg
  .split(',')
  .map((f) => f.trim().toLowerCase())
  .filter(Boolean);

function obterPastaPromptsVSCode() {
  const home = os.homedir();
  const plataforma = process.platform;

  if (plataforma === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    return path.join(appData, 'Code', 'User', 'prompts');
  }
  if (plataforma === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'Code', 'User', 'prompts');
  }
  return path.join(home, '.config', 'Code', 'User', 'prompts');
}

function copiarDiretorio(origem, destino, baseLog) {
  if (!fs.existsSync(origem)) {
    console.warn(`[AVISO] Origem não encontrada: ${origem}`);
    return;
  }
  if (!ehSimulacao) {
    fs.mkdirSync(destino, { recursive: true });
  }
  const itens = fs.readdirSync(origem);
  for (const item of itens) {
    const src = path.join(origem, item);
    const dest = path.join(destino, item);
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copiarDiretorio(src, dest, baseLog);
    } else {
      const rotulo = baseLog ? path.relative(baseLog, dest) : dest;
      console.log(`  -> ${ehSimulacao ? '[SIMULAR] ' : ''}${rotulo}`);
      if (!ehSimulacao) {
        fs.copyFileSync(src, dest);
      }
    }
  }
}

function instalarGlobal() {
  const home = os.homedir();
  const destinoNucleoGlobal = path.join(home, '.fluxo-desenvolvimento');

  console.log(`[INSTALADOR GLOBAL] Usuário: ${home}`);
  console.log(`[INSTALADOR GLOBAL] Ferramentas: ${ferramentas.join(', ')}`);
  console.log(`[INSTALADOR GLOBAL] Modo Simulação (--simular): ${ehSimulacao}\n`);

  console.log('[1/4] Instalando núcleo global em ~/.fluxo-desenvolvimento...');
  copiarDiretorio(
    path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'nucleo'),
    destinoNucleoGlobal
  );

  if (ferramentas.includes('cursor')) {
    console.log('\n[2/4] Instalando comandos globais do Cursor...');
    const destinoCursorCmds = path.join(home, '.cursor', 'commands');
    copiarDiretorio(
      path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'cursor', '.cursor', 'commands'),
      destinoCursorCmds
    );
    console.log('  [DICA CURSOR] Para ativar a regra globalmente, cole o conteúdo de:');
    console.log(`                ${path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'cursor', '.cursor', 'rules', 'fluxo-desenvolvimento.mdc')}`);
    console.log('                em Cursor Settings > Rules > User Rules.');
  }

  if (ferramentas.includes('copilot')) {
    console.log('\n[3/4] Instalando agentes e prompts globais do GitHub Copilot (VS Code)...');
    const pastaPromptsVSCode = obterPastaPromptsVSCode();
    copiarDiretorio(
      path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'copilot', '.github', 'agents'),
      pastaPromptsVSCode
    );
    copiarDiretorio(
      path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'copilot', '.github', 'prompts'),
      pastaPromptsVSCode
    );
  }

  if (ferramentas.includes('claude')) {
    console.log('\n[4/4] Claude Code (escopo user):');
    console.log(`  -> Execute: claude plugin add --scope user "${path.join(RAIZ_PLUGIN, 'plugins', 'fluxo')}"`);
  }

  console.log('\n[INSTALADOR GLOBAL] Concluído com sucesso!');
  console.log('[NOTA] Dentro de cada repositório de trabalho, rode /configurar-fluxo na primeira vez para gerar o .fluxo/config-modelo.md e descobrir o board.');
}

function instalarNoRepositorio() {
  console.log(`[INSTALADOR] Repositório Alvo: ${caminhoAlvo}`);
  console.log(`[INSTALADOR] Ferramentas: ${ferramentas.join(', ')}`);
  console.log(`[INSTALADOR] Instalação Local (--local): ${ehLocal}`);
  console.log(`[INSTALADOR] Modo Simulação (--simular): ${ehSimulacao}\n`);

  const caminhosInstalados = ['.fluxo/'];

  copiarDiretorio(
    path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'nucleo'),
    path.join(caminhoAlvo, '.fluxo'),
    caminhoAlvo
  );

  if (ferramentas.includes('copilot')) {
    copiarDiretorio(
      path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'copilot', '.github'),
      path.join(caminhoAlvo, '.github'),
      caminhoAlvo
    );
    caminhosInstalados.push('.github/agents/', '.github/prompts/');
  }

  if (ferramentas.includes('cursor')) {
    copiarDiretorio(
      path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'cursor', '.cursor'),
      path.join(caminhoAlvo, '.cursor'),
      caminhoAlvo
    );
    caminhosInstalados.push('.cursor/commands/', '.cursor/rules/fluxo-desenvolvimento.mdc');
  }

  if (ferramentas.includes('claude')) {
    console.log(
      '  -> Para Claude Code, instale o plugin via: claude plugin add ' +
        path.join(RAIZ_PLUGIN, 'plugins', 'fluxo')
    );
  }

  if (ehLocal) {
    const dirGitInfo = path.join(caminhoAlvo, '.git', 'info');
    const caminhoExclude = path.join(dirGitInfo, 'exclude');
    if (fs.existsSync(path.join(caminhoAlvo, '.git'))) {
      const atual = fs.existsSync(caminhoExclude) ? fs.readFileSync(caminhoExclude, 'utf-8') : '';
      const novasLinhas = caminhosInstalados.filter((linha) => !atual.includes(linha));
      if (novasLinhas.length > 0) {
        const bloco = `\n# agent-workflow (instalação local)\n${novasLinhas.join('\n')}\n`;
        console.log('[GIT] Adicionando entradas em .git/info/exclude');
        if (!ehSimulacao) {
          fs.mkdirSync(dirGitInfo, { recursive: true });
          fs.appendFileSync(caminhoExclude, bloco, 'utf-8');
        }
      }
    } else {
      console.warn('[AVISO] Diretório .git não encontrado no alvo; ignorando --local.');
    }
  }

  console.log('\n[INSTALADOR] Concluído com sucesso.');
}

if (ehGlobal) {
  instalarGlobal();
} else {
  instalarNoRepositorio();
}
