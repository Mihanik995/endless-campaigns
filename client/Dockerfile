FROM node:22.14.0-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
EXPOSE 8080
CMD [ "npm","run","dev" ]