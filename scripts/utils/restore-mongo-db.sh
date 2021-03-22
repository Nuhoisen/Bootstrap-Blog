#!/bin/sh

# This requires that the backup server has restored it's images over to this one.
# Log into the backup server and execute script:
#						restore-db-to-host.sh
MONGO_CONTAINER=mongo
BACKUP_DIR=docker-node-mongo


HOST_SERVER_PROJECT_DIR=/home/kelly/Bootstrap-Blog

#docker container stop $MONGO_CONTAINER

export $(grep -v '^#' $HOST_SERVER_PROJECT_DIR/.env | xargs -d '\n')
uri_credentials=$(eval echo ${MONGO_URI})

# docker-compose up   --build --detach  $MONGO_CONTAINER # Rebuild the database

sleep 2

docker exec -ti $MONGO_CONTAINER mkdir restore-backup -p
docker cp  ./mybackup/$BACKUP_DIR $MONGO_CONTAINER:/restore-backup

for i in `docker exec -ti mongo find restore-backup/$BACKUP_DIR -name "*.bson" | tr -d '\r'`; do docker exec -ti  mongo  mongorestore --host localhost:27017  --username ${MONGO_DATABASE_USERNAME} --password ${MONGO_DATABASE_PASSWORD} --db ${MONGO_INITDB_DATABASE}  /"$i"; done
