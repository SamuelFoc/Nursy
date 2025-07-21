import { fetchEventSource } from "@microsoft/fetch-event-source"
import classNames from "classnames"
import { useCallback, useState } from "react"
import { APIEndpoints } from "../APIEndpoints"



type ChatHistoryRecord = {
    role: "user" | "assistant",
    message: string
}

const h: ChatHistoryRecord[] = [
    {
        role: "assistant",
        message: "Hello"
    },
    {
        role: "user",
        message: "Hello"
    },
    {
        role: "assistant",
        message: `Sure! Here's a short paragraph that’s at least six sentences long:

Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul.

Want me to write about a specific topic instead?`
    },
    {
        role: "user",
        message: "Hello"
    },
    {
        role: "assistant",
        message: "Hello"
    },
    {
        role: "user",
        message: "Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul."
    },
    {
        role: "assistant",
        message: "Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul."
    },
    {
        role: "user",
        message: "Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul."
    },
    {
        role: "assistant",
        message: "Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul."
    },
    {
        role: "user",
        message: "Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul."
    },
    {
        role: "assistant",
        message: "Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul."
    },
    {
        role: "user",
        message: "Today has been a pretty calm and quiet day. I spent the morning reading a book I’ve been meaning to finish for a while. The weather outside was cloudy, but it made everything feel cozy and peaceful. I made a cup of tea and sat by the window for a bit, just enjoying the stillness. Later, I plan to go for a short walk to get some fresh air and clear my head. Even simple days like this can feel refreshing and good for the soul."
    },
]

export default function Chat() {
    const [chatHistory, setChatHistory] = useState<ChatHistoryRecord[]>(h)
    const [answerInProgress, setAnswerInProgress] = useState<string | undefined>(undefined)
    const [currentMessage, setCurrentMessage] = useState<string>("")


    const submit = useCallback(async (message: string) => {
        setChatHistory(old => [...old, { role: "user", message }])
        setAnswerInProgress(""); // Initialize answer in progress

        const onEnd = () => {
            setAnswerInProgress(currentAnswer => {
                if (currentAnswer) {
                    setChatHistory(prev => [...prev, { role: "assistant", message: currentAnswer }]);
                }
                return undefined; // Clear answer in progress
            });
        };

        await fetchEventSource(APIEndpoints.conversation, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({ message }),
            onmessage(ev) {
                setAnswerInProgress(old => (old ?? "") + ev.data)
            },
            onclose() {
                onEnd()
            },
            onerror(err) {
                console.error(err)
                onEnd()
            }
        })
    }, [chatHistory])

    const handleSubmit = useCallback(() => {
        if (currentMessage.trim() && !answerInProgress) {
            submit(currentMessage.trim());
            setCurrentMessage("");
        }
    }, [currentMessage, answerInProgress, submit]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    return (
        <section className="max-w-[1200px] h-screen mx-auto flex flex-col gap-6">
            <div className="w-full flex flex-col gap-4 flex-1 overflow-y-scroll after:content-[''] after:min-h-[60%] after:block afet:w-full">
                {chatHistory.map(({ role, message }, index) => (
                    <p key={index} className={classNames(" text-[#2d2d2d] px-4 rounded-3xl max-w-[60%] whitespace-pre-line", message.length > 500 ? "py-4" : "py-2", role === "user" ? "bg-[#f4f4f4] self-end" : "self-start bg-white")}>
                        {message}
                    </p>
                ))}
                {answerInProgress && (
                    <p className={classNames(" text-[#2d2d2d] px-4 rounded-3xl max-w-[60%] whitespace-pre-line self-start bg-white", answerInProgress.length > 500 ? "py-4" : "py-2")}>
                        {answerInProgress}
                    </p>
                )}
            </div>

            <div className="w-full h-fit relative">
                <textarea 
                    placeholder="Ask anything" 
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!!answerInProgress}
                    className="p-4 border border-[#e5e5e5] rounded-3xl w-full resize-none min-h-[150px] field-sizing-content outline-none disabled:opacity-50" 
                />
                <button 
                    onClick={handleSubmit}
                    disabled={!currentMessage.trim() || !!answerInProgress}
                    className="absolute bottom-0 cursor-pointer right-0 m-4 bg-black rounded-full aspect-square w-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
                ></button>
            </div>
        </section>
    )
}

