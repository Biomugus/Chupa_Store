# Соглашение о коммитах

Проект использует [Conventional Commits](https://www.conventionalcommits.org/), формат проверяется **commitlint** + **husky**.

---

## Как коммитить

### Рекомендуется: интерактивный мастер

```bash
npm run commit
```

Запускает **Commitizen** — он по шагам задаёт вопросы и сам собирает корректное сообщение коммита.

### Вручную

```bash
git commit -m "type(scope): short description"
```

---

## Формат

```
type(scope): subject

[необязательное тело]

[необязательный футер]
```

### Правила

| Правило                     | Значение                   |
| --------------------------- | -------------------------- |
| Длина заголовка             | **не больше 72 символов**  |
| Регистр `subject`           | **строчные буквы**         |
| Конец `subject`             | **без точки `.`**          |
| Регистр `type`              | **строчные буквы**         |
| `subject`                   | **не пустой**              |
| Длина строки в теле коммита | **не больше 150 символов** |

### Язык

- Заголовок коммита (`type(scope): subject`) и заголовок PR — на английском.
- Тело коммита и описание PR — на русском.
- Идентификаторы, пути к файлам и команды — как в коде.

---

## Допустимые типы

| Тип        | Когда использовать                               |
| ---------- | ------------------------------------------------ |
| `feat`     | Новая функциональность для пользователя          |
| `fix`      | Исправление ошибки                               |
| `docs`     | Только документация                              |
| `style`    | Форматирование, пробелы — без изменения логики   |
| `refactor` | Перестройка кода без новой функции и исправлений |
| `perf`     | Улучшение производительности                     |
| `test`     | Добавление или исправление тестов                |
| `build`    | Сборка или зависимости                           |
| `ci`       | Настройка CI/CD                                  |
| `chore`    | Прочее (конфиги, скрипты)                        |
| `revert`   | Откат предыдущего коммита                        |

---

## Примеры

```bash
# Хорошо
feat(auth): add google oauth login
fix(cart): prevent duplicate items on add
refactor(ui): centralize button styles with css variables
docs: update readme with setup instructions
chore: upgrade eslint to v9

# Плохо — заголовок длиннее 72 символов
refactor: Centralize button styles and implement CSS variables for a consistent design system.

# Плохо — subject с заглавной буквы
feat(auth): Add Google OAuth Login

# Плохо — точка в конце
fix(cart): prevent duplicate items.
```

---

## Как это работает

1. **`npm run commit`** → выполняет `git add -A` (добавляет в коммит **всё**, включая неотслеживаемые файлы), затем `cz` (мастер Commitizen)
2. Вы отвечаете на вопросы → Commitizen собирает сообщение
3. **Хук `pre-commit`** → запускает `lint-staged` (prettier для файлов в индексе)
4. **Хук `commit-msg`** → запускает `commitlint` для проверки сообщения
5. Если проверка не прошла → коммит отклоняется с понятной ошибкой

Файлы конфигурации:

- `commitlint.config.js` — правила проверки
- `.husky/pre-commit` — git-хук, запускающий lint-staged
- `.husky/commit-msg` — git-хук, запускающий commitlint
- `package.json` → `lint-staged` — какие файлы форматирует prettier
