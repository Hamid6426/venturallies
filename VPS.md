# Hostinger VPS Deployment Guide

This guide provides step-by-step instructions for deploying a Node.js (Express) backend and a Vite React frontend on your Hostinger VPS running AlmaLinux 9.6.

---

## 1. Initial Access & Server Details

Here are your VPS login credentials and operating system information:

- **Root User:** `root`
- **Root Password:** `Kachavps.12345`

### OS Details:

- **Operating System:** AlmaLinux 9.6 (Sage Margay)
- **Kernel:** `5.14.0-570.19.1.el9_6.x86_64 on an x86_64`

### How to Log In:

When prompted for login, use `root` and your password.

```bash
srv889025 login: root
Password: Kachavps.12345
```

Once logged in, your terminal prompt will look like this:

```bash
[root@srv889025 ~]#
```

---

## 2. System Preparation

### Update Packages

```bash
dnf update -y
```

### Install Basic Utilities

```bash
dnf install -y git curl wget nano unzip
```

---

## 3. Install Node.js (Latest LTS)

We'll use NodeSource to install Node.js 20.x.

```bash
# Step 1: Install curl if not available
dnf install -y curl

# Step 2: Download NodeSource setup script
curl -fsSL https://rpm.nodesource.com/setup_22.x -o nodesource_setup.sh

# Step 3: Run it
bash nodesource_setup.sh

# Step 4: Install Node.js
dnf install -y nodejs

# Step 5: Verify
node -v
npm -v

```

---

## 4. Set Up Nginx (for Reverse Proxy)

### Install Nginx

```bash
dnf install -y nginx
systemctl enable nginx
systemctl start nginx
```

### Install Firewall
```bash
# Install firewalld if not already present
dnf install -y firewalld
systemctl enable firewalld
systemctl start firewalld

```

### Allow HTTP/HTTPS Through Firewall

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## 5. Folder Structure & Deployment Strategy

We'll use `/var/www/myapp` as the base directory.

```
/var/www/myapp/
├── client/   # Vite React app
└── server/   # Express API
```

### Create Project Directory

```bash
mkdir -p /var/www/myapp && cd /var/www/myapp
```

### Clone Your Projects

```bash
git clone <your-frontend-repo-url> client
git clone <your-backend-repo-url> server
```

---

## 6. Set Up Express Backend (API)

### Install Dependencies

```bash
cd /var/www/myapp/server
npm install
```

### Create .env (if needed)

```bash
nano .env
```

### Build & Start (Manual or PM2)

```bash
npm run build # If needed
npm start     # Manual start
```

### Install & Configure PM2

```bash
npm install -g pm2
pm2 start index.js --name my-backend
pm2 startup
pm2 save
```

---

## 7. Build Vite React App

```bash
cd /var/www/myapp/client
npm install
npm run build
```

---

## 8. Nginx Configuration

### Create Nginx Config

```bash
nano /etc/nginx/conf.d/myapp.conf
```

Paste:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /var/www/myapp/client/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Test and Restart Nginx

```bash
nginx -t
systemctl restart nginx
```

---

## 9. (Optional) HTTPS with Let's Encrypt

### Install Certbot

```bash
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate

```bash
certbot --nginx -d your_domain.com
```

---

## ✅ Final Checklist

- [ ] Node.js Installed: `node -v`, `npm -v`
- [ ] Nginx Configured: `nginx -t`, `systemctl status nginx`
- [ ] PM2 Running Express: `pm2 list`
- [ ] Vite React Built to `dist`
- [ ] Frontend Loading at `http://your_domain_or_ip`
- [ ] API Accessible at `/api/endpoint`
- [ ] HTTPS Enabled with Certbot
