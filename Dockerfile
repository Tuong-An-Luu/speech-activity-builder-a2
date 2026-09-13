FROM node:24-bookworm-slim

WORKDIR /app

ENV DATABASE_URL="file:./dev.db"

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --config prisma7.config.ts

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && npm start"]