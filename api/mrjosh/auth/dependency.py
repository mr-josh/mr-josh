import jwt
import requests
from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

MS_OPENID_API = "https://login.microsoftonline.com/3165d8fc-5157-474b-846b-492706e7b40e/v2.0/.well-known/openid-configuration"
AUDIENCE = "api://mr-josh"


async def this_user(auth: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    openid = requests.get(MS_OPENID_API).json()
    jwks = requests.get(openid["jwks_uri"]).json()

    headers = jwt.get_unverified_header(auth.credentials)
    kid = headers["kid"]

    key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
    pub = jwt.PyJWK(key, algorithm=headers["alg"])

    try:  # Try validate signature and load payload data
        payload = jwt.decode(
            auth.credentials,
            key=pub.key,
            algorithms=[headers["alg"]],
            audience=AUDIENCE,
        )
    except jwt.exceptions.InvalidSignatureError:
        raise HTTPException(
            status_code=401, detail="Invalid token: signature is invalid"
        )
    except jwt.exceptions.InvalidAudienceError:
        raise HTTPException(
            status_code=401, detail="Invalid token: audience is invalid"
        )
    except jwt.exceptions.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Invalid token: signature expired")
    except jwt.exceptions.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    except payload["oid"] != "2c682133-3cb4-4f44-850c-90fa0c774d64":
        raise HTTPException(status_code=401, detail="Not Josh")

    return payload
