FROM node:16
ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

COPY . .

RUN npm install --development

RUN npx prisma generate

RUN npx prisma migrate dev

RUN npm run tsc

CMD [ "node", "dist/index.js" ]