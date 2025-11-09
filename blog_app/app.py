from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
from blog_db import init_db
from blog_routes import router
from logger import logger

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    logger.info("Database connected successfully.")
    yield
    logger.info("Shutting down FastAPI server.")


app = FastAPI(title="BLOG APP", lifespan=lifespan)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = round(time.time() - start_time, 3)

    method = request.method
    path = request.url.path
    status = response.status_code
    client_ip = request.client.host if request.client else "unknown"

    logger.info(
        f"Time={time.strftime('%Y-%m-%d %H:%M:%S')} | "
        f"Method={method} | Endpoint={path} | "
        f"Status={status} | ResponseTime={duration}s | IP={client_ip}"
    )
    return response



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)

@app.post("/frontend/logs")
async def frontend_logs(request: Request):
    data = await request.json()
    level = data.get("level", "INFO").lower()
    message = data.get("message", "")
    url = data.get("url", "")
    user_agent = data.get("userAgent", "")
    timestamp = data.get("timestamp", "")

    log_line = (
        f"Frontend | Time={timestamp} | Level={level.upper()} | "
        f"Message={message} | URL={url} | Device={user_agent}"
    )

    getattr(logger, level, logger.info)(log_line)
    return {"status": "logged"}
