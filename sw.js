// sw.js – カップルトリセツ Service Worker
// このファイルを index.html と同じフォルダに置いてください

const CACHE_NAME = 'couple-torisetsu-v1';

// インストール
self.addEventListener('install', e => {
  self.skipWaiting();
});

// アクティベート
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// プッシュ通知受信（将来的なWeb Push対応用）
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {
    title: '💑 カップルトリセツ',
    body: '新しいお知らせがあります'
  };
  e.waitUntil(
    self.registration.showNotification(d.title, {
      body: d.body || '',
      icon: d.icon || '',
      vibrate: [200, 100, 200, 100, 200],
      tag: d.tag || 'couple-torisetsu',
      requireInteraction: true,
      data: { url: d.url || '/' }
    })
  );
});

// 通知タップ時にアプリを開く
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // すでにタブが開いていればフォーカス
      for (const client of list) {
        if (client.url.includes('couple-torisetsu') && 'focus' in client) {
          return client.focus();
        }
      }
      // なければ新しいタブで開く
      return clients.openWindow(url);
    })
  );
});
