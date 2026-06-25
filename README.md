# React Clock App — Feature-Sliced Design

Веб-застосунок на **React + Vite + TypeScript**, що відображає поточний час і дату **українською мовою** у двох форматах.

## ✨ Особливості

- 🕐 **Аналоговий годинник** з CSS-анімованими стрілками
- 🗓️ **Людино-зрозумілий рядок**: «25 червня 2026 р. 12:42:09»
- 📊 **Таблиця** з детальною розбивкою (день тижня, рік, місяць, день, година, хвилина, секунда)
- 🔄 Оновлення **кожну секунду** через `setInterval`
- 🌙 Преміальний **dark mode** дизайн (glassmorphism, градієнти, анімації)
- 📱 **Адаптивний** дизайн

## 🏗️ Архітектура — Feature-Sliced Design (FSD)

```
src/
├── app/                    # Ініціалізація застосунку
│   ├── App.tsx
│   ├── styles/global.css
│   └── ...
├── pages/                  # Сторінки
│   └── home/
│       ├── ui/HomePage.tsx
│       └── index.ts
├── widgets/                # Складні UI-блоки
│   └── clock/
│       ├── ui/ClockWidget.tsx
│       └── index.ts
├── features/               # Бізнес-логіка / інтерактивність
│   └── current-time/
│       ├── model/useCurrentTime.ts
│       └── index.ts
└── entities/               # Доменні сутності
    └── datetime/
        ├── lib/formatDateTime.ts
        └── index.ts
```

## 🚀 Запуск

```bash
npm install
npm run dev
```

## 🛠️ Технологічний стек

| Технологія | Версія |
|------------|--------|
| React | 19 |
| Vite | 6 |
| TypeScript | 5.8 |
| CSS Modules | — |
| Orbitron (Google Fonts) | — |

## 📐 Формат дати

Відображення реалізовано **без зовнішніх i18n-бібліотек** — масиви назв місяців та днів тижня українською мовою вбудовано безпосередньо у `formatDateTime.ts`.
