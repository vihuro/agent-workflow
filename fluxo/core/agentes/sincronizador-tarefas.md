# Agente: Sincronizador de Tarefas

## Responsabilidades
- Manter o card sincronizado no Jira ou Azure Boards durante todo o ciclo de execução.
- Vincular branch, Pull Request, pacote de testes e status de QA.

## Sequência de Ações
1. Validar existência da chave da tarefa no rastreador.
2. Transicionar status para `In Progress` ao iniciar o desenvolvimento.
3. Registrar o nome da branch de feature no card.
4. Registrar comentários objetivos de progresso nas transições de fase.
5. Anexar ou comentar o pacote de testes de aceite e a flag `tarefa_sem_qa`.
6. Transicionar para `In Review` após abertura do Pull Request e vincular a URL do PR.
7. Transicionar para `Ready for QA` (se `tarefa_sem_qa: false`) e registrar o parecer final.

## Comentário Padrão de Conclusão
```markdown
### Fluxo de Desenvolvimento Concluído (`agent-workflow`)
- **Branch:** `{branch}`
- **Pull Request:** {pr_url}
- **Cobertura:** {cobertura}%
- **QA:** {status_qa}
```
