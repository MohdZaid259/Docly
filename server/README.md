# Docly server

## Environment

Copy `.env.example` to `.env` and fill in every value. `MESHAPI_KEY` is the OpenRouter API key used for both chat completions and embeddings (`services/chat.service.js`, `services/embedding.service.js`).

## Required: MongoDB Atlas Search vector index

Vector search (`services/search.service.js`) requires **MongoDB Atlas** — the `$vectorSearch` aggregation stage does not work on a self-hosted/community MongoDB deployment. This index cannot be created via Mongoose/application code; it must be created once per environment through the Atlas UI, `mongosh`, or the Atlas Admin API.

Create a **Search Index** (type: *Vector Search*) on the `chunks` collection:

- **Index name:** `vector-index` (must match exactly — this is hardcoded in `search.service.js`)
- **Field to index:** `embedding`
- **Dimensions:** `1536` (matches `openai/text-embedding-3-small`, used in `services/embedding.service.js` — if you change the embedding model, update this to match)
- **Similarity:** `cosine`

Example index definition (Atlas UI → your cluster → Search → Create Search Index → JSON Editor):

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

Without this index, both single-document chat/search and global chat will fail at query time (the `$vectorSearch` stage errors if the named index doesn't exist).

## Running locally

```bash
npm install
npm run dev   # starts the API server + the BullMQ document-processing worker (server/index.js imports workers/doc.worker.js)
```

Requires a reachable Redis instance (`REDIS_URL` or `REDIS_HOST`/`REDIS_PORT`) for the upload processing queue, and an S3 bucket for document storage.
