import bcrypt

def get_passcode_hash(passcode: str) -> str:
    """
    Hashes a plain-text passcode using bcrypt directly (thread-safe and modern).
    """
    # Generate salt and hash the passcode (requires bytes input)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(passcode.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_passcode(plain_passcode: str, hashed_passcode: str) -> bool:
    """
    Verifies a plain-text passcode against its hashed version using bcrypt directly.
    """
    try:
        return bcrypt.checkpw(plain_passcode.encode("utf-8"), hashed_passcode.encode("utf-8"))
    except Exception:
        return False
