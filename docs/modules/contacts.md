# Contacts Module

## Responsibility

Страница `/contacts`: каналы связи с мастерской и форма обращения, которая уходит в Telegram-бот (тот же, что и заказы).

## Structure

- `containers/ContactsPage` — серверная сборка страницы (hero → каналы + форма → сценарии)
- `containers/ContactFormContainer` — клиентская форма: `useContactForm` + `useSubmitFeedback`
- `model/contactFormSchema` — zod-схема, общая для клиента и `POST /api/feedback`
- `model/contactTopics` — темы обращения, `parseTopic()` для `?topic=`
- `utils/feedbackTextBuilder` — текст сообщения для Telegram

Контакты мастерской берутся из `src/shared/config/contacts.ts` (им же пользуется футер).

## Topics

`question` (по умолчанию), `order`, `custom`, `partnership`, `defect`, `other`.

Тема подставляется из `?topic=`: `/contacts?topic=partnership#contact-form`. Так работают карточки сценариев на странице и ссылки футера «Кастомные проекты», «Сообщить о браке» и «Для партнеров». Неизвестное значение → `question`.

Подсказка (placeholder) в поле «Сообщение» зависит от темы — `CONTACT_TOPIC_PLACEHOLDERS`.

## Flow

1. Заполнение формы (валидация на blur, после ошибки — «на лету»)
2. Submit: при ошибках — фокус на первое невалидное поле
3. `POST /api/feedback`
4. Success → экран благодарности / Error → «Повторить попытку» + ссылки на мессенджеры

## Error handling

- Ошибки валидации (клиент и `422.details` сервера) → под полями
- Системные ошибки → баннер с повтором (отправляются текущие значения формы)

## TODO

- Реальный email и график работы в `src/shared/config/contacts.ts` (сейчас заглушки)
