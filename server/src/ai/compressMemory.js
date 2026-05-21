export const compressMemory = ({
    chunks = [],
    limit = 6
}) => {
    return chunks.slice(0, limit)
}
