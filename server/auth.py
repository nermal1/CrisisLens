from jose import jwt, JWTError
from datetime import datetime
from config import settings


def verify_supabase_jwt(token: str) -> dict:
    """
    Verify and decode a Supabase JWT token.
    
    Args:
        token: The JWT token string from the Authorization header
        
    Returns:
        dict: Decoded token payload containing user information
        
    Raises:
        JWTError: If token is invalid, expired, or verification fails
    """
    try:
        # Decode and verify the JWT token
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],  # Supabase uses HS256 by default
            audience="authenticated",  # Must match Supabase's audience claim
            options={
                "verify_signature": True,
                "verify_exp": True,  # Verify expiration
                "verify_aud": True,  # Verify audience
            }
        )
        
        # Validate that the token has required claims
        if not payload.get("sub"):
            raise JWTError("Token missing 'sub' (subject) claim")
        
        # Optional: Verify issuer matches your Supabase URL
        token_issuer = payload.get("iss", "")
        if settings.SUPABASE_URL not in token_issuer:
            raise JWTError(f"Invalid issuer: {token_issuer}")
        
        return payload
    
    except jwt.ExpiredSignatureError:
        raise JWTError("Token has expired")
    except jwt.JWTClaimsError as e:
        raise JWTError(f"Invalid token claims: {str(e)}")
    except Exception as e:
        raise JWTError(f"Token verification failed: {str(e)}")


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