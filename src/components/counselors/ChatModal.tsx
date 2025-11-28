import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { useState } from "react"

interface Message {
    id: number
    text: string
    sender: 'user' | 'counselor'
    timestamp: Date
}

interface ChatModalProps {
    isOpen: boolean
    onClose: () => void
    counselorName: string
}

export function ChatModal({ isOpen, onClose, counselorName }: ChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: `Hello! I'm ${counselorName}. How can I help you today?`, sender: 'counselor', timestamp: new Date() }
    ])
    const [newMessage, setNewMessage] = useState("")

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const userMsg: Message = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages([...messages, userMsg])
        setNewMessage("")

        // Mock response
        setTimeout(() => {
            const responseMsg: Message = {
                id: messages.length + 2,
                text: "Thank you for sharing. I'm here to listen.",
                sender: 'counselor',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, responseMsg])
        }, 1000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Chat with {counselorName}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4 p-2 border rounded-md my-2 bg-slate-50 dark:bg-slate-900">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${msg.sender === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <span className="text-[10px] opacity-70 mt-1 block">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
