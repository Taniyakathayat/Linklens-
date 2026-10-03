# LeakLens Viva Voce Questions & Answers (30+ Essential Questions)

### 1. What is LeakLens and what problem does it solve?
**Answer:** LeakLens is a defensive cybersecurity web application that assesses whether an email or username appears in known data breach records, computes a transparent 0–100 cyber risk score, and provides actionable, prioritized security recommendations to protect users from identity theft and credential stuffing.

### 2. Why should passwords NEVER be collected or stored in this application?
**Answer:** Collecting passwords creates a massive security liability and violates defensive security ethics. A breach verification tool should only correlate public identifiers (email/username) with breach metadata. Passwords are never needed to determine if an account was exposed.

### 3. What is a data breach?
**Answer:** A data breach is a security incident where sensitive, protected, or confidential data is copied, transmitted, viewed, or stolen by an unauthorized individual or entity.

### 4. What is credential stuffing?
**Answer:** Credential stuffing is an automated cyberattack where threat actors use stolen username/email and password combinations from one breach to attempt logins across hundreds of other online platforms, exploiting password reuse.

### 5. What is the difference between personal data exposure and credential leakage?
**Answer:** Personal data exposure includes public metadata (name, email, username, IP address), whereas credential leakage specifically includes password hashes, plain passwords, or authentication session keys.

### 6. Why did you choose FastAPI for the backend?
**Answer:** FastAPI offers high asynchronous performance with Python, native Pydantic data validation, automatic OpenAPI/Swagger documentation generation, clean type hinting, and lightweight footprint.

### 7. Why did you choose React.js and Vite for the frontend?
**Answer:** React enables a modular, component-driven UI for rendering dynamic risk gauges and dashboards. Vite provides instant Hot Module Replacement (HMR) and ultra-fast ES module build performance.

### 8. Why use PostgreSQL / SQLAlchemy ORM?
**Answer:** PostgreSQL provides robust relational integrity and ACID compliance for audit logs. SQLAlchemy ORM abstracts SQL queries, preventing SQL Injection vulnerabilities via parameterized statements and enabling seamless switching between SQLite for local testing and PostgreSQL for production.

### 9. What is SHA-256 and how is it used in LeakLens?
**Answer:** SHA-256 (Secure Hash Algorithm 256-bit) is a one-way cryptographic hash function. LeakLens computes SHA-256 digests of scanned identifiers to store privacy-preserving audit logs without retaining raw plaintext emails or usernames.

### 10. How does the Cyber Risk Engine calculate the risk score?
**Answer:** The risk engine uses a transparent, rule-based formula:
`Risk Score = Base(0) + Incident Count Weight + Exposed Category Weights + Recency Impact`, capped at 100 and mapped to LOW, MEDIUM, HIGH, or CRITICAL tiers.

### 11. Is the LeakLens risk score an official industry standard?
**Answer:** No. It is an application-defined educational risk index designed to explain threat severity and prioritize defensive remediation. It is not an ISO or NIST standard.

### 12. What does "No known exposure found in configured sources" mean?
**Answer:** It means the scanned identifier does not appear in the currently configured threat repositories. It is intentionally not labeled as "100% Safe" because undiscovered or private breaches could still exist.

### 13. What is Demo Mode and why is it important?
**Answer:** Demo Mode allows the application to execute entirely offline with deterministic synthetic breach records (`safe.demo`, `exposed.demo`, `highrisk.demo`), ensuring dependable evaluation and college presentations without third-party API rate limits.

### 14. What are the four risk severity levels in LeakLens?
**Answer:**
- LOW (0–30)
- MEDIUM (31–60)
- HIGH (61–80)
- CRITICAL (81–100)

### 15. How does the Recommendation Engine prioritize action items?
**Answer:** Recommendations are dynamically ranked into CRITICAL (e.g. password resets), HIGH (e.g. spear-phishing vigilance), MEDIUM (e.g. username decoupling), and GENERAL (e.g. enabling MFA).

### 16. What is Multi-Factor Authentication (MFA) and why is it recommended?
**Answer:** MFA requires two or more verification factors to gain access. Even if a password is leaked in a breach, MFA prevents unauthorized login in over 99% of automated attacks.

### 17. Why is SMS-based 2FA considered weaker than Authenticator Apps?
**Answer:** SMS is vulnerable to SIM-swapping attacks, social engineering of telecom carriers, and SS7 network interception. Authenticator apps (TOTP) generate time-based codes locally on the device without telecom reliance.

### 18. What is spear-phishing?
**Answer:** Spear-phishing is a targeted phishing attack where attackers use specific personal details obtained from breaches (such as full names or past purchase history) to craft convincing fraudulent emails.

### 19. How does LeakLens prevent SQL Injection?
**Answer:** By using SQLAlchemy ORM which utilizes parameterized queries and prepared statements, ensuring user input is treated as data rather than executable SQL code.

### 20. How does LeakLens protect against XSS (Cross-Site Scripting)?
**Answer:** React automatically escapes all string outputs in JSX before rendering to the DOM, neutralizing malicious script injection attempts.

### 21. What happens if a user accidentally types their password in the search bar?
**Answer:** Both client-side regex and backend Pydantic validators inspect the input. If credential patterns or keywords (e.g., `password=`) are detected, the input is immediately rejected with a security violation error.

### 22. What is CORS and how is it configured?
**Answer:** Cross-Origin Resource Sharing (CORS) is a browser security mechanism. FastAPI uses `CORSMiddleware` to whitelist legitimate frontend origins (e.g. `http://localhost:5173`) while blocking unauthorized cross-origin requests.

### 23. What is the Provider Abstraction Pattern?
**Answer:** It is a software design pattern where an abstract base class (`ExposureProvider`) defines the interface (`get_exposure`). Concrete implementations (`DemoExposureProvider`, `ExternalExposureProvider`) can be swapped seamlessly via environment variables without altering the core business logic.

### 24. What is a Password Manager and why is it recommended?
**Answer:** A password manager is an encrypted digital vault that generates and stores complex, unique passwords for every site, eliminating password reuse.

### 25. How does the interactive Security Checklist work?
**Answer:** It provides a local hardening checklist with progress tracking, persisting state in the browser's `localStorage` so users can track their security improvements across visits.

### 26. What are the key limitations of the current implementation?
**Answer:**
- Relies on configured breach datasets (synthetic in demo mode).
- Educational risk model rather than an audited actuarial risk framework.
- Does not scan live private dark-web forums without external CTI API keys.

### 27. How can LeakLens be extended in the future?
**Answer:** By adding organization-wide domain scanning, automated email breach alerts, and k-Anonymity password hash verification.

### 28. What is k-Anonymity in breach checking?
**Answer:** A privacy technique where only the first 5 characters of a SHA-1 password hash are sent to a server. The server returns a list of matching hashes, and the client checks locally if the full hash matches, preventing the server from knowing the user's password hash.

### 29. What is an API endpoint? Name three key endpoints in LeakLens.
**Answer:** An API endpoint is a specific URL through which an application accesses backend services. Key LeakLens endpoints include:
- `POST /api/scan`
- `GET /api/dashboard`
- `GET /api/history`

### 30. How is testing performed in this project?
**Answer:** Automated unit and integration testing is implemented using `pytest` and `pytest-asyncio`, covering input validation, risk engine math, recommendation ranking, and API responses.

### 31. What is the main takeaway of this minor project?
**Answer:** LeakLens demonstrates how defensive cybersecurity principles, clean software architecture, and user-centric UI design can empower users to understand and improve their cyber posture safely.
