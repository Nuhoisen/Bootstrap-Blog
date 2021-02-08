FROM node:14.15.4
# ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
COPY --chown=node:node . .

EXPOSE 8080 
CMD ["npm", "start"]
