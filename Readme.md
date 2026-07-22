# Docly — AI Document Assistant

Docly is a Retrieval-Augmented Generation (RAG) application that allows users to upload documents, generate AI summaries, and chat with individual documents or their entire document library.

Link: https://docly-ai.vercel.app

## Features

* Google Authentication
* PDF, DOC, DOCX, and TXT upload
* AWS S3 file storage
* Background document processing with BullMQ & Redis
* Text extraction and AI-generated summaries
* Semantic search using MongoDB Atlas Vector Search
* Document and Global AI chat
* Conversation history
* Source citations with page navigation
* Document pinning
* Streaming responses (SSE)
* Rate limiting
* Responsive dashboard with light/dark mode
* Vercel Analytics & Speed Insights

## Architecture

```text
Upload
  ↓
AWS S3
  ↓
BullMQ Worker
  ↓
Text Extraction
  ↓
Chunking
  ↓
Embeddings
  ↓
MongoDB Vector Search
  ↓
Context Retrieval
  ↓
LLM
  ↓
Streaming Response
```

## Tech Stack

**Frontend**

* React
* Vite
* Tailwind CSS
* React Router

**Backend**

* Node.js
* Express.js
* MongoDB Atlas
* BullMQ
* Redis
* AWS S3

**AI**

* MeshApi
* GPT-4o Mini
* `text-embedding-3-small`
* MongoDB Atlas Vector Search

## How It Works

1. Users upload documents.
2. Files are stored in AWS S3.
3. A background worker extracts text, generates summaries, splits content into chunks, and creates embeddings.
4. Embeddings are stored in MongoDB Atlas.
5. User questions are converted into embeddings and matched against the most relevant document chunks.
6. The retrieved context is sent to the LLM to generate accurate, source-backed responses.

## Project Highlights

* Retrieval-Augmented Generation (RAG)
* Semantic search with vector embeddings
* Cross-document retrieval
* Persistent chat history
* Streaming AI responses
* Source-backed citations
* Background document processing

## Core Idea

```
User Question
      ↓
Vector Search
      ↓
Relevant Context
      ↓
LLM
      ↓
Accurate Answer
```
