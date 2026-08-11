# CLAUDE.md

Site institucional do **Bacharelado em Ciência da Computação (BCC)** do Centro Universitário Senac.

> Escopo: este documento cobre o site na raiz. A pasta `PI3/` é um projeto independente (será removida) — **ignore-a completamente**.

## Natureza do projeto

Site **estático**: HTML + CSS + JavaScript puro (ES5, IIFEs, sem módulos). **Não há build, npm, bundler ou framework.** Editar arquivo = mudança pronta. Não existe `package.json`, `node_modules` nem git nesta pasta.

Para testar, basta abrir os `.html` no navegador ou servir a raiz estaticamente:

```bash
python -m http.server 8080
```

Idioma de todo o conteúdo e dos comentários no código: **português brasileiro**.

## Estrutura

```
/                       páginas HTML (uma por assunto)
├── index.html          "Sobre o BCC" + roteador SPA
├── css/                base.css, layout.css, components.css → agregados por style.css
└── assets/             nav.js, faq.js, imagens, PDFs, docentes/
```

### Páginas

Cada página é um arquivo HTML autônomo na raiz. Estrutura padrão:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <link rel="stylesheet" href="css/style.css?v=1">
</head>
<body>
  <main class="page-wrapper">
    <section class="card"> ... </section>
  </main>
  <footer class="page-footer">
    <a href="index.html" class="footer-btn">Voltar ao Início</a>
  </footer>
  <script src="assets/nav.js?v=1"></script>
</body>
```

Ao criar uma página nova, copie esse esqueleto de uma existente (ex.: [atividades-complementares.html](atividades-complementares.html)) — não invente uma estrutura própria.

## Convenções que não são óbvias no código

### 1. A navegação é injetada por JavaScript

O menu **não existe no HTML de nenhuma página**. [assets/nav.js](assets/nav.js) monta a `<nav class="chip-nav">` a partir do array `navItems` e a insere no início do `<body>`.

**Para adicionar, remover ou renomear um item de menu, edite `navItems` em [assets/nav.js](assets/nav.js)** — mexer no HTML não tem efeito.

Cada item aceita:
- `hidden: true` → aplica `.chip-hidden` (página existe mas não aparece no menu; hoje: NDE, Projetos Integradores)
- `external: true` → abre em nova aba com `rel="noopener noreferrer"` (hoje: TCC, que aponta para `bcc-senac.github.io/tccs/`)

O script é idempotente: se a nav já existe (caso da navegação SPA), ele só atualiza o chip ativo e retorna.

### 2. index.html contém um mini-roteador SPA

O script inline no fim de [index.html](index.html) intercepta cliques na `.chip-nav`, faz `fetch` da página destino, extrai o `<main class="page-wrapper">` do HTML retornado e substitui o conteúdo atual — mantendo nav e footer. Usa `history.pushState` + `hashchange`.

Consequências ao editar páginas:
- **Só o conteúdo dentro de `<main class="page-wrapper">` é carregado na navegação SPA.** Scripts, `<link>` ou markup fora do `<main>` são ignorados quando a página é aberta pelo menu (só funcionam no acesso direto ao arquivo).
- Comportamentos de página devem usar **delegação de eventos no `document`** (como [assets/faq.js](assets/faq.js) faz) — handlers presos a elementos específicos morrem quando o `innerHTML` é trocado.
- Links `http://` / `https://` são deixados passar pelo comportamento padrão do navegador.

### 3. CSS: quatro arquivos, um ponto de entrada

As páginas linkam **apenas `css/style.css`**, que faz `@import` de:

| Arquivo | Papel |
|---|---|
| [css/base.css](css/base.css) | reset, tipografia (Inter) e **variáveis de cor em `:root`** |
| [css/layout.css](css/layout.css) | `.page-wrapper`, `.chip-nav`, footer, responsividade |
| [css/components.css](css/components.css) | cards, grids, blocos de destaque — o grosso (~1000 linhas) |
| [css/style.css](css/style.css) | imports + estilos do FAQ e regras globais de `h2` |

**Sempre use as variáveis de `:root`, nunca hardcode cores.** Paleta corporativa: `--color-primary` `#004A8D` (azul), `--color-accent` `#F7941D` (laranja), mais `--radius-*`, `--shadow-*` e `--transition`.

Classes de componente já existentes que devem ser reaproveitadas antes de criar novas: `.card`, `.card-tag`, `.card-title`, `.section-title`, `.info-cards-grid` / `.info-card` (variantes `-primary` / `-accent`, alternadas), `.hours-grid` / `.hours-card`, `.photo-info-row` / `.photo-container` / `.info-content`, `.description-text`, `.highlight-block`, `.important-block`, `.faq-container` / `.faq-item`.

### 4. FAQ

[faq.html](faq.html) tem todo o conteúdo **hardcoded** em `.faq-item` (accordion + busca via [assets/faq.js](assets/faq.js)).

⚠️ [assets/faq.md](assets/faq.md) contém os mesmos textos em markdown mas **não é lido por nenhum código** — é um rascunho/fonte paralela. Ao alterar o FAQ, o arquivo que importa é o `faq.html`; se atualizar só o `.md`, nada muda no site.

`faq.js` só é carregado por [index.html](index.html) — o `faq.html` funciona pelo caminho SPA. Da mesma forma, `faq.html` é a única página que **não** inclui `nav.js`, então aberta diretamente ela fica sem menu.

### 5. Cache do navegador

Como o site é estático e servido sem controle de headers HTTP, editar um arquivo não garante que o visitante veja a mudança sem um hard refresh. Para evitar isso:

- Todo `<head>` inclui `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">`, para que o navegador revalide o HTML da página em vez de reaproveitar uma cópia salva.
- `css/style.css`, `assets/nav.js` e `assets/faq.js` são referenciados com uma query string de versão (`?v=1`). **Ao editar qualquer um desses três arquivos, incremente o `?v=N` em todas as páginas que o referenciam** — é isso que força o navegador a buscar a versão nova, já que muda a URL do recurso.
- O roteador SPA de [index.html](index.html) faz `fetch(path, { cache: 'no-store' })`, para que a navegação pelo menu também não sirva um HTML em cache.

## Assets

- `assets/docentes/` — fotos dos professores, nomeadas em kebab-case (`nome-sobrenome.jpg`), referenciadas por [quadro-docente.html](quadro-docente.html)
- PDFs de calendário e o PPC ficam em `assets/` e são embutidos com `<embed>` (já estilizado no `style.css`)
