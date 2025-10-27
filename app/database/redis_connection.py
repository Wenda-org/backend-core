import os
import redis
from fastapi import HTTPException

def get_redis_client():
    try:
        client = redis.Redis(
            host=os.getenv("REDIS_HOST"),
            port=int(os.getenv("REDIS_PORT")),
            db=0,
            decode_responses=True
        )
        client.ping()
        return client
    except Exception:
        raise HTTPException(status_code=500, detail="Redis não está disponível")
