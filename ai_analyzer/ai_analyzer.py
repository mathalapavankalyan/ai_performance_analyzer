from analysis import compiled_graph
import os
import re


def generate_insights():
    """
    Runs the analyzer graph and returns serializable data
    from the Output Pydantic model (structured AI insight).
    """
    try:
        result = compiled_graph.invoke({}, configurable={"thread_id": "run_1"})

        insight = result.get("insight")
        if insight:
            return insight.model_dump()
        else:
            return {"error": "No insights generated from analyzer."}

    except Exception as e:
        return {"error": str(e)}


def parse_plain_log_line(line: str):
    """Parses a plain-text log line into structured data (dict)."""
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
        "timestamp": line.split("]")[0].strip("[").strip(), 
    }