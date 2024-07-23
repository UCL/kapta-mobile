import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { registerRoute } from 'workbox-routing';
import { clientsClaim } from 'workbox-core';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

// const matchCb = ({ url, request, event }) => {
//     return url.pathname === '/share-target';
// };

// const handlerCb = async ({ url, request, event, params }) => {
//     const data = await event.request.formData();
//     const file = data.get('file');
//     const client = await self.clients.get(event.resultingClientId);
//     client.postMessage({ file });
//     event.respondWith(Response.redirect('./index.html'))
// }

// registerRoute(matchCb, handlerCb, 'POST');

self.addEventListener('install', (event) => {
    self.skipWaiting();
})

self.addEventListener('fetch', (event) => {

    if (event.request.url.endsWith('/share-target') && event.request.method === "POST") {
        const formDataPromise = event.request.formData();

        event.respondWith(Response.redirect('./index.html?share-target', 303));

        event.waitUntil(
            (async function () {
                // The page sends this message to tell the service worker it's ready to receive the file.
                await nextMessage('share-ready');
                const client = await self.clients.get(event.resultingClientId);
                const data = await formDataPromise;
                const file = data.get('file');
                client.postMessage({ file, action: 'load-map' });
            })(),
        );
    }
})

const nextMessageResolveMap = new Map();

/**
 * Wait on a message with a particular event.data value.
 *
 * @param dataVal The event.data value.
 */
function nextMessage(dataVal) {
    return new Promise((resolve) => {
        if (!nextMessageResolveMap.has(dataVal)) {
            nextMessageResolveMap.set(dataVal, []);
        }
        nextMessageResolveMap.get(dataVal).push(resolve);
    });
}

self.addEventListener('message', (event) => {
    const resolvers = nextMessageResolveMap.get(event.data);
    if (!resolvers) return;
    nextMessageResolveMap.delete(event.data);
    for (const resolve of resolvers) resolve();
});