# ДЗ №2 — Counter + Switch «не телефонувати»

React + Vite + TypeScript проєкт з **FSD-архітектурою**.

## ✨ Функціонал

- **Лічильник** (+/-/reset) зі стильовим відображенням значення
  - Зелений підсвіт при позитивних значеннях
  - Червоний підсвіт при від'ємних значеннях
- **Перемикач «не телефонувати»** (feature на базі `checkbox`)
  - Реалізований через базовий компонент `Switch` зі `shared/ui`
  - Власна бізнес-логіка у `features/do-not-call`
  - Стан телефону відображається іконкою та повідомленням

## 🏗️ Архітектура FSD

```
src/
├── app/                          # Ініціалізація
│   ├── App.tsx
│   └── styles/global.css
├── pages/home/                   # Головна сторінка
├── widgets/counter/              # Лічильник (ComposedWidget)
├── features/do-not-call/         # Feature: перемикач «не телефонувати»
│   ├── model/useDoNotCall.ts     # Стан та логіка
│   └── ui/DoNotCallToggle.tsx    # UI компонент
└── shared/ui/Switch/             # Базовий Switch компонент
    ├── Switch.tsx                # Доступний checkbox-based toggle
    └── Switch.module.css
```

## 🚀 Запуск

```bash
npm install
npm run dev
```
