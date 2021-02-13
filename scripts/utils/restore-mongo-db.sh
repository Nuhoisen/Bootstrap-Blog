#!/bin/sh

# This requires that the backup server has restored it's images over to this one.
# Log into the backup server and execute script:

MONGO_CONTAINER=mongo
BACKUP_DIR=docker-node-mongo


docker container stop $MONGO_CONTAINER
docker container rm $MONGO_CONTAINER


docker system prune -a 		# delete stopped volumes



docker-compose up   --build --detach  $MONGO_CONTAINER # Rebuild the database

sleep 2

docker exec -ti $MONGO_CONTAINER mkdir restore-backup -p
docker cp  ./mybackup/$BACKUP_DIR $MONGO_CONTAINER:/restore-backup

for i in `docker exec -ti mongo find restore-backup/$BACKUP_DIR -name "*.bson" | tr -d '\r'`; do docker exec -ti  mongo mongorestore /"$i"; done
