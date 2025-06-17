# Universal Table Schema Documentation

This document describes the core database schema for the **Debt-Based Crowdfunding Platform**, designed in a technology-agnostic format. The schema is expressed using field types and constraints that should be easily mapped to any database system (SQL or NoSQL), and is especially familiar to developers with a background in Mongoose (MongoDB's ODM).

---

## Users Collection/Table

| Field Name                    | Type                 | Unique | Required | Default        | Description                                                                          |
| ----------------------------- | -------------------- | ------ | -------- | -------------- | ------------------------------------------------------------------------------------ |
| id                            | UUID/ObjectId(mongo) | Yes    | Yes      | Auto-generated | Primary identifier for the user.                                                     |
| first_name                    | String (max 100)     | No     | No       |                | User's first name.                                                                   |
| last_name                     | String (max 100)     | No     | No       |                | User's last name.                                                                    |
| email                         | String (max 255)     | Yes    | Yes      |                | Email address. Must be unique.                                                       |
| password                      | String (hashed)      | No     | Yes      |                | Hashed password for authentication.                                                  |
| phone                         | String (max 50)      | No     | No       |                | User's phone number.                                                                 |
| country                       | String (max 100)     | No     | No       |                | User's country.                                                                      |
| city                          | String (max 100)     | No     | No       |                | User's city.                                                                         |
| address                       | String / Text        | No     | No       |                | User's address.                                                                      |
| newsletter_frequency          | Enum                 | No     | No       | 'weekly'       | How often the user receives newsletters. Values: `'daily'`, `'weekly'`, `'monthly'`. |
| transaction_notification      | Boolean              | No     | No       | true           | Whether the user gets transaction notifications.                                     |
| latest_news_notification      | Boolean              | No     | No       | true           | Whether the user gets latest news notifications.                                     |
| role                          | Enum                 | No     | No       | 'user'         | User's role. Values: `'user'`, `'admin'`.                                            |
| email_verified_at             | Date/Timestamp       | No     | No       | null           | When the user's email was verified.                                                  |
| verification_token            | Integer (6 digit)    | No     | No       |                | Token sent for email verification.                                                   |
| verification_token_expires_at | Date/Timestamp       | No     | No       | null           | When the verification token expires.                                                 |
| login_token                   | Integer (6 digit)    | No     | No       |                | Token sent for during every login.                                                   |
| login_token_expires_at        | Date/Timestamp       | No     | No       | null           | When the login token expires.                                                        |
| reset_token                   | String (64 chars)    | No     | No       |                | Token for password reset, a random crypto string                                     |
| reset_token_expires_at        | Date/Timestamp       | No     | No       | null           | When the reset token expires.                                                        |
| remember_token                | String (64 chars)    | No     | No       |                | Token for "remember me" sessions, a random crypto string                             |
| created_at                    | Date/Timestamp       | No     | Yes      | Now            | When the user was created.                                                           |
| updated_at                    | Date/Timestamp       | No     | Yes      | Now/On Update  | When the user was last updated.                                                      |

---

## KYCVerifications Collection/Table

| Field Name                      | Type             | Unique | Required | Default                | Description                                                                      |
| ------------------------------- | ---------------- | ------ | -------- | ---------------------- | -------------------------------------------------------------------------------- |
| id                              | UUID             | Yes    | Yes      | Auto-generated         | Unique ID for this verification record in our DB                                 |
| user_id                         | UUID             | No     | Yes      |                        | Reference to related user record.                                                |
| lemverify_system_id             | String (UUID)    | Yes    | Yes      |                        | Unique LemVerify verification ID.                                                |
| lemverify_friendly_id           | String           | No     | Yes      |                        | LemVerify friendly (human-readable) ID.                                          |
| lemverify_type                  | Enum             | No     | Yes      |                        | Type of verification (e.g., 'COMBINATION', 'DOCUMENT', 'LIVENESS', 'AML_ALERT'). |
| lemverify_result                | Enum             | No     | Yes      |                        | Outcome from LemVerify ('PASSED', 'REFER', 'ERROR', 'ALERT').                    |
| lemverify_processed_at          | Date/Timestamp   | No     | Yes      |                        | When LemVerify finished processing.                                              |
| lemverify_started_at            | Date/Timestamp   | No     | No       | null                   | When user began verification.                                                    |
| lemverify_deletion_at           | Date/Timestamp   | No     | No       | null                   | When LemVerify will delete this record.                                          |
| lemverify_balance_at_check      | Integer          | No     | No       | null                   | LemVerify account balance at processing.                                         |
| lemverify_refer_message         | String / Text    | No     | No       | null                   | Reason for REFER result.                                                         |
| lemverify_extracted_person      | JSON / Object    | No     | No       | null                   | Non-sensitive extracted person data (e.g., name, address).                       |
| lemverify_extracted_documents   | Array of Objects | No     | No       | null                   | Extracted document details for this verification.                                |
| lemverify_extracted_live_person | JSON / Object    | No     | No       | null                   | Liveness check data (e.g., age, gender) if applicable.                           |
| lemverify_alerts                | Array of Objects | No     | No       | null                   | AML alert objects if present.                                                    |
| client_ref_sent                 | String (max 255) | No     | Yes      |                        | Original clientRef sent to LemVerify.                                       |
| status_in_our_system            | Enum             | No     | Yes      | 'verification_pending' | Our system's tracking status. 'verification_pending', 'verification_complete'   |
| created_at                      | Date/Timestamp   | No     | Yes      | Now                    | When record was created in the system. i.e                                       |
| updated_at                      | Date/Timestamp   | No     | Yes      | Now/On Update          | Last update time for this record.                                                |
| full_webhook_payload            | JSON / Text      | No     | No       | null                   | Raw webhook POST body from LemVerify for debugging/auditing.                     |

---

## Projects Collection/Table

| Field Name        | Type                 | Unique | Required | Default        | Description                                                               |
| ----------------- | -------------------- | ------ | -------- | -------------- | ------------------------------------------------------------------------- |
| id                | UUID/ObjectId(mongo) | Yes    | Yes      | Auto-generated | Primary identifier for the project.                                       |
| title             | String (255)         | No     | Yes      |                | Project title.                                                            |
| short_description | String / Text        | No     | No       |                | Short summary of the project.                                             |
| long_description       | String / Text        | No     | No       |                | Detailed project description.                                             |
| photo_url         | String / Text        | No     | No       |                | URL to a project photo.                                                   |
| country           | String (100)         | No     | No       |                | Country where the project is based.                                       |
| status            | Enum                 | No     | Yes      |                | Project status. Values: `'new'`, `'coming-soon'`, `'funded'`, `'repaid'`. |
| loan_type         | Enum                 | No     | Yes      |                | Type of loan. Values: `'business'`, `'sme'`, `'leasing'`, `'realestate'`. |
| target_amount     | Decimal (12,2)       | No     | Yes      |                | Funding goal for the project.                                             |
| expected_return   | Decimal (5,2)        | No     | Yes      |                | Fixed percentage return offered to investors.                             |
| investment_period | Integer              | No     | Yes      |                | Duration of investment (in months or days; specify in docs).              |
| amount_funded     | Decimal (12,2)       | No     | Yes      |                | Amount raised so far.                                                     |
| date_issued       | Date                 | No     | No       |                | Date the loan was issued.                                                 |
| closing_date      | Date                 | No     | Yes      |                | Date fundraising closes.                                                  |
| collateral_value  | Decimal (12,2)       | No     | No       |                | Value of collateral backing the loan.                                     |
| loan_to_value     | Decimal (5,2)        | No     | No       |                | Loan-to-value ratio (percentage).                                         |
| is_convertible    | Boolean              | No     | No       | false          | Whether the loan can be converted into equity.                            |
| created_at        | Date/Timestamp       | No     | Yes      | Now            | When the project was created.                                             |
| updated_at        | Date/Timestamp       | No     | Yes      | Now/On Update  | When the project was last updated.                                        |

---

## Notes for All Developers

- **Types**: Use equivalent types in your stack (e.g., `String`, `Number`, `Boolean`, `Date`, `Enum`, `Decimal`).
- **Field Name**: For SQL, use id, for Mongoose, use its native \_id field.
- **IDs**: For SQL, use UUID(type string); for NoSQL/Mongoose, use ObjectId(type ObjectId)
- **Enums**: Represent as enum/array-of-values in your schema system.
- **Timestamps**: Most systems have helpers for `created_at`/`updated_at` (e.g., `timestamps: true` in Mongoose).
- **Booleans**: Store as `Boolean`/`bool`/`tinyint(1)` as appropriate.
- **Unique**: Use unique constraints or indexes.
- **Required**: Use `required: true` in Mongoose or `NOT NULL` in SQL.

---

> **Example (Mongoose-style):**
>
> ```js
> const UserSchema = new Schema(
>   {
>     first_name: String,
>     last_name: String,
>     email: { type: String, unique: true, required: true },
>     password: { type: String, required: true },
>     // ...other fields
>     newsletter_frequency: {
>       type: String,
>       enum: ["daily", "weekly", "monthly"],
>       default: "weekly",
>     },
>     // ...timestamps, etc.
>   },
>   { timestamps: true }
> );
> ```

---

This schema table is intended for universal reference and can be adapted to any backend or database system.



