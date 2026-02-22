from jose import JWTError
import json
import urllib.request
import urllib.error
from config import settings


def verify_supabase_jwt(token: str) -> dict:
    """
    Verify a Supabase JWT by calling Supabase's /auth/v1/user endpoint.
    Supabase validates the token server-side and returns the user data.
    """
    url = f"{settings.SUPABASE_URL}/auth/v1/user"
    req = urllib.request.Request(url)
    req.add_header("apikey", settings.SUPABASE_ANON_KEY)
    req.add_header("Authorization", f"Bearer {token}")

    try:
        with urllib.request.urlopen(req) as response:
            user_data = json.loads(response.read())
    except urllib.error.HTTPError as e:
        if e.code == 401:
            raise JWTError("Token expired or invalid")
        raise JWTError(f"Token verification failed: {e.code} {e.reason}")

    if not user_data.get("id"):
        raise JWTError("Invalid token: no user ID returned")

    return {
        "sub": user_data["id"],
        "email": user_data.get("email"),
        "role": user_data.get("role", "authenticated"),
    }


def extract_user_from_token(payload: dict) -> dict:
    """
    Extract user information from decoded JWT payload.
    
    Args:
        payload: Decoded JWT payload
        
    Returns:
        dict: User information (user_id, email, role)
    """
    return {
        "user_id": payload.get("sub"),  # Subject = user ID
        "email": payload.get("email"),
        "role": payload.get("role", "authenticated"),
        "payload": payload  # Full payload for debugging
    }