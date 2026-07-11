# Docly Client
Frontend for **Docly**, an AI-powered document chat application. Users can upload documents, browse their files, and ask questions using AI-powered semantic search.
## Tech Stack
* React 19
* Vite
* React Router
* Tailwind CSS 4
* Axios
* Framer Motion
* Radix UI
* React PDF
* Google OAuth
## Getting Started
### Install dependencies
```bash
npm install
```
### Configure environment variables
Create a `.env` file in the project root.
Example:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
Update the values according to your local or deployed backend.
## Run the project
Start the development server:
```bash
npm run dev
```
By default, the application runs at:
```text
http://localhost:5173
```
## Build
Create a production build:
```bash
npm run build
```
## Preview Production Build
```bash
npm run preview
```
## Available Scripts
| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Starts the development server       |
| `npm run build`   | Creates a production build          |
| `npm run preview` | Serves the production build locally |
| `npm run lint`    | Runs ESLint                         |