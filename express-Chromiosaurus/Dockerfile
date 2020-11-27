FROM node:12-alpine
WORKDIR /express-Chromiosaurus
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
EXPOSE 3000