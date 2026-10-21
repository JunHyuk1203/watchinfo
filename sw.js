const CACHE='health-bridge-shell-v2';
const ASSETS=['','index.html','style.css','app.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','config.json'];
const SHELL=ASSETS.map(path=>new URL(path,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!SHELL.includes(event.request.url))return;
 // Only the public application shell; API responses and health data are never cached.
 event.respondWith(fetch(event.request).catch(()=>caches.match(event.request.url).then(response=>response||Response.error())));
});
