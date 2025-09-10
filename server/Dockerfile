FROM node:22.14.0-alpine
WORKDIR /server
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 5000
CMD ["sh", "-c", "npx prisma db push && npm start"]