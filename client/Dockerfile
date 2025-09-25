FROM node:22.14.0-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i
RUN npm i -g serve
COPY . .
EXPOSE 8080
CMD [ "npm","run","dev" ]