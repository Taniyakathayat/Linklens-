# LeakLens Security & Defensive Framework

## 1. Privacy-First Password Policy
LeakLens operates strictly under the principle that **passwords must never be collected, transmitted, verified, or stored**. 
- The client-side UI and backend Pydantic models automatically detect and reject keywords such as `password=`, `pass=`, `secret=`, and `bearer`.
- No password input box exists in the application.

## 2. Privacy-Preserving Storage (SHA-256 Hashing)
- When a user submits an email or username, it is masked on screen (`ta***a@example.com`).
- The database stores a deterministic 64-character SHA-256 digest (`identifier_hash`) rather than plaintext identifiers where feasible.
- Scan history can be wiped by the user with a single click.

## 3. Input Sanitization & Attack Prevention
- **SQL Injection Prevention**: All queries utilize SQLAlchemy ORM parameterized statements.
- **Cross-Site Scripting (XSS)**: React handles DOM encoding natively; dangerous HTML injection is disallowed.
- **Cross-Origin Resource Sharing (CORS)**: Strict origin whitelisting in FastAPI middleware.
- **Rate Limiting**: Request limits mitigate brute-force query flooding.

## 4. Academic & Ethical Compliance
- The tool does not perform unauthorized port scanning, vulnerability exploitation, or web scraping.
- Offline Demo Mode uses fictional synthetic datasets (`safe.demo@example.com`, `exposed.demo@example.com`, `highrisk.demo@example.com`).
