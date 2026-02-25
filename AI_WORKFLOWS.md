# SafeQuest: AI Workflow Pipelines

## 1. Scam Detection Engine (SDE)
The SDE analyzes reports to identify genuine threats and patterns in a region.

### Pipeline:
1. **Report Ingestion**: User submits text/voice report.
2. **Preprocessing**: Language detection, PII removal, and Text simplification.
3. **Intent Extraction**: Using **HuggingFace Transformers (distilbert)** to classify report type (e.g., "Taxi Scam", "Fake Guide").
4. **Pattern Clustering**: **DBScan** (Density-Based Spatial Clustering) groups reports in the same geographic area.
5. **Risk Scoring**: **XGBoost** model calculates "Area Risk Level" based on:
    - Density of clusters.
    - Recency of reports.
    - Reliability score of reporters.
6. **Output**: Update the global "Scam Heatmap".

---

## 2. Cultural Travel Copilot (RAG Architecture)
Allows users to ask open-ended questions about safety and culture.

### Workflow:
1. **Query**: "Is it safe to walk around Trastevere at 11 PM?"
2. **Context Retrieval**:
    - **Vector Search**: Search Pinecone for "Trastevere safety", "Rome nightlife etiquette".
    - **Geographic Search**: Fetch latest verified scams in Trastevere from PostGIS.
3. **Prompt Construction**:
   ```text
   Context: Trastevere is generally safe but has noted "Distraction Pickpockets" near Piazza Santa Maria.
   Recent Reports: 2 fake guide reports in the last 48 hours.
   User Question: Is it safe to walk at 11 PM?
   ```
4. **LLM Generation**: **Llama 3 (via FastAPI)** generates a response advising the user to stay on well-lit paths and watch their belongings.

---

## 3. Hygiene & Safety Recommendation
Recommends food based on trust rather than just reviews.

### Algorithm:
- **Input**: User Preferences + Current Location.
- **Filtering**: Exclude restaurants with < 4.0 "Crowd Trust Score" or active scam reports.
- **Ranking**:
    - Weight 1: Verified Sanitation Rating (40%)
    - Weight 2: Cultural Authenticity (30%)
    - Weight 3: Safe Travel Proximity (30%)
- **Result**: List of "Guardian Verified" eateries.
