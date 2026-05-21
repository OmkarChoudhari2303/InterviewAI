/**
 * This creates:
→ reusable dashboard wrapper
instead of repeating styles everywhere.
 */
function DashboardLayout({children}){
    return(
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">
                    Candidate Dashboard
                </h1>

                {children}
            </div>
        </div>
    )
}

export default DashboardLayout;