export const deduplicateMemory = (chunks=[])=>{
    const seen = new Set()

    return chunks.filter((chunk)=>{
        if (!chunk || typeof chunk.text !== 'string') {
            return false
        }
        const normalized = chunk.text.trim().toLowerCase()

        if(seen.has(normalized)){
            return false
        }

        seen.add(normalized)

        return true
    })
}
