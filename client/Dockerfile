FROM node:22.14.0-alpine
WORKDIR /client
COPY package.json .
COPY package-lock.json .
RUN npm i
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]