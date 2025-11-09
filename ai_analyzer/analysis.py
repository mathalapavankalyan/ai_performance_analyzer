import os
import re
import json
import statistics
import datetime
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import START, StateGraph, END

load_dotenv()

# ------------------------------------------------------------
# Blog app log directory
# ------------------------------------------------------------
BLOG_APP_LOG_DIR = os.getenv(
    "BLOG_APP_LOG_DIR"
)
API_LOG_FILE = os.path.join(BLOG_APP_LOG_DIR, "app.log")

# ------------------------------------------------------------
# LLM setup
# ------------------------------------------------------------
llm = ChatOpenAI(model="gpt-4o", api_key=os.getenv("OPEN_AI_API_KEY"))

# ------------------------------------------------------------
# Output model
# ------------------------------------------------------------
class Output(BaseModel):
    api: str
    timestamp: str
    cause: str
    impact: str
    recommendation: str
    criticality: str
    confidence: float
    latency_ms: Optional[float] = None
    error_rate: Optional[float] = None
    affected_requests: Optional[int] = None
    evidence: Optional[List[str]] = None

llm_with_structured_output = llm.with_structured_output(Output)

# ------------------------------------------------------------
# State schema
# ------------------------------------------------------------
class State(TypedDict):
    logs: List[Dict[str, Any]]
    summary: str
    anomalies: Optional[List[str]]
    insight: Optional[Output]
    timestamp: str

# ------------------------------------------------------------
# Helper: Parse app.log lines
# ------------------------------------------------------------
def parse_plain_log_line(line: str):
    """Parse one plain-text log line into structured data."""
    pattern = r"Method=(\w+) \| Endpoint=(.*?) \| Status=(\d+) \| ResponseTime=([\d.]+)s"
    match = re.search(pattern, line)
    if not match:
        return None
    method, endpoint, status, response_time = match.groups()
    return {
        "method": method,
        "path": endpoint.strip(),
        "status": int(status),
        "latency_ms": float(response_time) * 1000,
        "timestamp": line.split("]")[0].strip("[").strip()
    }

# ------------------------------------------------------------
# Chat node
# ------------------------------------------------------------
def chat_node(state: State, user_query: str) -> str:
    context = f"""
    Latest Summary: {state.get('summary', '')}
    Detected Anomalies: {state.get('anomalies', '')}
    AI Insight: {state.get('insight', '')}
    """
    prompt = f"Context:\n{context}\n\nQuestion: {user_query}"
    response = llm.invoke(prompt)
    return response.content

# ------------------------------------------------------------
# Summary node
# ------------------------------------------------------------
def summary_node(state: dict) -> dict:
    """Read logs from blog_app/logs/app.log and summarize system activity."""
    logs = []
    try:
        with open(API_LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                parsed = parse_plain_log_line(line)
                if parsed:
                    logs.append(parsed)
    except FileNotFoundError:
        print(f"No app.log found at {API_LOG_FILE}")
        logs = []

    if logs:
        avg_latency = statistics.mean([l["latency_ms"] for l in logs])
        error_rate = (sum(1 for l in logs if l["status"] >= 400) / len(logs)) * 100
        summary = f"Average latency: {avg_latency:.2f}ms, Error rate: {error_rate:.2f}%"
    else:
        summary = "No valid log entries found in app.log."

    state["logs"] = logs
    state["summary"] = summary
    state["timestamp"] = datetime.datetime.utcnow().isoformat()
    return state

# ------------------------------------------------------------
# Anomaly detection node
# ------------------------------------------------------------
def anomaly_node(state: State) -> State:
    logs = state.get("logs", [])
    if not logs:
        state["anomalies"] = ["No logs to analyze."]
        return state

    latencies = [l["latency_ms"] for l in logs]
    avg_latency = statistics.mean(latencies)
    threshold = avg_latency * 1.5

    anomalies = [
        f"{l['path']} latency {l['latency_ms']}ms (> {threshold:.2f}ms threshold)"
        for l in logs if l["latency_ms"] > threshold
    ]

    state["anomalies"] = anomalies if anomalies else ["No significant anomalies."]
    return state

# ------------------------------------------------------------
# Insight generation node
# ------------------------------------------------------------
def insight_node(state: State) -> State:
    summary = state.get("summary", "")
    anomalies = state.get("anomalies", [])

    prompt = f"""
    You are an SRE analyzing app performance logs.

    Summary:
    {summary}

    Anomalies:
    {json.dumps(anomalies, indent=2)}

    Generate a structured insight with cause, impact, recommendation, criticality, and confidence.
    """
    insight = llm_with_structured_output.invoke(prompt)
    state["insight"] = insight
    return state


builder = StateGraph(State)
builder.add_node("summary_node", summary_node)
builder.add_node("anomaly_node", anomaly_node)
builder.add_node("insight_node", insight_node)

builder.add_edge(START, "summary_node")
builder.add_edge("summary_node", "anomaly_node")
builder.add_edge("anomaly_node", "insight_node")
builder.add_edge("insight_node", END)

compiled_graph = builder.compile()
