<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Regras Invioláveis do Modelo de Desenvolvimento

Este documento estabelece os padrões obrigatórios e as diretrizes arquiteturais para o desenvolvimento de software no ecossistema. O cumprimento destas regras é verificado localmente pelo `Validador` e na esteira de integração contínua (CI).

---

## 1. Contratos de API (Quando `gateway_api.verificar_contratos: true`)
- **OpenAPI 3.0+ First:** Nenhum código de endpoint deve ser escrito antes da especificação da API ser aprovada. O arquivo de especificação (`openapi.yaml` ou `swagger.json`) é a fonte da verdade.
- **Compatibilidade Retroativa (Backward Compatibility):**
  - Alterações em contratos existentes **não podem ser destrutivas** (breaking changes).
  - É proibido remover campos de resposta, renomear atributos existentes ou tornar campos opcionais de requisição em obrigatórios sem o devido versionamento da API.
  - *Depreciação:* Endpoints ou campos que serão removidos devem utilizar `deprecated: true` na especificação OpenAPI.
- **Padronização de Envelopes:**
  - Respostas de erro devem seguir a especificação RFC 7807 (*Problem Details*) quando adotado pelo projeto.

---

## 2. Cobertura de Testes
- Métricas mínimas definidas em `.fluxo/config-modelo.md` devem ser verificadas localmente antes de invocar a etapa de commits.
- **Regra de Bloqueio:** Código novo sem teste unitário correspondente ou Pull Requests que reduzam a cobertura mínima exigida serão rejeitados pelo agente `Validador`.
- **Determinismo:** Testes não podem depender de estado externo global ou ordem de execução.

---

## 3. Convenções de Nomes de Arquivos
- **Estilo Geral:** Utilizar `kebab-case` para diretórios e arquivos de configuração, infraestrutura e documentação.
- **Código Fonte:** Seguir estritamente a convenção nativa da linguagem e do repositório (`PascalCase` para classes C#/Java/componentes React, `kebab-case` para serviços TypeScript, `snake_case` para Python/Go).

---

## 4. Fluxo de Git e Commits
- **Estratégia de Branches:**
  - `main` / `master`: Código em produção ou pronto para implantação imediata. Nunca commitar diretamente.
  - `feature/{chave}-{descricao_curta}`: Branches de curta duração para novas funcionalidades.
  - `fix/{chave}-{descricao_curta}`: Branches para correção de defeitos.
- **Padronização de Commits (Conventional Commits):**
  - Formato: `<tipo>(<escopo>): <descrição sucinta>` (tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`).
- **Autorização de Push:** Nenhum `git push` pode ser executado sem autorização explícita do usuário na sessão atual.

---

## 5. Gestão de Segredos e Segurança
- **Proibição Absoluta:** É estritamente proibido incluir senhas, chaves de API, certificados, tokens privados (PATs) ou strings de conexão reais no código-fonte ou em arquivos commitados no repositório.
- Utilize `.env.example` para documentar novas variáveis de ambiente.

---

## 6. Adaptação Dinâmica e Tolerância a Falhas
- Nunca bloqueie a entrega exigindo ferramentas marcadas como desabilitadas em `.fluxo/config-modelo.md` (como SonarQube, Xray, OpenAPI ou MCP de banco quando inativos).
- Respeite rigorosamente `tolerancia_falhas.max_tentativas_build_validacao` antes de escalar falhas recorrentes ao usuário.
