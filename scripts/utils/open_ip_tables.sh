#!/bin/bash
iptables -A INPUT -s $1 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -d $1 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT

