### This is forked version of master blog intending to serve as a contracting site.
## For information on merging this branch with master. See source:
https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging



## This is a general template for a blog based on Bootstrap

        Tailor by modifying fields in blog_data.json in ./statc/blog_content

## Revised (1/31/2021)
This web-site now uses docker to port between platforms. Implements a mongo volume from docker's repository.

Install docker.

Running developer mode, from Bootstrap-blog directory:

        docker-compose -f docker-compose.yml up --build
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


### Model .env
        JWT_SECRET=<anything>

        MONGO_LOCAL_CONN_URL=mongodb://mongo_email_server:27017/docker-email
        SESSION_SECRET=<anything>

        ADMIN_USER_EMAIL=kellyhonsing@gmail.com

        CLOUD_NAME=<generate_this>
        CLOUD_API_KEY=<generate_this>
        CLOUD_API_SECRET=<generate_this>

        SENDGRID_API_KEY_ORIGINAL=<generate_this>
        SENDGRID_API_KEY=<generate_this>
        FROM_EMAIL=kellyhonsing@gmail.com

        AWSAccessKeyId=<generate_this>
        AWSSecretKey=<generate_this>