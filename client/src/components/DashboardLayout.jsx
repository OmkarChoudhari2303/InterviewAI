/**
 * This creates:
→ reusable dashboard wrapper
instead of repeating styles everywhere.
 */
function DashboardLayout({children}){
    return(
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
                    Candidate Dashboard
                </h1>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 mb-8 text-zinc-300 max-w-4xl">
                    <svg className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs md:text-sm leading-relaxed text-zinc-450 text-left">
                        <strong className="text-zinc-200">Customize Your AI Twin:</strong> Complete your profile forms below to customize your personal AI Interview Agent. This information directly trains the AI RAG engine, allowing it to answer queries from recruiters accurately using your verified skills, experience, and projects.
                    </span>
                </div>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout;