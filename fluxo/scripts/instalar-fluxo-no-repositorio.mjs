#!/usr/bin/env node

import fs from 'node:fs';
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
const ehSimulacao = args.includes('--simular');

const caminhoAlvo = path.resolve(alvoArg);
const ferramentas = ferramentasArg.split(',').map((f) => f.trim().toLowerCase()).filter(Boolean);

console.log(`[INSTALADOR] Repositório Alvo: ${caminhoAlvo}`);
console.log(`[INSTALADOR] Ferramentas: ${ferramentas.join(', ')}`);
console.log(`[INSTALADOR] Instalação Local (--local): ${ehLocal}`);
console.log(`[INSTALADOR] Modo Simulação (--simular): ${ehSimulacao}`);

function copiarDiretorio(origem, destino) {
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
      copiarDiretorio(src, dest);
    } else {
      console.log(`  -> ${ehSimulacao ? '[SIMULAR] ' : ''}${path.relative(caminhoAlvo, dest)}`);
      if (!ehSimulacao) {
        fs.copyFileSync(src, dest);
      }
    }
  }
}

const caminhosInstalados = ['.fluxo/'];

// 1. Instalar Núcleo (.fluxo)
copiarDiretorio(
  path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'nucleo'),
  path.join(caminhoAlvo, '.fluxo')
);

// 2. Instalar Adaptadores
if (ferramentas.includes('copilot')) {
  copiarDiretorio(
    path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'copilot', '.github'),
    path.join(caminhoAlvo, '.github')
  );
  caminhosInstalados.push('.github/agents/', '.github/prompts/');
}

if (ferramentas.includes('cursor')) {
  copiarDiretorio(
    path.join(RAIZ_PLUGIN, 'fluxo', 'adaptadores', 'cursor', '.cursor'),
    path.join(caminhoAlvo, '.cursor')
  );
  caminhosInstalados.push('.cursor/commands/', '.cursor/rules/fluxo-desenvolvimento.mdc');
}

if (ferramentas.includes('claude')) {
  console.log('  -> Para Claude Code, instale o plugin via: claude plugin add ' + path.join(RAIZ_PLUGIN, 'plugins', 'fluxo'));
}

// 3. Atualizar .git/info/exclude se --local
if (ehLocal) {
  const dirGitInfo = path.join(caminhoAlvo, '.git', 'info');
  const caminhoExclude = path.join(dirGitInfo, 'exclude');
  if (fs.existsSync(path.join(caminhoAlvo, '.git'))) {
    let atual = fs.existsSync(caminhoExclude) ? fs.readFileSync(caminhoExclude, 'utf-8') : '';
    const novasLinhas = caminhosInstalados.filter((linha) => !atual.includes(linha));
    if (novasLinhas.length > 0) {
      const bloco = `\n# agent-workflow (instalação local)\n${novasLinhas.join('\n')}\n`;
      console.log(`[GIT] Adicionando entradas em .git/info/exclude`);
      if (!ehSimulacao) {
        fs.mkdirSync(dirGitInfo, { recursive: true });
        fs.appendFileSync(caminhoExclude, bloco, 'utf-8');
      }
    }
  } else {
    console.warn('[AVISO] Diretório .git não encontrado no alvo; ignorando --local.');
  }
}

console.log('[INSTALADOR] Concluído com sucesso.');
