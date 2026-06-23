

// ======================================================================
// 💡 DICA PARA A PRÓXIMA VEZ QUE VOCÊ MUDAR AS IMAGENS:
// Mude o nome abaixo de 'financas-v2' para 'financas-v3' (e assim por diante).
// Isso vai forçar o aplicativo a limpar a memória antiga e baixar o novo logo.
// ======================================================================

// ===================================================
// ALTERE APENAS O NÚMERO DA VERSÃO
// ===================================================
const CACHE_NAME = 'financas-v5';

const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'logo.mp4',
  'audio1.mp3',
  'audio2.mp3'
];

// Instala
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Ativa
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
      clients.claim()
    ])
  );
});

// Busca arquivos
self.addEventListener('fetch', event => {

  // Manifest sempre atualizado pela internet
  if (
    event.request.url.includes('manifest.json')
  ) {

    event.respondWith(
      fetch(event.request, {
        cache: 'no-store'
      })
      .then(response => {
        const clone = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, clone));

        return response;
      })
      .catch(() => caches.match(event.request))
    );

    return;
  }

  // Ícones sempre atualizados
  if (
    event.request.url.includes('ibb.co') ||
    event.request.url.includes('.png')
  ) {

    event.respondWith(
      fetch(event.request, {
        cache: 'reload'
      })
      .then(response => response)
      .catch(() => caches.match(event.request))
    );

    return;
  }

  // Restante: cache primeiro
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
