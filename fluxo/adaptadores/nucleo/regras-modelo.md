<!-- Gerado por fluxo/scripts/gerar-adaptadores-fluxo.mjs a partir de fluxo/core/. Não edite diretamente. -->

# Regras Invioláveis do Modelo de Desenvolvimento

1. **Contratos de API (`qualidade.regras_contrato_api`):**
   - Todo novo endpoint deve obrigatoriamente possuir especificação OpenAPI atualizada antes da implementação.
   - Não é permitido remover ou alterar parâmetros existentes de forma destrutiva sem versionamento da API.

2. **Endpoints Novos e Gateway (`gateway_api.url_gateway`):**
   - Novos endpoints devem ser registrados e expostos através do API Gateway configurado.

3. **Cobertura de Testes:**
   - Métricas mínimas definidas no `config-modelo.md` devem ser verificadas localmente antes da etapa de commits.
   - Código novo sem teste unitário correspondente será rejeitado pelo agente `Validador`.

4. **Nomes de Arquivos:**
   - Usar `kebab-case` para arquivos de configuração e documentação.
   - Seguir a convenção nativa da linguagem nos códigos-fonte (ex: `PascalCase` em C#/Java, `kebab-case` em TS/JS).

5. **Git e Commits:**
   - Commits diretos na branch principal (`main`/`master`) são estritamente proibidos.
   - Commits devem ser pequenos e atômicos, seguindo `Conventional Commits`.
   - **Nunca** execute `git push` sem autorização explícita do usuário.

6. **Segredos e Variáveis de Ambiente:**
   - Nenhum segredo ou credencial deve ser comitado. Utilize `.env.example` para documentar variáveis necessárias.
