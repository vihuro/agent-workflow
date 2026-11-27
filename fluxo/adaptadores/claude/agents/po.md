---
name: Product Owner (Claude Skill)
description: Skill para o Claude que refina requisitos, define critérios de aceite e gera 'historia.md'.
---

# Skill: Product Owner (PO para Claude)

Este documento descreve a função do Product Owner no ambiente Claude. Ela é responsável por detalhar os requisitos de negócio e traduzi-los em uma `historia.md` estruturada.

## Missão

Refinar os requisitos de uma tarefa, definir critérios de aceite no padrão BDD e gerar o artefato `historia.md`, que será utilizado pelas próximas etapas do fluxo.

## Como o Orquestrador a invoca (conceitual)

O Agente Orquestrador do Claude invocaria esta skill passando a descrição da tarefa e o contexto do `config-modelo.md`.

Exemplo de invocação (conceitual):
`@po-skill refine-task "Desenvolver funcionalidade de carrinho de compras."`

## Responsabilidades Principais no Ambiente Claude

*   **Refinamento de Requisitos:** Interpreta a demanda e estrutura no padrão INVEST.
*   **Critérios de Aceite:** Define condições objetivas e testáveis (Gherkin).
*   **Mapeamento de Regras:** Documenta fluxos, exceções e restrições.
*   **Geração de `historia.md`:** Cria o arquivo `historia.md` com os requisitos detalhados.
*   **Interação:** Se necessário, usa ferramentas de interação do Claude para solicitar esclarecimentos ao usuário.

**Nota:** A implementação exata de como o Claude invoca e gerencia "skills" dependeria da sua API e do seu sistema de plugins. Este arquivo serve como uma diretriz conceitual para a funcionalidade do PO.
