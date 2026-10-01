# TURNO

> **Seu dia em blocos. Sua vida no seu ritmo.**

**Status: EM CONSTRUÇÃO.** TURNO é um protótipo de experiência estudantil em Cozy Pixel Art, com o Quarto como hub. A proposta explora organização do tempo, estudos e desafios, finanças simplificadas e sono/recuperação sem transformar a vida em placar, streak ou cobrança.

## Demonstração

[Abrir a demo publicada](https://turnothegame.vercel.app/)

## Origem: Desafio #01 da Semana 5

Na **ROTA 4 | Quero resolver ou construir algo**, a pergunta era como ajudar estudantes a organizar tempo, estudos, finanças e descanso sem criar apenas mais um planner ou uma ferramenta de produtividade punitiva.

Foram explorados três caminhos:

- **Sandbox Preditivo | O Laboratório do Tempo:** antecipação, visão semanal, gargalos, imprevistos e margem.
- **Deckbuilder Tático | Economia de Ações por Cartas:** blocos limitados, escolhas, consequências e custo de oportunidade, sem microgerenciamento.
- **Bioma Espelho | Ecossistema Vivo:** feedback visual em pixel art, recuperação, baixo atrito e linguagem não punitiva.

O ROTA mostrou que nenhum caminho precisava ser escolhido sozinho. A combinação deu origem ao TURNO. O #01 foi uma etapa de exploração: testar caminhos diferentes ajudou a descobrir a direção e suas limitações.

## Desafio #02 da Semana 5: PARTS

No #02, a direção já descoberta foi aprofundada com o papel de **Game Design Sistêmico + UX**. O PARTS orientou uma rede de causa e efeito entre quatro pilares: **tempo**, **estudos e desafios**, **finanças simplificadas** e **sono/recuperação**.

A exploração trouxe hipóteses sobre o Quarto e o avatar como espelhos reativos, mecânicas de baixo atrito e escolhas que podem ser reorganizadas. A diferença entre os desafios é importante: o #01 abriu possibilidades; o #02 deu direção para desenvolver uma delas. PARTS ajudou a estruturar o próximo protótipo, mas não validou as hipóteses.

## Filosofia de design

- O Quarto é um hub acolhedor, não um painel de produtividade.
- Um bloco reorganizado não é uma falha. Compromissos fixos e prazos reais continuam visíveis.
- O custo de oportunidade é apresentado como escolha, não como punição.
- Desafios usam familiaridade qualitativa: **Travado, Fluindo e Firme**. Isso não é domínio preciso, nota ou previsão de aprovação.
- Sono e recuperação são registros voluntários e qualitativos. O jogo não calcula capacidade cognitiva a partir do sono.
- Finanças são simples, neutras e manuais. O jogo não associa automaticamente cansaço a gastos e não trata dinheiro como solução universal para comprar tempo.
- Relações entre descanso, foco, aprendizagem, dinheiro e comportamento são hipóteses de design ou escolhas explícitas, nunca fatos determinísticos.

## O que realmente funciona nesta versão

- Quarto em SVG com estética Cozy Pixel Art e atalhos para rotina, desafios, finanças e recuperação.
- Estados visuais acolhedores do Quarto: ritmo, pausa e Modo Casulo, sem sujeira, deterioração ou punição.
- Blocos do dia por turno, com criação livre, conclusão, reorganização, remoção e desfazer.
- Prazo real opcional em cada bloco, exibido como data informada pela pessoa.
- Compromissos fixos protegidos durante Tudo Mudou.
- Custo de oportunidade comunicado ao reorganizar um bloco.
- Desafios com tópicos e autoavaliação Travado, Fluindo ou Firme.
- Sessão de foco com duração escolhida e vínculo explícito ao tópico ou bloco de estudo quando ele existe.
- Registro qualitativo e voluntário de sono/recuperação.
- Três potes financeiros com registro manual de gastos.
- Estado salvo localmente no navegador, sem conta, backend ou rastreamento.

## O que ainda é hipótese ou limitação

- Ainda não há visão semanal completa com vários dias, notificações ou sincronização com calendário.
- O prazo informado é exibido, mas não altera nem estende prazos acadêmicos reais.
- Não há evidência de que feedback visual, abstração financeira ou margem tática melhorem retenção, foco, aprendizagem ou bem-estar.
- As relações entre os quatro pilares ainda precisam de testes com estudantes reais, incluindo pessoas neurodivergentes e usuárias de tecnologias assistivas.
- O estado é local ao navegador e não possui sincronização, autenticação ou exportação.
- A arquitetura ainda é uma vertical slice. Eventos ou dilemas opcionais e uma rede mais ampla de consequências são próximos experimentos, não funcionalidades confirmadas.

## Uso do Gemini

O Gemini participou da ideação e da comparação dos três caminhos do Desafio #01. Também ajudou na estruturação do TURNO, na exploração de mecânicas, game design, level design e prototipação inicial. A implementação, as decisões de escopo, os ajustes de segurança conceitual e a evolução do código foram conduzidos de forma iterativa, sem atribuir à ferramenta a autoria isolada do projeto.

## Arquitetura

```text
src/
├── App.tsx                       # estado local e integração da experiência
├── types.ts                      # tarefas, tópicos, finanças e estados
├── components/
│   ├── room/                     # Quarto hub e arte SVG reativa
│   ├── planner/                  # blocos, prazos e reorganização
│   ├── boss/                     # desafios e familiaridade qualitativa
│   ├── focus/                    # sessão ligada a estudo
│   ├── finance/                  # potes e gastos manuais
│   ├── RestModal.tsx             # recuperação e registro de sono
│   └── RescueModal.tsx           # Tudo Mudou
└── index.css                     # tokens, responsividade e acessibilidade
```

## Stack e execução local

React, TypeScript, Vite, SVG/CSS, ESLint e GitHub Actions. Não há backend, autenticação, banco, integração bancária ou rastreamento.

```bash
git clone https://github.com/SouBeatrizKaroline/EmbaixadoresEstudantisGoogle2026_Turno.git
cd EmbaixadoresEstudantisGoogle2026_Turno
npm install
npm run dev
```

Validação de produção:

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Acessibilidade e mobile first

A interface usa HTML semântico, rótulos acessíveis, navegação por teclado, foco visível, controles grandes, informação textual além de cor, tipografia legível e `prefers-reduced-motion`. O layout parte de telas pequenas e se amplia para telas maiores.

## Próximos testes

1. observar se estudantes entendem blocos, prazos e custo de oportunidade sem sentir cobrança;
2. testar o vínculo entre bloco de estudo e foco;
3. avaliar se os estados do Quarto comunicam acolhimento sem infantilizar ou sugerir causalidade científica;
4. testar leitura por teclado, zoom, contraste e leitor de tela;
5. explorar uma visão semanal e eventos opcionais sem alterar compromissos reais;
6. validar as hipóteses com participantes reais antes de afirmar qualquer efeito.

## Licença

Distribuído sob a licença [MIT](LICENSE).
