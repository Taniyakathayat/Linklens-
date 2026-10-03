from typing import List, Dict, Any

SECURITY_TIPS_DATA: List[Dict[str, Any]] = [
    {
        "id": "passwords",
        "title": "Password Security & Management",
        "icon": "KeyRound",
        "summary": "Build strong defensive boundaries using uncrackable, non-reusable passphrases.",
        "tips": [
            {
                "title": "Adopt 16+ Character Passphrases",
                "content": "Use 3 to 4 random dictionary words chained together with symbols (e.g., 'Correct-Horse-Battery-Staple#9'). Length drastically increases brute-force entropy.",
                "importance": "CRITICAL"
            },
            {
                "title": "Eliminate Password Reuse Entirely",
                "content": "Never use the same password across multiple sites. If a single platform is compromised in a breach, credential stuffing will unlock all your accounts.",
                "importance": "CRITICAL"
            },
            {
                "title": "Leverage a Verified Password Manager",
                "content": "Utilize open-source or audited cloud vaults (such as Bitwarden, 1Password, or KeePass) to generate and auto-fill cryptographic passwords.",
                "importance": "HIGH"
            }
        ]
    },
    {
        "id": "mfa",
        "title": "Multi-Factor Authentication (MFA)",
        "icon": "ShieldCheck",
        "summary": "Enforce a second layer of verification that stops over 99% of automated credential attacks.",
        "tips": [
            {
                "title": "Prefer Authenticator Apps / Hardware Keys over SMS",
                "content": "SMS 2FA is vulnerable to SIM-swapping and SS7 interception. Prefer TOTP apps (Google Authenticator, Aegis) or FIDO2/WebAuthn hardware keys (YubiKey).",
                "importance": "CRITICAL"
            },
            {
                "title": "Secure and Offline Backup Codes",
                "content": "Download and safely store one-time recovery codes in a secure, physical location or encrypted vault in case your device is damaged.",
                "importance": "HIGH"
            }
        ]
    },
    {
        "id": "phishing",
        "title": "Phishing & Spoofing Defense",
        "icon": "AlertTriangle",
        "summary": "Detect subtle social deception tactics aiming to harvest your credentials.",
        "tips": [
            {
                "title": "Inspect Top-Level Domains and Sender Headers",
                "content": "Look for subtle typosquatting (e.g., 'paypa1.com' or 'support@g00gle.com') and never trust urgent display names.",
                "importance": "CRITICAL"
            },
            {
                "title": "Verify Links Before Clicking",
                "content": "Hover over hyperlinks to verify the actual destination URL. When in doubt, navigate directly to the service by typing the official URL into your browser.",
                "importance": "HIGH"
            }
        ]
    },
    {
        "id": "public_wifi",
        "title": "Public Wi-Fi & Network Security",
        "icon": "Wifi",
        "summary": "Protect against Man-in-the-Middle (MitM) and rogue access point eavesdropping.",
        "tips": [
            {
                "title": "Use an Encrypted VPN on Public Networks",
                "content": "Public Wi-Fi networks in airports, cafes, and hotels can be spoofed by evil twin access points. Route all traffic through an encrypted VPN tunnel.",
                "importance": "HIGH"
            },
            {
                "title": "Disable Automatic Network Connection",
                "content": "Configure your smartphone and laptop to never automatically connect to open Wi-Fi networks without manual authorization.",
                "importance": "MEDIUM"
            }
        ]
    },
    {
        "id": "software_updates",
        "title": "Software & Patch Management",
        "icon": "RefreshCw",
        "summary": "Close critical zero-day and known Common Vulnerabilities and Exposures (CVEs).",
        "tips": [
            {
                "title": "Enable Automated OS & Browser Updates",
                "content": "Most breaches exploit unpatched vulnerabilities in outdated software. Enable auto-update on Windows, macOS, Android, iOS, and all web browsers.",
                "importance": "HIGH"
            },
            {
                "title": "Uninstall Dormant Software & Extensions",
                "content": "Browser extensions have broad DOM permissions. Regularly audit and delete extensions that you no longer actively require.",
                "importance": "MEDIUM"
            }
        ]
    },
    {
        "id": "data_privacy",
        "title": "Data Privacy & Footprint Minimization",
        "icon": "EyeOff",
        "summary": "Reduce the surface area available to threat actors and data brokers.",
        "tips": [
            {
                "title": "Use Email Aliasing / Masking Services",
                "content": "Utilize masked email aliases (e.g. SimpleLogin, AnonAddy, or Apple Hide My Email) when signing up for newsletters and non-critical services.",
                "importance": "HIGH"
            },
            {
                "title": "Exercise Right to Erasure / GDPR / CCPA",
                "content": "Request deletion of dormant accounts. Less data stored on external servers means fewer exposures when those servers get breached.",
                "importance": "MEDIUM"
            }
        ]
    },
    {
        "id": "social_engineering",
        "title": "Social Engineering & Human Defense",
        "icon": "Users",
        "summary": "Guard against psychological manipulation, vishing, and impersonation.",
        "tips": [
            {
                "title": "The 'Urgency' Red Flag",
                "content": "Threat actors create artificial panic ('Account suspended within 10 minutes') to bypass critical reasoning. Always pause and verify out-of-band.",
                "importance": "HIGH"
            },
            {
                "title": "Never Disclose OTPs Over Incoming Phone Calls",
                "content": "No legitimate bank or tech support agent will ever ask for your 6-digit SMS code or authenticator OTP over the phone.",
                "importance": "CRITICAL"
            }
        ]
    },
    {
        "id": "account_recovery",
        "title": "Account Recovery & Incident Preparedness",
        "icon": "LifeBuoy",
        "summary": "Prepare rapid containment procedures in case an account is breached.",
        "tips": [
            {
                "title": "Use Fake Answers for Security Questions",
                "content": "Your mother's maiden name or first school can easily be found on social media. Use randomly generated passwords as answers and save them in your password manager.",
                "importance": "HIGH"
            },
            {
                "title": "Establish Recovery Contacts",
                "content": "Set up secondary trusted recovery emails and phone numbers across your primary master account (e.g., Google, Apple, Microsoft).",
                "importance": "HIGH"
            }
        ]
    }
]
