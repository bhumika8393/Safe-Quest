from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uvicorn
import os

app = FastAPI(title="SafeQuest AI Service")

# Initialize models
# In production, this would be a fine-tuned model for travel scams
classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

class ScamReport(BaseModel):
    text: str
    lat: float
    lon: float

@app.get("/")
async def root():
    return {"status": "AI Service Online", "version": "1.0.0"}

@app.post("/analyze-scam")
async def analyze_scam(report: ScamReport):
    """
    Analyzes a scam report text to determine severity and pattern type.
    """
    try:
        # Simulate scam intent extraction
        result = classifier(report.text)
        
        # Logic to map classification to scam types
        # This is a placeholder for the actual XGBoost pattern matching
        risk_score = 0.85 if result[0]['label'] == 'NEGATIVE' else 0.2
        
        return {
            "prediction": result[0]['label'],
            "confidence": result[0]['score'],
            "estimated_risk": risk_score,
            "geo_cluster": "Rome-Central-01",
            "type": "Potential Distraction Theft" if risk_score > 0.5 else "Information Only"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

KNOWLEDGE_BASE = [
    {
        "topic": "tipping",
        "region": "italy",
        "content": "In Italy, tipping is not required as a 'coperto' (service charge) is often included. However, rounding up the bill is appreciated."
    },
    {
        "topic": "laws",
        "region": "rome",
        "content": "It is illegal to eat or drink near historic fountains in Rome. Fines can exceed 400 Euros."
    },
    {
        "topic": "transit",
        "region": "rome",
        "content": "Validating your ticket is mandatory before boarding a bus or tram in Rome. Failure to do so results in a 50 Euro on-the-spot fine."
    },
    {
        "topic": "scam",
        "region": "rome",
        "content": "Watch out for the 'Friendship Bracelet' scam near the Colosseum. Men may try to put a bracelet on your wrist then demand money."
    }
]

class ChatRequest(BaseModel):
    query: str
    userId: str
    location: str = "Rome"

@app.post("/chat/copilot")
async def copilot_chat(request: ChatRequest):
    """
    RAG-style chatbot endpoint.
    Searches the internal knowledge base for relevant travel safety context.
    """
    query_lower = request.query.lower()
    relevant_info = []
    
    # Simple keyword-based retrieval for RAG simulation
    for entry in KNOWLEDGE_BASE:
        if any(keyword in query_lower for keyword in [entry["topic"], entry["region"]]):
            relevant_info.append(entry["content"])
    
    context = " ".join(relevant_info) if relevant_info else "I couldn't find specific local laws for that, but generally keep your belongings close in crowded areas."
    
    # In production, we'd feed 'context' and 'query' into a GPT/Llama model
    response_text = f"Safety Intelligence for {request.location}: {context}"
    
    return {
        "reply": response_text,
        "sources": [entry["topic"] for entry in KNOWLEDGE_BASE if entry["content"] in relevant_info]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

