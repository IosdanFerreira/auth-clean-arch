#!/bin/bash

npm install
npm run build
npm install prisma -D
npm run start:dev
npm install @prisma/client
npx prisma generate
npx prisma migrate dev