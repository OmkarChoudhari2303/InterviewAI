import ReactMarkdown from "react-markdown"

function MessageBubble({message}){
    const isUser = message.role === "user"

    return(
        <div className={`
        max-w-[75%]
        px-5
        py-3
        rounded-3xl
        bg-white
        text-black
        text-[15px]
        leading-7
        shadow-lg
        whitespace-pre-wrap

        ${
            isUser? `bg-white text-black max-w-fit ml-auto text-left` : `bg-zinc-900 text-white text-left max-w-fit`
        }
        `}
        >
            <ReactMarkdown>
                {message.content}
            </ReactMarkdown>
        </div>
    )
}

export default MessageBubble