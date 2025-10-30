FROM node:22.14.0-alpine AS frontend-builder
WORKDIR /app/frontend

COPY client/package*.json ./
RUN npm install

COPY client ./
RUN npm run build

FROM node:22.14.0-alpine AS backend-builder
WORKDIR /app/backend

COPY server/package*.json ./
COPY server/prisma ./prisma
RUN npm install

COPY server ./

RUN npx prisma generate
RUN npm run build

FROM node:22.14.0-alpine
WORKDIR /app

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

COPY --from=backend-builder /app/backend/prisma ./backend/prisma
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm install --omit=dev
RUN npx prisma generate

EXPOSE 5000
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]