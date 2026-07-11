# Docly Server
## Setup
### 1. Install dependencies
```bash
npm install
```
### 2. Configure environment variables
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in all required values before starting the server.
---
## MongoDB Atlas Vector Search
This project uses **MongoDB Atlas Vector Search** to retrieve relevant document chunks. A vector index must be created before the chat feature will work.

Create a **Vector Search Index** on the **`chunks`** collection with the following configuration:

| Setting      | Value          |
| ------------ | -------------- |
| Index Name   | `vector-index` |
| Vector Field | `embedding`    |
| Dimensions   | `1536`         |
| Similarity   | `cosine`       |
| Filter Field | `document`     |
---

## Start the application
Run the development server:
```bash
npm run dev
```
This starts:
* Express API
* BullMQ document processing worker
---
## Prerequisites
Before running the project, make sure the following services are available:
* MongoDB Atlas
* Redis
* AWS S3 Bucket
* MeshAPI Key
Once these are configured, the server is ready to process uploaded documents and answer questions using semantic search.
