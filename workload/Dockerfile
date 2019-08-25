FROM node:10-alpine
COPY package*.json ./
RUN npm install
RUN apk --no-cache add curl
COPY . .
EXPOSE 4080
CMD node server.js
