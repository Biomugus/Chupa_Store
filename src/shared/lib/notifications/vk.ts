// src/shared/lib/notifications/vk.ts
//
// Канал уведомлений: сообщение от имени сообщества VK в личные сообщения
// основателям или в беседу сообщества. Только для серверного кода.
//
// VK_GROUP_TOKEN     — ключ доступа сообщества с правом «Сообщения сообщества».
// VK_NOTIFY_PEER_IDS — получатели через запятую: id страниц (каждый должен
//                      первым написать сообществу) или peer_id беседы (2000000000 + N).

import { NOTIFICATION_TIMEOUT_MS, type ChannelResult, type OwnerNotification } from './types';

const VK_API_URL = 'https://api.vk.com/method/messages.send';
const VK_API_VERSION = '5.199';

type VkSendResponse = { response?: number; error?: { error_code: number; error_msg: string } };

function parsePeerIds(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

async function sendToPeer(token: string, peerId: string, message: string): Promise<string | null> {
  let vkResponse: Response;

  try {
    vkResponse = await fetch(VK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        access_token: token,
        v: VK_API_VERSION,
        peer_id: peerId,
        // random_id защищает от дублей при повторной отправке тем же значением.
        random_id: String(Math.floor(Math.random() * 2 ** 31)),
        message,
      }),
      signal: AbortSignal.timeout(NOTIFICATION_TIMEOUT_MS),
    });
  } catch (networkError) {
    return `${peerId}: ${String(networkError)}`;
  }

  if (!vkResponse.ok) {
    return `${peerId}: HTTP ${vkResponse.status}`;
  }

  // Ошибки VK API приходят с HTTP 200 и полем error в теле.
  const body = (await vkResponse.json().catch(() => null)) as VkSendResponse | null;
  if (!body || body.error) {
    return `${peerId}: ${body?.error ? `${body.error.error_code} ${body.error.error_msg}` : 'invalid response'}`;
  }

  return null;
}

export async function sendVkMessage(notification: OwnerNotification): Promise<ChannelResult> {
  const token = process.env.VK_GROUP_TOKEN;
  const peerIds = parsePeerIds(process.env.VK_NOTIFY_PEER_IDS);

  if (!token || peerIds.length === 0) {
    return { ok: false, reason: 'misconfigured' };
  }

  const errors = (
    await Promise.all(peerIds.map((peerId) => sendToPeer(token, peerId, notification.text)))
  ).filter((error): error is string => error !== null);

  // Канал считается упавшим, если не дошло хоть одному получателю, — чтобы это
  // было видно в колонке notifications, а не терялось за частичным успехом.
  if (errors.length > 0) {
    return { ok: false, reason: 'failed', status: 0, error: errors.join('; ') };
  }

  return { ok: true };
}
