

// ======================================================================
// 💡 DICA PARA A PRÓXIMA VEZ QUE VOCÊ MUDAR AS IMAGENS:
// Mude o nome abaixo de 'financas-v2' para 'financas-v3' (e assim por diante).
// Isso vai forçar o aplicativo a limpar a memória antiga e baixar o novo logo.
// ======================================================================
const CACHE_NAME = 'financas-v4'; 

const ASSETS = [
  'index.html',
  'manifest.json',
  'logo.mp4',
  'audio1.mp3',
  'audio2.mp3'
];

// Instala o sw.js e armazena os arquivos essenciais no cache
self.addEventListener('install', e => {
  self.skipWaiting(); // Obriga o app a usar o novo código imediatamente
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Remove os caches antigos (evita que o logo antigo fique travado no celular)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Controla as requisições (Internet primeiro para o Manifest, Cache primeiro para mídia)
self.addEventListener('fetch', e => {
  if (e.request.url.includes('manifest.json')) {
    // Para o manifest, tenta sempre buscar da internet para ver se há ícones novos
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match(e.request)) // Se estiver sem internet, usa o salvo
    );
  } else {
    // Para vídeos e áudios, carrega do cache primeiro (para o app abrir rápido e offline)
    e.respondWith(
      caches.match(e.request).then(response => response || fetch(e.request))
    );
  }
});
