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
        SESSION_SECRET=pass
        ADMIN_USER_EMAIL=@gmail.com

        JWT_SECRET=jwt_sec

        CLOUD_NAME=dxkxlckgz
        CLOUD_API_KEY=214436356871222
        CLOUD_API_SECRET=OO7o3vCkoTI8a6fb-oLBHyZtJew

        SENDGRID_API_KEY_ORIGINAL=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
        SENDGRID_API_KEY=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
        FROM_EMAIL=@gmail.com