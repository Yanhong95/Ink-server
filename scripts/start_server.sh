 _#!/bin/bash_

export PM2_HOME=/home/ubuntu/.pm2  
pm2 delete Ink-server   
cd /home/ubuntu/Ink-server /  
pm2 start --name Ink-server npm -- start