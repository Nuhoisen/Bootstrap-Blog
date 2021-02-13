FROM node:14.15.4
# ENV NODE_ENV=production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./
RUN npm install

# RUN npm install nodemon -g
RUN npm install pm2 -g
COPY . .
# COPY --chown=node:node . .

# Exports
EXPOSE 8080 
CMD ["npm", "run", "devStart"]
