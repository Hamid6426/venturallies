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

We'll use `/var/www/venturallies` as the base directory.

```
/var/www/venturallies/
├── frontend/   # Vite React app
└── backend/   # Express API
```

### Clone Your Projects

```bash
git clone https://github.com/Hamid6426/venturallies
```

---

## 6. Set Up Express Backend (API)

### Install Dependencies

```bash
cd /var/www/venturallies/backend
npm install
```

### Create .env (if needed)

```bash
nano .env
```

### Add environment Variables
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/venturallies-database
JWT_SECRET=your_super_secret_key
```
Save and Exit: Ctrl + I, Enter, Ctrl + X.

### Install & Configure PM2 & Start Server with PM2

```bash
npm install -g pm2
# Start process from file index.js and name the process as venturallies-backend
pm2 start index.js --name venturallies-backend
pm2 startup
pm2 save
```

---

## 7. Build Vite React App

```bash
cd /var/www/venturallies/frontend
npm install
npm run build   
```

---

## 8. Nginx Configuration

### Create Nginx Config

```bash
nano /etc/nginx/conf.d/venturallies.conf
```

Paste:

```nginx
server {
    listen 80;
    server_name 62.72.35.200;

    root /var/www/venturallies/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
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

10. Install & Use MongoDB Locally on VPS (Free)
    MongoDB is not pre-installed on AlmaLinux, so we’ll install it manually and run it as a local database, free of cost, without external services like Atlas.

🔹 Step 1: Create MongoDB Repo File

```bash
nano /etc/yum.repos.d/mongodb-org.repo
Paste the following (for MongoDB 7.0 — the latest stable version as of July 2025):
```

```ini
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
```

Save and exit (Ctrl + O, Enter, Ctrl + X).

Step 2: Install MongoDB

```bash
dnf install -y mongodb-org
```

🔹 Step 3: Start & Enable MongoDB

```bash
systemctl start mongod
systemctl enable mongod
systemctl status mongod
```

MongoDB should now be running on port 27017 locally.

🔹 Step 4: Configure Firewall (If Needed)
If your Express app or tools need to access MongoDB from another VPS or local machine, allow port 27017 (optional):

firewall-cmd --permanent --add-port=27017/tcp
firewall-cmd --reload
❗ You don’t need to open this port if you're using MongoDB only internally (recommended for security).

🔹 Step 5: Connect to MongoDB from Your App
In your .env file in the Express backend:

MONGO_URI=mongodb://127.0.0.1:27017/mydatabase

Use this in your Node.js app:

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
🔹 Step 6: MongoDB CLI Access (Optional)
To access MongoDB shell:

mongosh
If needed, create a DB or collection from here.

## ✅ Final Checklist

- [ ] Node.js Installed: `node -v`, `npm -v`
- [ ] Nginx Configured: `nginx -t`, `systemctl status nginx`
- [ ] PM2 Running Express: `pm2 list`
- [ ] Vite React Built to `dist`
- [ ] Frontend Loading at `http://your_domain_or_ip`
- [ ] API Accessible at `/api/endpoint`
- [ ] HTTPS Enabled with Certbot

---

---

---

Here’s a revised and verified version of the MongoDB section for AlmaLinux 9 that aligns with official docs and best practices:

✅ 10. Install & Use MongoDB Locally on VPS (Free)
📚 Official Guidance
MongoDB 7.0 Community Edition is fully supported on AlmaLinux 9 (and RHEL 9)
mongodb.com
+12
reintech.io
+12
howtoforge.com
+12
mongodb.com
+2
mongodb.com
+2
mongodb.com
+2
.

MongoDB 6.0+ is also compatible, though MongoDB 7.0 is recommended.

🔧 Step 1: Add the MongoDB Repository
Create a repo file for MongoDB 7.0:

bash
Copy
Edit
cat <<EOF > /etc/yum.repos.d/mongodb-org-7.0.repo
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF
This matches the official setup instructions
hostperl.com
+3
mongodb.com
+3
shape.host
+3
.

🚀 Step 2: Install MongoDB
bash
Copy
Edit
dnf clean all
dnf update -y
dnf install -y mongodb-org
This installs the mongod, mongosh, and associated tools.

🔁 Step 3: Enable & Start Service
bash
Copy
Edit
systemctl enable mongod
systemctl start mongod
systemctl status mongod
Ensure MongoDB service is active.

🔓 Step 4: (Optional) Open Firewall Port
Only needed for external access (not recommended for security):

bash
Copy
Edit
firewall-cmd --permanent --add-port=27017/tcp
firewall-cmd --reload
🔗 Step 5: Connect from Express App
In your backend .env:

ini
Copy
Edit
MONGO_URI=mongodb://127.0.0.1:27017/mydatabase
And in Node.js (using Mongoose):

js
Copy
Edit
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
🧪 Step 6: Verify with CLI
Access MongoDB shell:

bash
Copy
Edit
mongosh
Then check:

js
Copy
Edit
db.runCommand({ connectionStatus: 1 });
If successful, you're connected.

📌 Optional: Enable Authentication (Highly Recommended)
To add security:

Enable in /etc/mongod.conf:

yaml
Copy
Edit
security:
authorization: "enabled"
Restart MongoDB:

bash
Copy
Edit
systemctl restart mongod
Create admin user via mongosh:

js
Copy
Edit
use admin
db.createUser({
user: "adminUser",
pwd: "strongPassword",
roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
});
Update connection string:

bash
Copy
Edit
MONGO_URI=mongodb://adminUser:strongPassword@127.0.0.1:27017/mydatabase?authSource=admin
✅ Updated Checklist
Repo set up for MongoDB 7.0

mongodb-org installed

mongod service active & enabled

.env includes MONGO_URI

Connectivity verified with mongosh

(Optional) Authentication enabled & admin user created

🗒️ Summary
You’re using the official MongoDB 7.0 repo for AlmaLinux 9, which is current and supported.

Everything — repo file, install commands, service, and CLI verification — is now accurate and matches MongoDB’s own documentation.

Added optional authentication steps for security best practices.


---

use admin
db.createUser({
  user: "hamid",
  pwd: "hamidmongo.12345",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
});

db.createUser({
  user: "venturallies-user-hamid", 
  pwd: "hamidmongo.12345", // choose a secure one 
  roles: [
    { role: "readWrite", db: "venturallies-database" }
  ]
})