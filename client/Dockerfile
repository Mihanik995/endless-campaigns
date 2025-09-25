FROM node:22.14.0-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "npm","run","preview" ]