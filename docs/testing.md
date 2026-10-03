# LeakLens Testing & Verification Guide

## 1. Test Suite Overview
LeakLens includes an automated Pytest test suite in `backend/tests/test_leaklens.py` validating input validation, risk scoring algorithms, recommendation priorities, and API routes.

## 2. Test Execution Commands

```bash
# Run pytest test suite
pytest backend/tests -v
```

## 3. Verified Test Scenarios
1. **Email Format Validation**: Tests valid email RFC formats and rejection of malformed addresses.
2. **Username Validation**: Verifies length constraints (3-50 chars) and alphanumeric sanitization.
3. **Password Rejection**: Confirms that accidental credential submissions are rejected with HTTP 400.
4. **SHA-256 Masking & Hashing**: Tests masking logic (`us***@domain.com`) and hash lengths.
5. **Clean Record Risk Calculation**: Verifies that 0 incidents produce Score = 0 and Level = LOW.
6. **Moderate Exposure Calculation**: Checks score increments for multi-incident inputs.
7. **Critical Risk Calculation**: Validates weight capping at 100 for password indicator leaks.
8. **Recommendation Priorities**: Verifies CRITICAL recommendation ordering for credential leaks.
9. **API Health & Metadata**: Confirms health check returns healthy status and demo mode flag.
10. **Demo Scenario Retrieval**: Verifies deterministic responses for `safe.demo`, `exposed.demo`, and `highrisk.demo`.
11. **History & Dashboard Aggregation**: Tests audit trail queries and metric calculations.
