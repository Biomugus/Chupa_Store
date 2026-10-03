# Модуль contacts

## Зона ответственности

Страница `/contacts`: каналы связи с мастерской и форма обращения. Обращение сохраняется в Supabase (`feedback_requests`) и рассылается по тем же каналам, что и заказы, — см. [notifications.md](notifications.md).

## Структура

- `containers/ContactsPage` — серверная сборка страницы (первый экран → каналы + форма → сценарии)
- `containers/ContactFormContainer` — клиентская форма: `useContactForm` + `useSubmitFeedback`
- `model/contactFormSchema` — zod-схема, общая для клиента и `POST /api/feedback`
- `model/contactTopics` — темы обращения, `parseTopic()` для `?topic=`
- `utils/feedbackTextBuilder` — текст уведомления об обращении
- `api/feedbackStorage` — запись обращения в `feedback_requests` (только сервер)

Контакты мастерской берутся из `src/shared/config/contacts.ts` (им же пользуется футер).

## Темы

`question` (по умолчанию), `order`, `custom`, `partnership`, `defect`, `other`.

Тема подставляется из `?topic=`: `/contacts?topic=partnership#contact-form`. Так работают карточки сценариев на странице и ссылки футера «Кастомные проекты», «Сообщить о браке» и «Для партнеров». Неизвестное значение → `question`.

Подсказка (placeholder) в поле «Сообщение» зависит от темы — `CONTACT_TOPIC_PLACEHOLDERS`.

## Сценарий

1. Заполнение формы (валидация при потере фокуса, после ошибки — «на лету»)
2. Отправка: при ошибках — фокус на первое невалидное поле
3. `POST /api/feedback`
4. Успех → экран благодарности / Ошибка → «Повторить попытку» + ссылки на мессенджеры

## Обработка ошибок

- Ошибки валидации (клиент и `422.details` сервера) → под полями
- Системные ошибки → баннер с повтором (отправляются текущие значения формы)
