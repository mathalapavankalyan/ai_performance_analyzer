from fastapi import FastAPI
from fastapi import Query
from ai_analyzer import generate_insights
from analysis import State as latest_state, chat_node , compiled_graph
import os
from fastapi.middleware.cors import CORSMiddleware



BLOG_APP_LOG_DIR = os.getenv('BLOG_APP_LOG_DIR')
os.environ["BLOG_APP_LOG_DIR"] = BLOG_APP_LOG_DIR


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI(title="AI Analyzer API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ai/insights")
async def ai_insights():
    insights = generate_insights()
    return {"insights": insights}



@app.post("/chat")
async def chat_with_analyzer(query: str):
    latest_state = compiled_graph.invoke({}, configurable={"thread_id": "run_1"})
    answer = chat_node(latest_state, query)
    return {"response": answer}
