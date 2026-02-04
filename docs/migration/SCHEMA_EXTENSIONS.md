# Schema Extensions

This file tracks additive schema changes applied via `schema/extensions.sql`.

## guest_pay_tokens

```sql
CREATE TABLE IF NOT EXISTS guest_pay_tokens (
  id INT NOT NULL AUTO_INCREMENT,
  pledge_id INT NOT NULL,
  token VARCHAR(128) NOT NULL,
  expires_at DATETIME DEFAULT NULL,
  used_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_guest_pay_tokens_token (token),
  KEY idx_guest_pay_tokens_pledge (pledge_id),
  CONSTRAINT fk_guest_pay_tokens_pledge FOREIGN KEY (pledge_id) REFERENCES pledges(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Notes:
- Tokens are non-guessable and single-use (via `used_at`).
- Expiration is enforced by `expires_at` in API checks.
