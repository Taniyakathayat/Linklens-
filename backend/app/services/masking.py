import hashlib
import hmac
import re
from app.config import settings

def hash_identifier(identifier: str) -> str:
    """
    Computes a deterministic HMAC-SHA256 digest of the normalized identifier using a server-side secret.
    Guarantees privacy-preserving storage and protects against rainbow table/dictionary lookup attacks.
    """
    normalized = identifier.strip().lower()
    secret = settings.SECRET_KEY.encode("utf-8")
    return hmac.new(secret, normalized.encode("utf-8"), hashlib.sha256).hexdigest()


def mask_email(email: str) -> str:
    """
    Masks an email address for privacy display.
    Example: 'taniya.sharma@example.com' -> 'ta***a@example.com'
    """
    normalized = email.strip()
    if "@" not in normalized:
        return mask_username(normalized)
    
    local_part, domain_part = normalized.split("@", 1)
    
    if len(local_part) <= 2:
        masked_local = local_part[0] + "***"
    elif len(local_part) <= 4:
        masked_local = local_part[0] + "***" + local_part[-1]
    else:
        masked_local = local_part[:2] + "***" + local_part[-1]
        
    return f"{masked_local}@{domain_part}"


def mask_username(username: str) -> str:
    """
    Masks a username for privacy display.
    Example: 'cyber_admin' -> 'cy***in'
    """
    normalized = username.strip()
    if len(normalized) <= 2:
        return normalized[0] + "***"
    elif len(normalized) <= 4:
        return normalized[0] + "***" + normalized[-1]
    else:
        return normalized[:2] + "***" + normalized[-2:]


def mask_identifier(identifier: str, id_type: str = "email") -> str:
    if id_type.lower() == "email" or "@" in identifier:
        return mask_email(identifier)
    return mask_username(identifier)


def validate_email_format(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email.strip()))


def validate_username_format(username: str) -> bool:
    cleaned = username.strip()
    if len(cleaned) < 3 or len(cleaned) > 50:
        return False
    # Allow alphanumeric, underscores, dots, hyphens
    pattern = r"^[a-zA-Z0-9_.-]+$"
    return bool(re.match(pattern, cleaned))
