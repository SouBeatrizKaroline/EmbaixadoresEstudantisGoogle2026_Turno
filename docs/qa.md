# Validação das correções do TURNO

Revisão de 01/10/2026, a partir do commit `98fc62ff3e981e1ade7cbcc7a65e2cb0ce42eee0`.

## Falhas corrigidas

- Primeiro uso não concluía a hidratação sem dados salvos, impedindo a persistência da rotina.
- Recarregar sobrescrevia `isFixed` em IDs de exemplo e de configuração inicial.
- Dados locais inválidos ou acesso bloqueado ao armazenamento podiam interromper a aplicação. O carregamento agora valida os campos; falhas ao salvar geram um aviso.
- Aula e trabalho configurados à noite eram classificados como tarde. Compromissos iniciais de aula/trabalho agora são fixos.
- Encerrar o foco antecipadamente registrava a duração planejada completa. Agora registra os minutos completos realizados.
- Contagem por intervalos acumulava atraso quando o navegador suspendia callbacks. O cronômetro usa o horário previsto de término e nunca exibe valores negativos.
- Sair da aba de foco apagava a sessão. A sessão agora permanece montada e pausa durante a navegação; pode ser retomada pelo mesmo tópico.
- Concluir o foco marcava vários blocos por coincidência parcial de título. Agora conclui apenas o bloco pendente vinculado por ID.
- O botão Desfazer não recebia cliques. O estilo foi corrigido; o desfazer modifica apenas o bloco da ação e deixa de aparecer em notificações de outras operações.
- Potes sem orçamento calculavam uma porcentagem inválida. Gastos agora são somados em centavos e exibidos com duas casas decimais.
- Apagar horários no registro de sono gerava duração inválida. O botão de salvar fica desabilitado até ambos serem válidos; horários iguais representam zero minutos.
- Edição permitia horário vazio e não permitia alterar o turno. Agora exige horário e título válidos, com seleção de turno.
- O Quarto exibia pendências de outros turnos. Agora seleciona e ordena os blocos do turno escolhido.
- Modais não isolavam o foco do teclado. Agora focam o primeiro controle, mantêm Tab dentro do diálogo, restauram o foco e permitem Escape nos diálogos canceláveis.
- Configurar nova semana não podia ser cancelado. Agora pode, e informa que substituirá blocos e zerará os gastos.
- Textos prometiam reagendamento para amanhã e pausa do Boss por 24 horas sem implementar essas ações. Agora descrevem o comportamento existente.
- Familiaridade tinha rótulos inconsistentes entre estudo e desafios; agora usa Travado, Fluindo e Firme.
- O zoom estava bloqueado na viewport. Foi liberado.
- A aba do navegador não tinha ícone. Foi adicionado `public/favicon.svg`, com um T em estilo pixel e as cores do TURNO.
- O README indicava outro repositório no comando de instalação. Foi atualizado.

## Verificação

- 11 testes de regressão com o executor nativo do Node: aprovados.
- TypeScript: aprovado.
- ESLint: aprovado, sem avisos.
- Build de produção do Vite: aprovado.
- 18 verificações locais no Edge automatizado, incluindo tela de 390 × 844: aprovadas, sem exceções da aplicação.
- Favicon servido com HTTP 200 e viewport móvel sem rolagem horizontal no cenário de finanças.
- Testes de regressão incluídos no GitHub Actions antes do lint e build.

Os cenários de navegador cobriram configuração inicial, persistência após recarga, compromisso fixo, aula noturna, desfazer, tempo real de foco, isolamento do bloco concluído, pausa durante navegação, centavos, Tab/Escape, cancelamento de nova semana, favicon, largura móvel, dados corrompidos, armazenamento bloqueado, Tudo Mudou, horários vazios, sono durante a noite e edição do turno.

## Reprodução local

Use Node 22.18 ou superior; o CI usa Node 24.

```sh
npm ci
npm test
npm run lint
npm run build
npm run dev
```

As verificações de navegador foram executadas localmente; o CI automatiza os testes de lógica, lint e build. Não foram feitas validação com leitor de tela, testes com participantes nem publicação em produção. Sessões de foco continuam sem persistência após recarregar/fechar a página; a correção preserva a sessão durante navegação interna.
