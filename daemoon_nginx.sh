source ~/.profile
source ~/.bashrc
#!/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin 
phymemused=`free | grep 'buffers/cache' | awk '{print $3}'`
max=285000
if [ $phymemused -gt $max ]
then
/usr/local/openresty/nginx/sbin/nginx  -p `pwd`/ -c /root/work/conf/mobile.conf -s stop
/usr/local/openresty/nginx/sbin/nginx  -p `pwd`/ -c /root/work/conf/mobile.conf

fi

