# Auth API – Quick Reference

---

## Base URL: `/api/auth`

---

##### **POST /register**

- **EXPECT**: `body`: (`firstName`, `lastName`, `email`, `password`, `location info`)
- **WHAT IT DOES**: Creates a user, sends a verification email, and ends the process.

##### **POST /verify-email**

- **EXPECT**: `query`: (`email`), `body`: (`token`)
- **WHAT IT DOES**: Verifies the provided token, marks the user as verified, and ends the process.

##### **POST /resend-verification-token**

- **EXPECT**: `query`: (`email`)
- **WHAT IT DOES**: Generates a new verification token, sends it to the user's email, and ends the process.

##### **POST /login**

- **EXPECT**: `body`: (`email`, `password`, `rememberMe`)
- **WHAT IT DOES**: Authenticates the user, sets a session cookie, and ends the process.

##### **POST /login-admin**

- **EXPECT**: `body`: (`email`, `password`)
- **WHAT IT DOES**: Authenticates the user, checks for admin privileges, sets a session cookie, and ends the process.

##### **POST /forgot-password**

- **EXPECT**: `body`: (`email`)
- **WHAT IT DOES**: Creates a password reset token, sends an email with the token, and ends the process.

##### **POST /reset-password**

- **EXPECT**: `body`: (`email`, `token`, `newPassword`)
- **WHAT IT DOES**: Verifies the reset token, updates the user's password, and ends the process.

##### **POST /logout**

- **EXPECT**: `middleware`: (`user`)
- **WHAT IT DOES**: Clears the session cookie, logs out the user, and ends the process.

---

## Base URL: `/api/user` (Admin-only)

---

##### **GET /**

- **EXPECT**: `middleware`: (`admin`), `query`: (`role?`, `status?`, `search?`, `page?`, `limit?`)
- **WHAT IT DOES**: Fetches a filtered and paginated list of users.

##### **PATCH /:userId**

- **EXPECT**: `middleware`: (`admin`), `body`: (`name`, `status`, etc.)
- **WHAT IT DOES**: Updates the target user's information by their ID.

##### **DELETE /:userId**

- **EXPECT**: `middleware`: (`admin`)
- **WHAT IT DOES**: Deletes a user account.

##### **GET /:userId**

- **EXPECT**: `middleware`: (`admin`), `param`: (`userId`)
- **WHAT IT DOES**: Fetches detailed information for a specific user by their ID.

---

## Base URL: `/api/profile` (User-only)

---

##### **GET /get**

- **EXPECT**: `middleware`: (`user`)
- **WHAT IT DOES**: Returns the full profile of the currently logged-in user.

##### **PUT /update**

- **EXPECT**: `middleware`: (`user`), `body`: (`firstName`, `lastName`, `phone`, `country`, `city`, `address`, `newsletterFrequency`, `transactionNotification`, `latestNewsNotification`, `preferences`, `currentPassword`, `newPassword`)
- **WHAT IT DOES**: Updates the logged-in user's profile information.

---

## Base URL: `/api/venture`

---

##### **POST /**

- **EXPECT**: `middleware` → `auth`, `body` → (venture fields)
- **DOES**: Creates a new venture by the logged-in user

##### **GET /my-ventures**

- **EXPECT**: `middleware` → `auth`
- **DOES**: Returns all ventures created by the authenticated user

##### **PATCH /:ventureId/upload-image**

- **EXPECT**: `middleware` → `auth`, `multipart/form-data` → `image(s)`
- **DOES**: Uploads image(s) to a specific venture

##### **PATCH /:ventureId/delete-image**

- **EXPECT**: `middleware` → `auth`, `body` → (`imageId` or `filename`)
- **DOES**: Deletes a specific image from a venture

##### **PUT /:ventureId**

- **EXPECT**: `middleware` → `auth`, `body` → (venture fields)
- **DOES**: Updates venture data by ID (owner only or authorized)

##### **PATCH /admin-status**

- **EXPECT**: `middleware` → `auth`
- **DOES**: Admin-only action to update venture status (e.g., approve/reject)

##### **GET /**

- **EXPECT**: `query` → (`page?`, `limit?`, `status?`, `search?`, etc.)
- **DOES**: Returns filtered & paginated list of all ventures

##### **GET /id/:ventureId**

- **EXPECT**: `path param` → `ventureId`
- **DOES**: Fetches venture by Mongo ObjectID

##### **GET /slug/:ventureSlug**

- **EXPECT**: `path param` → `ventureSlug`
- **DOES**: Fetches venture by URL slug

---

## Base URL: `/api/balance`

---

##### **GET /**

- **EXPECT**: `middleware` → `auth`, `role` → `admin`
- **QUERY**: `search?`, `minBalance?`, `maxBalance?`, `sortBy?`, `sortOrder?`, `page?`, `limit?`
- **DOES**: Returns a paginated and filtered list of all users' balances, including populated user information.

##### **GET /:userId**

- **EXPECT**: `middleware` → `auth`, `role` → `admin`, `param` → `userId`
- **DOES**: Returns a specific user's balance.

##### **PUT /:userId**

- **EXPECT**: `middleware` → `auth`, `role` → `admin`, `body` → `amount`, `note?`, `proofImage?`
- **DOES**: Tops up or deducts a user's balance and logs the change in `BalanceHistory`.

##### **GET /:userId/history**

- **EXPECT**: `middleware` → `auth`, `param` → `userId`
- **DOES**: Allows admins to view any user's balance history, and users to view their own history only.

##### **GET /my/self**

- **EXPECT**: `middleware` → `auth`
- **DOES**: Returns the balance of the currently logged-in user.

---

## Base URL: `/api/investments`

---

##### **POST /**
* **EXPECT**: `middleware` → `auth`, `body` → (`ventureId`, `amount`)
* **DOES**: Validates venture, user balance, and amount. Deducts from balance, creates investment, updates venture funding, and logs balance history.

##### **GET /**
* **EXPECT**: `middleware` → `auth`
* **DOES**: Returns all investments created by the currently logged-in user.

##### **GET /:id**
* **EXPECT**: `middleware` → `auth`, `param` → `id`
* **DOES**: Returns a single investment by ID for the logged-in user.

##### **DELETE /:id**
* **EXPECT**: `middleware` → `auth`, `param` → `id`
* **DOES**: Cancels the investment if its status is pending and the user owns it.

##### **GET /venture/:ventureId**
* **EXPECT**: `middleware` → `auth`, `param` → `ventureId`
* **DOES**: Returns all investments associated with a specific venture.

---

## Base URL: `/api/admin/investments`

---

##### **GET /**
* **EXPECT**: `middleware` → `auth`, `admin`
* **DOES**: Returns all investments in the system, with `investedBy` and `venture` populated.

##### **GET /:id**
* **EXPECT**: `middleware` → `auth`, `admin`, `param` → `id`
* **DOES**: Returns an investment by ID, visible to admins.

##### **DELETE /:id**
* **EXPECT**: `middleware` → `auth`, `admin`, `param` → `id`
* **DOES**: Soft-deletes the investment by setting `isDeleted = true`.

##### **PATCH /:investmentId/repayments/:index**
* **EXPECT**: `middleware` → `auth`, `admin`, `params` → `investmentId`, `index`
* **DOES**: Marks a specific repayment entry (`repayments[index]`) of an investment as paid.

-----

/api/repayments
POST /create
EXPECT: middleware: admin, body: (investmentId, userId, amount, type, note?, proofImage?)

DOES: Admin creates a repayment record for a specific investment (principal/profit). Automatically updates balance and balance history.

GET /user/:userId
EXPECT: middleware: auth (admin or that user)

DOES: Fetch all repayments made to the user, optionally filtered by status, type, or date range.

PATCH /:repaymentId/approve
EXPECT: middleware: admin

DOES: Approves a pending repayment, updates the balance of the user, logs it in balance history.

PATCH /:repaymentId/reject
EXPECT: middleware: admin, body: (note)

DOES: Marks the repayment as rejected with a note.

📌 /api/schedules (Optional: Useful for installment previews)
GET /venture/:ventureId
EXPECT: middleware: auth

DOES: Fetches full amortization schedule of a venture (what users will get if they invest).

📌 /api/admin/dashboard
GET /stats
EXPECT: middleware: admin

DOES: Returns aggregated platform statistics:

Total Users

Active Investments

Total Invested Capital

Total Profit Repaid

Ventures by Status

GET /activity-log
EXPECT: middleware: admin

DOES: Returns latest actions by admin and users (logins, investments, repayments, venture changes).

📌 /api/notifications (Future-proofing – can be skipped initially)
GET /my
EXPECT: middleware: auth

DOES: List user's notifications (news, investment updates, repayment confirmations)

PATCH /read/:notificationId
EXPECT: middleware: auth

DOES: Marks a notification as read

📌 /api/audit-log (optional)
GET /
EXPECT: middleware: admin, query: (actionType, userId, date?)

DOES: Admin can inspect changes made by users/admins: updates, deletions, approvals, etc.

📌 /api/reports (Export CSV or PDF)
GET /investments-report
EXPECT: middleware: admin, query: dateFrom, dateTo

DOES: Generate exportable investment report.

GET /repayments-report
EXPECT: middleware: admin

DOES: Export repayment activity between dates or for a specific user.

📍 Summary of Missing High-Impact Routes
Route	Needed For
POST /repayments/create	Admin to initiate repayments
PATCH /repayments/approve	Confirm & apply repayments
GET /repayments/user/:id	View repayment history
GET /schedules/venture/:id	Show amortization to users
GET /admin/dashboard/stats	Admin overview dashboard
GET /admin/activity-log	Audit platform activity