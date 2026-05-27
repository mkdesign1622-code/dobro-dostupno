# Добро.доступно

> Платформа простой и прозрачной благотворительности. Учебный проект КТ4, 3 курс, веб-дизайн.

[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2_AA-00B27C)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![No frameworks](https://img.shields.io/badge/HTML-CSS-JS-1B47FF)](https://developer.mozilla.org/)

## О проекте

«Добро.доступно» — концепция платформы для прозрачной благотворительности. Объединяет доноров, фонды и получателей помощи. Каждый рубль прослеживается, отчёты публикуются автоматически.

**Стиль:** Trust Aurora — синие градиенты, прозрачность, инновационный, не корпоративный.

## Стек

| Технология | Версия | Назначение |
|---|---|---|
| HTML5 | semantic | Семантическая разметка, ARIA |
| CSS3 | Custom Properties | Дизайн-система, адаптив |
| Vanilla JS | ES Modules | Без фреймворков, чистый |
| Three.js | r160 | 3D карусель |
| GLB / glTF 2.0 | binary | 5 интерактивных моделей |
| IntersectionObserver | — | Scroll-reveal, рендер по видимости |

## Страницы

| Файл | Описание |
|---|---|
| `index.html` | Главная — hero, 3D-карусель «Сердце доверия», 3 шага, актуальные сборы |
| `catalog.html` | Каталог 6 сборов с фильтрами по категориям |
| `campaign.html` | Страница сбора — история, виджет пожертвования (sticky), timeline |
| `how-it-works.html` | 4 шага, прозрачность, FAQ-аккордеон |
| `help.html` | Форма заявки + sidebar «Что будет дальше» |
| `about.html` | Миссия, 4 ценности, команда, статистика |

## 3D Карусель

Файлы в `models/`:
- `heart.glb` — Сердце доверия (центральная модель)
- `urn.glb` — Урна прозрачности
- `hand.glb` — Ладонь помощи
- `door.glb` — Дверь возможностей
- `document.glb` — Документ отчёта

**Управление:**
- Стрелки клавиатуры ← →
- Свайп (touch)
- Клик на точки навигации
- Кнопки prev/next
- Мышь: вращение модели (OrbitControls)

**Производительность:**
- Lazy load через `IntersectionObserver` — рендер только когда видим
- Каждая модель грузится один раз и кэшируется
- `prefers-reduced-motion: reduce` отключает auto-rotate

## Доступность WCAG 2.2 AA

- ✓ Контраст ≥ 4.5:1 (текст), ≥ 3:1 (UI)
- ✓ Touch targets ≥ 44×44 px
- ✓ Focus rings 3px outline
- ✓ Skip link `#main`
- ✓ ARIA labels / roles
- ✓ Semantic HTML (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<article>`)
- ✓ `prefers-reduced-motion` поддержка
- ✓ Адаптив 320–1440px

## Запуск

```bash
# Локально — любой статический сервер
npx serve .
# или
python -m http.server 8000
```

Открой `http://localhost:8000` или `http://localhost:3000`.

## Структура

```
frontend/
├── index.html          # Главная
├── catalog.html        # Каталог сборов
├── campaign.html       # Страница сбора
├── how-it-works.html   # Как работает
├── help.html           # Получить помощь
├── about.html          # О нас
├── css/
│   └── style.css       # Дизайн-система + компоненты
├── js/
│   ├── main.js         # Burger, scroll-reveal, форма
│   └── three-carousel.js  # Three.js 3D карусель
└── models/             # 5 GLB файлов
```

## Ссылки

- 🎨 [Figma макет](https://www.figma.com/design/bxHyZeZRHFzhCN7HLHPK2B)
- 📸 [Behance кейс](https://www.behance.net/maxkogan1622)
- 🌐 [Dprofile](https://dprofile.ru/mk_design)

## Автор

**Коган Максим Денисович** · 3 курс · Веб-дизайн · КТ4 · 2025

---

© 2025 Добро.доступно. Учебный проект.
