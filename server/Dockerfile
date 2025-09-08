FROM node:22.14.0-alpine
WORKDIR /server
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm","start"]