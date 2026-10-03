import httpx
import json

def run_deep_verification():
    client = httpx.Client(base_url="http://127.0.0.1:8000/api", timeout=10.0)

    print("==================================================")
    print("LEAKLENS DEEP FUNCTIONAL & SECURITY VERIFICATION")
    print("==================================================")

    # 1. Safe Demo
    r_safe = client.post("/scan", json={"identifier": "safe.demo@example.com", "type": "email"}).json()
    print("\n--- [A. SAFE DEMO SCENARIO] ---")
    print(f"Masked Identifier: {r_safe['masked_identifier']}")
    print(f"HMAC Digest: {r_safe['identifier_hash'][:16]}...")
    print(f"Status: {r_safe['status']} ({r_safe['status_label']})")
    print(f"Calculated Risk Score: {r_safe['risk_score']} / 100")
    print(f"Risk Level: {r_safe['risk_level']}")
    print(f"Incident Count: {len(r_safe['incidents'])}")
    print("Contributing Factors:")
    for f in r_safe['risk_factors']:
        print(f"  - {f['factor']} (+{f['points']} pts): {f['description']}")
    print("Priority Recommendations:")
    for r in r_safe['recommendations']:
        print(f"  - [{r['priority']}] {r['title']}")

    # 2. Exposed Demo
    r_exp = client.post("/scan", json={"identifier": "exposed.demo@example.com", "type": "email"}).json()
    print("\n--- [B. EXPOSED DEMO SCENARIO] ---")
    print(f"Masked Identifier: {r_exp['masked_identifier']}")
    print(f"HMAC Digest: {r_exp['identifier_hash'][:16]}...")
    print(f"Status: {r_exp['status']} ({r_exp['status_label']})")
    print(f"Calculated Risk Score: {r_exp['risk_score']} / 100")
    print(f"Risk Level: {r_exp['risk_level']}")
    print(f"Incident Count: {len(r_exp['incidents'])}")
    print(f"Exposed Categories: {r_exp['categories_summary']}")
    print("Contributing Factors:")
    for f in r_exp['risk_factors']:
        print(f"  - {f['factor']} (+{f['points']} pts): {f['description']}")
    print("Priority Recommendations:")
    for r in r_exp['recommendations']:
        print(f"  - [{r['priority']}] {r['title']}")

    # 3. High Risk Demo
    r_high = client.post("/scan", json={"identifier": "highrisk.demo@example.com", "type": "email"}).json()
    print("\n--- [C. HIGH RISK DEMO SCENARIO] ---")
    print(f"Masked Identifier: {r_high['masked_identifier']}")
    print(f"HMAC Digest: {r_high['identifier_hash'][:16]}...")
    print(f"Status: {r_high['status']} ({r_high['status_label']})")
    print(f"Calculated Risk Score: {r_high['risk_score']} / 100")
    print(f"Risk Level: {r_high['risk_level']}")
    print(f"Incident Count: {len(r_high['incidents'])}")
    print(f"Exposed Categories: {r_high['categories_summary']}")
    print("Contributing Factors:")
    for f in r_high['risk_factors']:
        print(f"  - {f['factor']} (+{f['points']} pts): {f['description']}")
    print("Priority Recommendations:")
    for r in r_high['recommendations']:
        print(f"  - [{r['priority']}] {r['title']}")

    # 4. Error Handling Verification
    print("\n--- [ERROR HANDLING TESTS] ---")
    e1 = client.post("/scan", json={"identifier": "   ", "type": "email"})
    print(f"1. Empty Input: Status {e1.status_code} -> Message: {e1.json().get('detail')}")

    e2 = client.post("/scan", json={"identifier": "not-a-valid-email", "type": "email"})
    print(f"2. Invalid Email: Status {e2.status_code} -> Message: {e2.json().get('detail')}")

    e3 = client.post("/scan", json={"identifier": "a!", "type": "username"})
    print(f"3. Invalid Username: Status {e3.status_code} -> Message: {e3.json().get('detail')}")

    e4 = client.post("/scan", json={"identifier": "password=MySecretPassword123!", "type": "email"})
    print(f"4. Password Attempt: Status {e4.status_code} -> Message: {e4.json().get('detail')}")

    e5 = client.get("/scan/unknown-scan-id-uuid")
    print(f"5. Non-Existent Scan ID: Status {e5.status_code} -> Message: {e5.json().get('detail')}")

if __name__ == "__main__":
    run_deep_verification()
