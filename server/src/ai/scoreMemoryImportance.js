export const scoreMemoryImportance = (summary = "") => {
    const importantKeywords = [
        "career",
        "goal",
        "interview",
        "backend",
        "frontend",
        "project",
        "learning",
        "preparing",
        "experience",
        "skill"
    ]

    const lowercase = summary.toLowerCase()

    let score = 0.3

    importantKeywords.forEach((keyword) => {
        if (lowercase.includes(keyword)) {
            score += 0.1
        }
    })

    return Math.min(score, 1);
}