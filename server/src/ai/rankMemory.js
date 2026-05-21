export const rankMemory = (chunks = [])=>{
    return chunks.sort(
        (a,b)=>{
            //prioritize higher score. (Score higher means more accurate.)

            return (b.score || 0) - (a.score || 0) //descending (b-a)(higher score) ascending (a-b)(lower score)
        }
    )   
}
