#  AI Performance Analyzer

### Overview  
**AI Performance Analyzer** is a full-stack performance monitoring and analytics platform built with **Python (FastAPI)** and **React**.  
It continuously collects and analyzes application logs to provide **real-time, AI-driven insights** about your system’s behavior, performance, and reliability.

Instead of manually checking thousands of log lines, developers can simply ask the integrated assistant questions such as:  
> “Which API is taking the longest?”  
> “Which page is being accessed the most?”  
> “Are there any APIs failing frequently?”

The project is divided into two main components:
- **AI Analyzer** – A FastAPI backend that handles log ingestion, AI-based analysis, and insight generation.  
- **Blog App** – A React frontend that visualizes performance metrics and includes a chatbot assistant for developer interaction.

---

### Key Features

- **Automated Log Analysis** — Continuously monitors and processes logs 24/7.  
- **AI-Powered Insights** — Detects high-latency endpoints, broken APIs, and most-used features.  
- **Interactive Assistant** — Query the system via chatbot to get instant performance feedback.  
- **Real-Time Reporting** — View up-to-date performance insights without manual log review.  
-  **Modular & Scalable** — Designed for easy integration with existing applications.

---

###  Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | Python, FastAPI | langgraph | langchain |
| **Frontend** | React, Css3 |
| **AI/Analytics** | Custom Log Parsing + Machine Learning + Generative AI |
| **Database | MongoDB | (for blogs)
| **Integration** | REST APIs |

---
### Preview of the application
![preview of app](preview.mp4)
![dashboard_page_Overview](chatbot.png)
![blog page Overview](blogs.png)
![chatbot_page_Overview](dashboard.png)
###  Getting Started

#### 1. Clone the repository
```bash
git clone https://github.com/mathalapavankalyan/ai_performance_analyzer.git
cd ai_performance_analyzer
