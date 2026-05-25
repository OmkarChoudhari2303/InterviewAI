import ReactMarkdown from "react-markdown"

function MessageBubble({message}){
    const isUser = message.role === "user"

    return(
        <div className={`
        max-w-[75%]
        px-5
        py-3
        rounded-3xl
        text-[15px]
        leading-7
        shadow-lg

        ${
            isUser ? "bg-white text-black ml-auto text-left max-w-fit" : "bg-zinc-900 text-white text-left max-w-fit"
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