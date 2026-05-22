# APIs, Endpoints, and Tools Directory

This document lists all backend REST API endpoints, external services, libraries, and tools utilized across the client and server components of `InterviewAI`.

---

## 1. REST API Endpoint Directory

All endpoints are prefixed with `/api` and require a JSON request body unless specified otherwise. Routes marked with **[Protected]** require a valid HTTP Bearer Token in the `Authorization` header.

### Authentication Routes (`/api/auth`)
| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/signup` | POST | Public | Registers a new user. Hashes password using bcrypt. |
| `/login` | POST | Public | Validates credentials and returns Access & Refresh tokens. |
| `/refresh-token` | POST | Public | Issues a new access token using a valid refresh token. |
| `/logout` | POST | Public | Deletes active refresh tokens and clears client HTTP-only cookies. |
| `/forgot-password`| POST | Public | Generates reset token and emails a validation link to the candidate. |
| `/reset-password` | POST | Public | Updates user password using reset token validation. |
| `/google` | POST | Public | Authenticates credentials through Google OAuth Client integration. |

### User Profile Management Routes (`/api/profile`, `/api/skills`, `/api/projects`, etc.)
All the routes below automatically trigger Pinecone Vector DB synchronization to ensure RAG updates in real-time.

| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/profile` | GET | **[Protected]** | Retrieves candidate profile details. |
| `/profile` | POST | **[Protected]** | Creates/updates candidate bio, name, and social URLs. |
| `/skills` | GET | **[Protected]** | Retrieves list of user's skills. |
| `/skills` | POST | **[Protected]** | Appends technical skill nodes to the user's profile. |
| `/skills/:id` | DELETE | **[Protected]** | Removes a skill from user profile. |
| `/projects` | GET | **[Protected]** | Retrieves list of user's projects. |
| `/projects` | POST | **[Protected]** | Creates a project entry (Title, Tech stack, Description). |
| `/projects/:id` | PUT | **[Protected]** | Edits details of an existing project. |
| `/projects/:id` | DELETE | **[Protected]** | Deletes a project. |
| `/education` | GET | **[Protected]** | Retrieves educational background list. |
| `/education` | POST | **[Protected]** | Appends educational experience logs. |
| `/education/:id` | DELETE | **[Protected]** | Deletes an education record. |
| `/experience` | GET | **[Protected]** | Retrieves candidate work experience entries. |
| `/experience` | POST | **[Protected]** | Appends professional employment records. |
| `/experience/:id` | DELETE | **[Protected]** | Deletes an experience record. |

### Chat Routes (`/api/chat`)
| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/` | GET | **[Protected]** | Retrieves user conversation list history. |
| `/history/:id` | GET | **[Protected]** | Loads messages associated with a specific conversation ID. |
| `/stream` | POST | **[Protected]** | Streams Gemini answers via Server-Sent Events (SSE) using RAG context. |
| `/:id` | DELETE | **[Protected]** | Deletes a conversation and its messages. |

### Vector Sync Route (`/api/vectors`)
| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/sync` | POST | **[Protected]** | Manually forces database data chunking and synchronization with Pinecone. |

---

## 2. Tools, Libraries, and APIs Reference

`InterviewAI` leverages a robust, industry-standard modern technology stack to perform at scale:

### Core Frameworks and Services
- **Google Gemini API (`@google/genai` and `@google/generative-ai`)**:
  - `gemini-3.5-flash`: Chat and conversation models, text generation, streaming, long-term memory synthesis.
  - `gemini-embedding-001`: Vector embeddings generator producing 768-dimensional float arrays.
- **Pinecone Vector Database (`@pinecone-database/pinecone`)**: Serverless similarity index storing vector records alongside custom metadata (`userId`, `text`, `type`, `memoryType`) for rapid cosine-similarity lookups.
- **Neon PostgreSQL**: A serverless, cloud-native PostgreSQL provider powering transactional and relational storage.
- **Prisma ORM (`prisma` and `@prisma/client`)**: Next-generation Node.js ORM used for type-safe database queries, schema migrations, and relational modeling.

### Backend Infrastructure
- **Express.js**: Node.js web application framework handling server middleware, request routers, and error boundaries.
- **Nodemailer**: Node.js SMTP email dispatcher module used for transactional account emails (OTP and password resets). (I have used my personal email to send the reset password links, no external email services are used)
- **Bcrypt.js**: Cryptographic library used to hash, salt, and verify candidate passwords.
- **JSONWebToken (`jsonwebtoken`)**: Signed payload standard used for stateless session management (Access/Refresh credentials).
- **Zod**: Type-safe schema validation library enforcing input integrity on incoming requests (schemas for signup, login, password updates).
- **Helmet & CORS**: Security header injection and Cross-Origin Resource Sharing control.
- **Compression**: Gzip compression middleware to reduce network traffic.

### Frontend Client
- **React.js & Vite**: Standard web client framework utilizing Vite's Hot Module Replacement (HMR) for fast local development.
- **Tailwind CSS**: Utility-first styling framework enabling a responsive user interface design.
- **React Router DOM**: Client-side declarative routing library.
- **React Markdown**: Formats structured responses streamed by Gemini (supporting code blocks, bullet points, headers).
- **Google OAuth Client (`@react-oauth/google`)**: Integrates Google sign-in buttons directly on the landing page for quick registration.
