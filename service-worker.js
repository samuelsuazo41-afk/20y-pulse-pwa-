const CACHE_NAME = '20y-pulse-v9.6';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

const timers = new Map();

// 40 frases para notificaciones diarias
const FRASES_MOTIVACION = [
  "☀️ Buenos días - 10 preguntas y hoy estás más cerca del carnet.",
  "🌙 Hora de estudiar - 5 min ahora = 0 fallos mañana.",
  "💪 La racha no se mantiene sola. Abre GasDrive.",
  "🎯 Hoy tocan señales. Mátalas.",
  "🚗 Cada test te acerca al aprobado. Haz 1 más.",
  "⚡ 2 min de estudio > 0 min de excusas.",
  "🏆 Los que aprueban no son más listos. Son más constantes.",
  "🧠 Tu cerebro aprende con repetición. Dale 5 min.",
  "📈 Sube 1 punto tu nota hoy. Mañana otro.",
  "🔥 No pares la racha. Llevas 3 días.",
  "📚 Señales, prioridades, velocidad. Repasa.",
  "✅ Un test ahora evita 1 fallo el día del examen.",
  "🎓 El aprobado se gana en casa, no en la DGT.",
  "⏱️ 5 min mal invertidos en Instagram. Invierte en ti.",
  "🚦 Si dudas en prioridades, repasa ahora.",
  "💡 Error cometido es error aprendido. Repítelo.",
  "🎯 Hoy: 0 fallos en señales. Objetivo claro.",
  "📊 Tu estadística sube con cada pregunta.",
  "🔒 Bloquea distracciones. 10 min solo para ti.",
  "🏁 Meta: 0 fallos en el simulacro. Empieza.",
  "📝 Escribe lo que fallas. Luego repásalo.",
  "🚀 Modo turbo activado. Haz 1 test rápido.",
  "⚠️ Los fallos tontos se evitan practicando.",
  "🎖️ Cada día que estudias te separas del resto.",
  "🧩 Las normas encajan cuando las repites.",
  "📱 5 min aquí valen más que 1h procrastinando.",
  "🎯 Hoy toca circular en intersecciones. Dale.",
  "💪 Constancia > Motivación. Abre la app.",
  "📖 Lee la explicación de tu último fallo.",
  "🏆 Imagina recibir el apto. Trabaja por ello.",
  "⏳ El tiempo pasa igual estudies o no. Elige.",
  "🚦 Prioridad a la derecha. ¿Seguro? Compruébalo.",
  "🔥 3 días seguidos. No rompas la cadena.",
  "📚 Velocidad y distancia de seguridad. Repaso rápido.",
  "✅ Hoy sin fallos en velocidad. Objetivo del día.",
  "🎓 Tu futuro yo te lo agradecerá.",
  "🧠 Memoria a corto plazo: repite las falladas.",
  "📈 +1 test = +1% de probabilidad de aprobar.",
  "💡 Si lo entiendes, no se te olvida.",
  "🏁 Último empujón. Haz el test de ahora."
];

// Instalar
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activar
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Fetch para offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Notificaciones diarias locales
self.addEventListener('periodicsync', event => {
  if (event.tag === '20y-notif') {
    event.waitUntil(enviarNotificacionDiaria());
  }
});

async function enviarNotificacionDiaria() {
  const frase = FRASES_MOTIVACION[Math.floor(Math.random() * FRASES_MOTIVACION.length)];
  const partes = frase.split(' - ');

  await self.registration.showNotification(partes[0], {
    body: partes[1],
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: '20y-daily',
    renotify: true
  });
}

// Notificaciones puntuales desde app.js
self.addEventListener('message', event => {
  if (event.data.type === 'PROGRAMAR_NOTIF') {
    const { id, delay, titulo, cuerpo } = event.data;
    if (timers.has(id)) clearTimeout(timers.get(id));

    const timer = setTimeout(async () => {
      await self.registration.showNotification(titulo, {
        body: cuerpo,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: id,
        renotify: true
      });
      timers.delete(id);
    }, delay);

    timers.set(id, timer);
  }

  if (event.data.type === 'CANCELAR_NOTIF') {
    if (timers.has(event.data.id)) {
      clearTimeout(timers.get(event.data.id));
      timers.delete(event.data.id);
    }
  }
});

// OneSignal push
self.addEventListener('push', event => {
  const data = event.data? event.data.json() : {};
  const title = data.title || '20Y PULSE';
  const options = {
    body: data.body || 'Nueva orden de ejecución lista',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || '20y-general',
    requireInteraction: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Click en notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./'));
});
