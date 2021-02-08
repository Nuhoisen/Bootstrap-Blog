## This is a general template for a blog based on Bootstrap

        Tailor by modifying fields in blog_data.json in ./statc/blog_content

## Revised (1/31/2021)
This web-site now uses docker to port between platforms. Implements a mongo volume from docker's repository.

Install docker.

Running debug mode, from Bootstrap-blog directory:

        docker-compose up --build
Running production mode uses pm2 in detached mode:

         docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build --detach

To stop running build:
        
        docker-compose down

To clean up stalled jobs:

        docker system prune -a




## Start Up ( In Case of System Reboot )

### First initiate Mongoose Server:
        systemctl start mongod

### Open IP tables for Mongoose DB:
        iptables -A INPUT -s <ip-address> -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
        iptables -A OUTPUT -d <ip-address> -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
[ Source ]( https://docs.mongodb.com/manual/tutorial/configure-linux-iptables-firewall/ )




## NGINX configuration
More information [here.]( https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose )

## Firewall

### ssh

        ufw allow ssh

### http

        ufw allow http

### https

        ufw allow https

See 
[ Digital Oceans Guide ]( https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04#step-4-%E2%80%94-setting-up-a-basic-firewall)on Firewall for further details.