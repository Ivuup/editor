#!/bin/sh
ls dev | grep Playground.vue || cp dev/Playground.example.vue dev/Playground.vue && chown 1000:1000 dev/Playground.vue

npm i
npm rebuild node-sass

npm run serve