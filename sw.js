const CACHE = 'finanzas-pro-v2-2.07';
const ASSETS = ['./index.html', './manifest.json', './xlsx.full.min.js'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(a => fetch(a+'?v='+Date.now(),{cache:'no-store'}).then(r=>{if(r.ok)c.put(a,r);}).catch(()=>{}))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url); const esPropio=url.origin===self.location.origin;
  if(!esPropio){e.respondWith(fetch(e.request).catch(()=>new Response('',{status:503})));return;}
  const bust=new URL(e.request.url); bust.searchParams.set('_sw',Date.now());
  const req=new Request(bust.toString(),{method:'GET',headers:e.request.headers,mode:e.request.mode==='navigate'?'same-origin':e.request.mode,credentials:e.request.credentials,redirect:e.request.redirect,cache:'no-store'});
  e.respondWith(fetch(req).then(res=>{if(res.status===200){const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}return res;}).catch(()=>caches.match(e.request)));
});
