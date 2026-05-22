# Website User Guide & Walkthrough

This guide provides step-by-step instructions on how to access, navigate, and utilize the features of the deployed `InterviewAI` platform.

---

## 🔗 Quick Access Link
Visit the deployed application at:  
👉 **[https://interview-ai-hazel.vercel.app/](https://interview-ai-hazel.vercel.app/)**

---

## 1. Landing & Authentication Flow

### A. Homepage (Landing Page)
When you first open the link, you will interact with the homepage. Please note that the full interactive homepage is not required for now and has not been built; its primary purpose is to serve as the entry point to access the Login and Signup pages.

### B. Accessing your Account
Choose your preferred login or signup path from the top-right navigation:
- **Existing Users**: Select **Login** to enter your registered email and password credentials.
- **New Users**: Select **Signup** to register a fresh developer profile.
- **Google Authentication**: For instant sign-in, the platform fully supports **Google OAuth**. Simply click the **Sign in with Google** button on the authentication page.

### C. Password Recovery
If you forget your credentials:
1. Click the **Forgot Password** link on the login screen.
2. Enter your registered email address and submit.
3. The forgot password feature will securely send a reset password link to your registered email. (Note: The registered email must be genuine and active, otherwise you will not receive the password recovery link).

---

## 2. Dashboard Navigation & Customization

Upon successful authentication, the top header will render the application navigation tabs: **Home**, **Dashboard**, **Chat**, and **Logout**.

### The Dashboard (Personalizing your Interview AI)
To receive questions tailored to your background, select the **Dashboard** tab. Here, you can populate and save your professional portfolio segments:
- **Profile Summary**: Write a short professional bio and attach your social links (GitHub & LinkedIn).
- **Technical Skills**: Input the languages, frameworks, databases, and tools you specialize in.
- **Software Projects**: Document the projects you built, including title, descriptions, and technology stack.
- **Education & Experience**: List your educational history and past professional work experiences.

> [!TIP]
> **Why populate the Dashboard?**  
> InterviewAI features an automated RAG (Retrieval-Augmented Generation) synchronization engine. Every time you save information on the Dashboard, the backend segments the text, generates vector embeddings, and synchronizes them to Pinecone. Populating these fields is the best way to prepare for an interview tailored to your exact resume!

---

## 3. Mock Interview Chat Simulator

Select the **Chat** tab to initiate a mock interview session.

### A. The Hybrid AI Architecture
The AI Interviewer operates on a hybrid prompt context system:
- **Resume-Tailored Questions**: When you ask or respond to questions, the system automatically runs a similarity search on your Pinecone vector index. If matching profile details are found, the AI naturally references your specific projects, skills, or experience, testing you on what you have claimed on your resume.
- **General Technical Knowledge**: If no specific resume context matches your query, the AI seamlessly falls back to general computer science concepts, coding problems, behavioral questions, and standard software engineering practices.

### B. Interactive Simulation
- The chat interface supports markdown rendering.
- Code blocks returned by the AI are formatted with syntax highlighting to help you review code snippets.
- Real-time responses are streamed chunk-by-chunk using Server-Sent Events (SSE) for a fluid conversational experience.

---

## 4. Invalidation & Session Security

To end your session securely, click the **Logout** button on the header menu.
- Logging out immediately invalidates your secure JSON Web Token (JWT) session cookies.
- Clears local storage state variables.
- Redirects your browser back to the **Login** screen to prevent unauthorized access.
