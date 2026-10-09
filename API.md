# FinFlow API Reference

Base URL: `/api`

## Auth
- `POST /auth/register` `{ name, email, password, phone? }`
- `POST /auth/login` `{ email, password }`
- `POST /auth/logout`
- `GET /auth/me`

## Wallet
- `POST /wallet/add-money` `{ amount }` — demo top-up
- `POST /wallet/transfer` `{ email, amount, note? }`
- `GET /wallet/transactions?type=credit|debit`

## Beneficiaries
- `GET /beneficiaries`
- `POST /beneficiaries` `{ nickname, email, accountLast4, bankName }`
- `DELETE /beneficiaries/:id`

## Customer
- `GET /users/profile`
- `POST /users/kyc` `{ phone, address: { line1, city, state, postalCode } }`
- `GET /notifications`
- `PATCH /notifications/:id/read`

## Admin
All require the `admin` role.
- `GET /admin/dashboard`
- `GET /admin/users?q=search`
- `PATCH /admin/users/:id/status` `{ status: active|blocked }`
- `PATCH /admin/users/:id/kyc` `{ status: pending|verified|rejected }`
- `GET /admin/audit-logs`

## Notes
Money-movement is intentionally implemented as a demo wallet flow. Real banking systems require ledger-based accounting, idempotency, transactional consistency, reconciliation, fraud/risk controls, regulatory requirements, secrets management and provider webhooks.
