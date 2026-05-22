# InterviewAI 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![Pinecone](https://img.shields.io/badge/Pinecone-VectorDB-000000?logo=pinecone&logoColor=white)](https://pinecone.io)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://neon.tech)

`InterviewAI` is a personalized AI-assisted interview preparation platform designed to help candidates succeed in their mock technical interviews. By analyzing the candidate's professional profile (resumes, projects, education, and skills) along with short-term/long-term conversation history, it dynamically generates personalized, context-aware mock interview questions and evaluations.

🔗 **Live Website Access Link**: [https://interview-ai-hazel.vercel.app/](https://interview-ai-hazel.vercel.app/)

---

## 📖 Table of Contents
1. [Key Features](#-key-features)
2. [User Guide & Website Walkthrough](#-user-guide--website-walkthrough)
3. [Project Architecture](#-project-architecture)
4. [RAG Implementation Summary](#-rag-implementation-summary)
5. [Detailed Documentation](#-detailed-documentation)
6. [Setup & Installation Instructions](#-setup--installation-instructions)

---

## 🌟 Key Features

- **Personalized RAG Interviews**: The AI interviewer dynamically retrieves your resume details, technical skills, projects, and work experience to ask custom questions tailored to you.
- **Short & Long-Term Memory**: The system recalls details from the current conversation and synthesizes long-term memory summaries from prior sessions.
- **Self-Healing Fallbacks**: If the vector database ever loses sync, the server automatically recovers and re-vectorizes your profile details directly from the relational database.
- **Interactive Markdown Streaming**: Real-time response streaming from the model using Server-Sent Events (SSE), complete with syntax highlighting for code blocks.
- **Flexible Authentication**: Sign up with local email-password verification or standard Google OAuth credentials.

---

## 📖 User Guide & Website Walkthrough

For a step-by-step user guide detailing authentication pathways, database updates, RAG-powered hybrid interview simulations, and logout operations, check out:  
👉 **[docs/user_guide.md](docs/user_guide.md)**

---

## 🏗️ Project Architecture

The system consists of a decoupled Client and Server:
* **Client (`/client`)**: Built with React + Vite, styled using Tailwind CSS, and uses dynamic streaming interfaces to communicate with the backend.
- **Server (`/server`)**: An Express.js application interacting with Neon PostgreSQL (via Prisma ORM) for core relations and Pinecone for semantic vector indices.

For detailed sequence diagrams and database schemas, check out [docs/architecture.md](docs/architecture.md).

---

## 🧠 RAG Implementation Summary

1. **Semantic Chunking**: [buildUserChunks.js](server/src/vector/buildUserChunks.js) divides developer profiles into standard segments (`profile`, `skills`, `projects`, `education`, `experience`).
2. **Vector Space**: Embeddings are generated using the `gemini-embedding-001` model (768 dimensions) and stored in Pinecone database filters.
3. **Retrieval, Ranking & Compression**: Relevant nodes are retrieved using cosine similarity, deduplicated, sorted by matching scores, and compressed to the top 6 entries before prompt generation.
4. **Memory Summaries**: Finished conversations are summarized, scored for career relevance, and saved to PostgreSQL and Pinecone.

For details on the vector math, memory compression, and self-healing systems, see [docs/rag_implementation.md](docs/rag_implementation.md).

---

## 📁 Detailed Documentation

For ease of review, the project documentation is organized under the `docs/` folder:
- **User Guide**: Step-by-step instructions on accessing, login, database customization, and chat. [View here](docs/user_guide.md)
- **System Architecture**: Detailed sequence diagrams and topology explanation. [View here](docs/architecture.md)
- **RAG Implementation**: Technical deep-dive into semantic chunking, embeddings, post-retrieval ranking, memory tiers, and self-healing. [View here](docs/rag_implementation.md)
- **APIs & Tools**: Comprehensive API routing table, parameters, and active libraries directory. [View here](docs/apis_and_tools.md)

---

## 🛠️ Setup & Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database (e.g., [Neon DB](https://neon.tech))
- [Pinecone DB](https://www.pinecone.io/) Account and index name
- [Google AI Studio API Key](https://aistudio.google.com/) for Gemini models

---

### Step 1: Clone and Install Dependencies

Install packages in both directories:
```bash
# Clone the repository (if not already local)
git clone <repository_url>
cd InterviewAI

# Install client packages
cd client
npm install

# Install server packages
cd ../server
npm install
```

---

### Step 2: Configure Environment Variables

Create `.env` files in both directories. Refer to the configuration outlines below:

#### Server Environment (`server/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
JWT_SECRET="your-jwt-auth-access-key-here"
JWT_REFRESH_SECRET="your-jwt-auth-refresh-key-here"

# Transactional emails for password recovery
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password-from-google"

# App frontend location
CLIENT_URL="http://localhost:5173"

# APIs & Databases Keys
GOOGLE_CLIENT_ID="your-google-oauth-client-id-here"
GEMINI_API_KEY="your-gemini-studio-api-key-here"
GEMINI_MODEL="gemini-3.5-flash"
PINECONE_API_KEY="your-pinecone-api-key-here"
PINECONE_INDEX="your-index-name"
```

#### Client Environment (`client/.env`)
```env
VITE_GOOGLE_CLIENT_ID="your-google-oauth-client-id-here"
VITE_API_URL="http://localhost:5000/api"
```

---

### Step 3: Run Database Migrations

Generate Prisma types and run PostgreSQL migrations:
```bash
cd server
npx prisma generate
npx prisma db push
```

---

### Step 4: Run the Application Locally

Run client and server development mode in separate terminals:

#### Start Server
```bash
cd server
npm run dev
```

#### Start Client
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
