[root@srv889025 auth]# systemctl status nginx
● nginx.service - The nginx HTTP and reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: di>
     Active: active (running) since Fri 2025-07-04 10:15:45 UTC; 6h ago
   Main PID: 4815 (nginx)
      Tasks: 3 (limit: 48643)
     Memory: 3.3M
        CPU: 219ms
     CGroup: /system.slice/nginx.service
             ├─4815 "nginx: master process /usr/sbin/nginx"
             ├─5395 "nginx: worker process"
             └─5396 "nginx: worker process"

Jul 04 10:15:45 srv889025.hstgr.cloud systemd[1]: Starting The nginx HTTP and r>
Jul 04 10:15:45 srv889025.hstgr.cloud nginx[4813]: nginx: the configuration fil>
Jul 04 10:15:45 srv889025.hstgr.cloud nginx[4813]: nginx: configuration file /e>
Jul 04 10:15:45 srv889025.hstgr.cloud systemd[1]: Started The nginx HTTP and re>
Jul 04 10:20:31 srv889025.hstgr.cloud systemd[1]: Reloading The nginx HTTP and >
Jul 04 10:20:32 srv889025.hstgr.cloud systemd[1]: Reloaded The nginx HTTP and r>
Jul 04 16:56:13 srv889025.hstgr.cloud systemd[1]: Reloading The nginx HTTP and >
Jul 04 16:56:13 srv889025.hstgr.cloud systemd[1]: Reloaded The nginx HTTP and r>
Jul 04 16:56:19 srv889025.hstgr.cloud systemd[1]: Reloading The nginx HTTP and >
Jul 04 16:56:19 srv889025.hstgr.cloud systemd[1]: Reloaded The nginx HTTP and r>
...skipping...
                                                                                                       certbot --nginx -d venturallies.com -d www.venturallies.com
Saving debug log to /var/log/letsencrypt/letsencrypt.logom -d www.venturallies.com
Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel): mianhamid6426@gmail.com
Invalid email address: mianhamid6426@gmail.com                              .
There seem to be problems with that address.

If you really want to skip this, you can run the client with
--register-unsafely-without-email but you will then be unable to receive notice
about impending expiration or revocation of your certificates or problems with
your Certbot installation that will lead to failure to renew.

Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel): kchadjou@yahoo.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.5-February-24-2025.pdf. You must
agree in order to register with the ACME server. Do you agree?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing, once your first certificate is successfully issued, to
share your email address with the Electronic Frontier Foundation, a founding
partner of the Let's Encrypt project and the non-profit organization that
develops Certbot? We'd like to send you email about our work encrypting the web,
EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y
Account registered.
Requesting a certificate for venturallies.com and www.venturallies.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/venturallies.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/venturallies.com/privkey.pem
This certificate expires on 2025-10-02.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for venturallies.com to /etc/nginx/conf.d/venturallies.conf
Successfully deployed certificate for www.venturallies.com to /etc/nginx/conf.d/venturallies.conf
Congratulations! You have successfully enabled HTTPS on https://venturallies.com and https://www.venturallies.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[root@srv889025 auth]# 



[root@srv889025 auth]# certbot renew --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/venturallies.com.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Account registered.
Simulating renewal of an existing certificate for venturallies.com and www.venturallies.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations, all simulated renewals succeeded: 
  /etc/letsencrypt/live/venturallies.com/fullchain.pem (success)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[root@srv889025 auth]#  