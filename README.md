# This is a general template for a blog based on Bootstrap

## Tailor by modifying fields in blog_data.json in ./statc/blog_content


## Start Up ( In Case of System Reboot )

### First initiate Mongoose Server:
        systemctl start mongod

### Open IP tables for Mongoose DB:
        iptables -A INPUT -s <ip-address> -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
        iptables -A OUTPUT -d <ip-address> -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
[ Source ] ( https://docs.mongodb.com/manual/tutorial/configure-linux-iptables-firewall/ )
