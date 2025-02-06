#!/bin/bash

echo "conectando al servidor remoto..."

apt update

apt install npm nodejs certbot 

npm install

#generar certificados ssl usando certbot
certbot certonly --standalone -d dev3.cyberbunny.online --non-interactive --agree-tos -m estivencamachops@gmail.com

#copiar los certificados generados a la ubicación essperada por tu apllicación
cp /etc/letsencrypt/live/dev3.cyberbunny.online/fullchain.pem
cp /etc/letsencrypt/live/dev3.cyberbunny.online/privkey.pem


echo "proceso completado"