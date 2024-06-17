
FROM node:22-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm install

EXPOSE 3005


CMD ["npm", "start"]
