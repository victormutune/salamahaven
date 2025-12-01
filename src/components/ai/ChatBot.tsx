import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from 'lucide-react';
import { getChatCompletion } from '@/lib/api/gemini';
import { motion, AnimatePresence } from 'framer-motion';

// Define local interface for component state
interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Hi, I'm Shantel. I'm here to support you. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to bottom when messages change
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Get AI response
        const responseContent = await getChatCompletion([...messages, userMessage]);

        const aiMessage: ChatMessage = { role: 'assistant', content: responseContent };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-28 right-4 z-[60] flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] sm:w-[400px] shadow-2xl"
                    >
                        <Card className="border-primary/20 shadow-lg overflow-hidden">
                            <CardHeader className="bg-primary/5 p-4 flex flex-row items-center justify-between space-y-0 border-b">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 p-1.5 rounded-full">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Shantel Support</CardTitle>
                                        <p className="text-xs text-muted-foreground">Always here to help</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(true)}>
                                        <Minimize2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {msg.role === 'assistant' && (
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                                        <Bot className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${msg.role === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                        : 'bg-muted text-foreground rounded-tl-none'
                                                        }`}
                                                >
                                                    {msg.content}
                                                </div>
                                                {msg.role === 'user' && (
                                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                                                        <User className="h-4 w-4 text-primary-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex gap-2 justify-start">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                                    <Bot className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2 flex items-center">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-3 border-t bg-background">
                                <div className="flex w-full gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 focus-visible:ring-primary/20"
                                        disabled={isLoading}
                                    />
                                    <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {(!isOpen || isMinimized) && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative group"
                >
                    {/* Gradient Definition */}
                    <svg width="0" height="0" className="absolute block">
                        <defs>
                            <linearGradient id="chat-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#d97706" /> {/* amber-600 */}
                                <stop offset="50%" stopColor="#ea580c" /> {/* orange-600 */}
                                <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Pulse Effect */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75 duration-1000" />

                    <Button
                        size="icon"
                        className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-none bg-transparent hover:bg-transparent p-0 relative z-10"
                        onClick={() => {
                            setIsOpen(true);
                            setIsMinimized(false);
                        }}
                    >
                        <MessageCircle
                            className="h-10 w-10 md:h-12 md:w-12 drop-shadow-lg transition-all duration-300"
                            style={{ stroke: "url(#chat-icon-gradient)" }}
                            strokeWidth={1.5}
                        />
                        <span className="sr-only">Open Support Chat</span>
                    </Button>

                    {/* Tooltip Label */}
                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-background/80 backdrop-blur-sm border rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                        Chat with Shantel
                    </div>
                </motion.div>
            )}
        </div>
    );
}
