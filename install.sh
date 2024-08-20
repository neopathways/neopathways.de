sudo apt install unzip -y
sudo apt install curl -y

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Install bun

curl -fsSL https://bun.sh/install | bash

source /root/.bashrc

sudo apt install nginx -y
sudo apt install snapd -y
sudo snap install --classic certbot

sudo ln -s /snap/bin/certbot /usr/bin/certbot

touch /etc/nginx/sites-available/neopathways.de

echo "server {
		listen 80;
		server_name neopathways.de www.neopathways.de;

		location / {
				proxy_pass http://localhost:4321;
				proxy_http_version 1.1;
				proxy_set_header Upgrade \$http_upgrade;
				proxy_set_header Connection 'upgrade';
				proxy_set_header Host \$host;
				proxy_cache_bypass \$http_upgrade;
		}
}" > /etc/nginx/sites-available/neopathways.de

ln -s /etc/nginx/sites-available/neopathways.de /etc/nginx/sites-enabled/neopathways.de

sudo certbot --nginx -d neopathways.de

sudo systemctl restart nginx

sudo apt install git -y

git clone https://github.com/neopathways/neopathways.de

cd neopathways.de

bun install