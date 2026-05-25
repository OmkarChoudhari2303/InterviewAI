import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background radial gradient blobs for rich modern visual effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center pt-20 pb-10 px-4 max-w-6xl mx-auto text-center">
        {/* Animated Logo and Header */}
        <div className="flex flex-col items-center justify-center gap-4 mb-6 animate-fade-in-up">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-red-500 opacity-30 group-hover:opacity-75 blur transition duration-500"></div>
            <img
              src="/logo.png"
              alt="InterviewAI Logo"
              className="relative h-20 w-20 md:h-24 md:w-24 object-contain animate-fade-in"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] hover:bg-[100%_0] transition-all duration-700">
              InterviewAI
            </span>
          </h1>
        </div>

        {/* Animated Subtitle */}
        <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          A Personalized AI-powered Candidate Profile Agent that answers questions based on your professional profile data.
        </p>

        {/* Top Get Started Button */}
        <div className="animate-fade-in-up delay-300">
          <button
            onClick={handleGetStarted}
            className="relative group bg-white text-black text-sm md:text-base font-bold px-8 py-4 rounded-xl hover:bg-zinc-200 transition duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Interactive Screenshot Showcase Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in-up delay-500">
        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 shadow-2xl animate-pulse-glow animate-border-glow overflow-hidden">
          {/* Mock Browser Title Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-900 bg-zinc-950/60 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-zinc-500 font-mono select-none truncate max-w-[200px] sm:max-w-md">
              https://interviewai.chat/chat
            </div>
            <div className="w-12"></div>
          </div>

          {/* Browser Body with Screenshot */}
          <div className="overflow-hidden rounded-xl bg-black">
            <img
              src="/screenshot.png"
              alt="InterviewAI Chat Interface Screenshot"
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition duration-500"
            />
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-zinc-950/50 border-t border-b border-zinc-900 py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-12 tracking-tight">
            How InterviewAI Empowers Your Search
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50 transition group duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 font-bold text-xl group-hover:scale-110 transition duration-300">
                👤
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Profile-Based Answers</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The agent answers queries using your specific skills, projects, experience, and educational background. No generic responses.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50 transition group duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 font-bold text-xl group-hover:scale-110 transition duration-300">
                💬
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Streamed RAG Conversations</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Utilizes Retrieval-Augmented Generation (RAG) to feed correct candidate context to the AI, delivering smooth real-time streams.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50 transition group duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 font-bold text-xl group-hover:scale-110 transition duration-300">
                ⚙️
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Instant Sync Dashboard</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Keep your portfolio data up to date using the intuitive dashboard. The chatbot updates its internal knowledge base instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Call to Action Section */}
      <div className="py-24 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white tracking-tight">
          Ready to Elevate Your Resume?
        </h2>
        <p className="text-zinc-400 mb-8 text-sm md:text-base leading-relaxed">
          Create an interactive AI twin that handles recruitment questions for you, showing off your skills and projects dynamically.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-black text-sm md:text-base font-bold px-8 py-4 rounded-xl hover:bg-zinc-200 transition duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] cursor-pointer"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
}

export default Home;