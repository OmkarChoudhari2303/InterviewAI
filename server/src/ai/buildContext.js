export const buildContext = (matches) => {
    if (!matches || !matches.length) {
        return ""
    }

    return matches.map((match) => match.metadata?.text).filter((text) => typeof text === "string" && text.trim() !== "").join("\n\n")
};