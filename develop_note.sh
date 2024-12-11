远程开发
首先停止nginx和node进程
1. 停止nginx
sudo systemctl stop nginx

2. 停止nohup启动的node进程
ps -ef | grep /home/xiao/attendance_system/cloud-sql-api/server.js
找到对应的pid
kill -9 <pid>

3. 进入开发环境
node server.js
npm run serve -- --host 0.0.0.0
sudo ufw allow 8080/tcp
http://64.176.35.117:8080/

4. 重启nginx
sudo nginx -t
sudo systemctl reload nginx

5. 重启nohup启动的node进程
nohup node /home/xiao/attendance_system/cloud-sql-api/server.js &


