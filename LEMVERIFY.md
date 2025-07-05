HOW TO GET THE WEBHOOK CALLBACK SUCCESS

```js
router.post("/lemverify-webhook", function (req, res) {
  console.log("[LEMVERIFY POST] Webhook hit at", new Date().toISOString());
  console.log("[LEMVERIFY POST] Headers:", req.headers);
  console.log("[LEMVERIFY POST] Body:", req.body);

  res.sendStatus(200); // REQUIRED for LEMVerify
});
```

WHAT WE ARE USING
https://venturallies.com/api/kyc/lemverify-webhook

https:// = Must be https
venturallies.com = Should not be an IP but a domain
api/kyc/lemverify-webhook = server api routes for lemverify
