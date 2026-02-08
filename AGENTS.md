# AGENTS.md

This project uses a multi-agent reasoning approach for document summarization.

Agents must follow the instructions in this file.

--------------------------------------------------
AGENT 1 – Ingestion Agent
--------------------------------------------------
Responsibilities:
- Read the document.
- Identify page boundaries.
- Detect total page count.
- Extract headings, tables, and figures.
- Provide clean text chunks for pages 1–10 only.

Rules:
- Do not paraphrase.
- Do not summarize.
- Preserve ordering.

--------------------------------------------------
AGENT 2 – Structure Agent
--------------------------------------------------
Responsibilities:
- Map extracted content to the required output schema.
- Identify:
  - themes
  - stakeholders
  - decisions
  - processes
  - risks
  - definitions
  - tables

Rules:
- No content generation.
- Only classification and grouping.

--------------------------------------------------
AGENT 3 – Summary Agent
--------------------------------------------------
Responsibilities:
- Produce the final structured summary.
- Follow the output schema exactly.
- Write concise, decision-focused language.

Rules:
- No hallucination.
- No additional sections.
- No markdown tables.
- All tables must follow the plain text block format.

--------------------------------------------------
AGENT 4 – Quality & Compliance Agent
--------------------------------------------------
Responsibilities:
- Verify:
  - only 10 pages were summarized
  - all required sections exist
  - tables are correctly rendered
  - metadata fields are filled
- Flag missing or unclear information explicitly.

Rules:
- Do not rewrite content.
- Only correct structure, formatting, and compliance issues.
