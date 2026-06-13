const CACHE='detox-v12';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const isDoc=req.mode==='navigate'||req.destination==='document';
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(req);
    const net=fetch(req).then(res=>{if(res&&res.status===200)cache.put(req,res.clone());return res;}).catch(()=>null);
    return cached||(await net)||(isDoc?cache.match('./index.html'):Response.error());
  })());
});
