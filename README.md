# old-farm (static)

## Як запустити локально

Через `file://` **не спрацює** підвантаження `partials/*` (через `fetch`). Запускай локальний сервер.

### Варіант 1: Python

```bash
python -m http.server 5173
```

Відкрий: `http://localhost:5173/index.html`

### Варіант 2: Node (npx)

```bash
npx --yes serve .
```

## Як підключати header/footer на інших сторінках

Додай у `<head>`:

- `assets/css/base.css`
- `assets/css/header.css`
- `assets/css/footer.css`
- `assets/js/include.js` (defer)

І в `<body>`:

```html
<div data-include="partials/header.html"></div>
<!-- page content -->
<div data-include="partials/footer.html"></div>
```


