apt update && apt upgrade -y
apt install git ffmpeg imagemagick webp curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install v22.20.0
nvm alias default v22.20.0
nvm use default
npm install -g pm2
yarn
pm2 start pm2.config.cjs && pm2 logs moon-bot