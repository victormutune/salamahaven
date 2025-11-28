import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, MessageCircle, Star, Video } from "lucide-react"
import { useState } from "react"
import { ChatModal } from "./ChatModal"
import { ReviewSection } from "./ReviewSection"

interface CounselorProfileProps {
    isOpen: boolean
    onClose: () => void
    counselor: any // Using any for simplicity as we'll pass the full object
    onBook: () => void
}

export function CounselorProfile({ isOpen, onClose, counselor, onBook }: CounselorProfileProps) {
    const [isChatOpen, setIsChatOpen] = useState(false)

    if (!counselor) return null

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5">
                        <div className="absolute -bottom-12 left-8">
                            <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center text-3xl font-bold text-primary">
                                {counselor.name.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 px-8 pb-4 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                                <DialogTitle className="text-2xl font-bold">{counselor.name}</DialogTitle>
                                <p className="text-muted-foreground">{counselor.specialization}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span className="font-medium">{counselor.rating}</span>
                                        <span className="text-muted-foreground">(120+ reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{counselor.distance} away</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsChatOpen(true)}>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Chat
                                </Button>
                                <Button onClick={onBook}>Book Appointment</Button>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-8 pt-4">
                            <Tabs defaultValue="about" className="w-full">
                                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                                    <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">About</TabsTrigger>
                                    <TabsTrigger value="availability" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Availability</TabsTrigger>
                                    <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Reviews</TabsTrigger>
                                </TabsList>

                                <TabsContent value="about" className="mt-6 space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Biography</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Dr. {counselor.name.split(' ')[1]} is a dedicated professional with over 10 years of experience in {counselor.specialization}.
                                            They specialize in providing a safe and supportive environment for individuals dealing with trauma, anxiety, and stress.
                                            Their approach is patient-centered, focusing on building resilience and empowering clients to overcome challenges.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Specializations</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {counselor.specialization.split(' & ').map((spec: string, i: number) => (
                                                <Badge key={i} variant="secondary">{spec}</Badge>
                                            ))}
                                            <Badge variant="secondary">Anxiety</Badge>
                                            <Badge variant="secondary">Depression</Badge>
                                            <Badge variant="secondary">Stress Management</Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Languages</h3>
                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                            <span>English</span>
                                            <span>•</span>
                                            <span>Spanish</span>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="availability" className="mt-6">
                                    <div className="grid gap-4">
                                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                                            <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Next Available Slot</p>
                                                <p className="text-sm text-muted-foreground">{counselor.availability}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="ml-auto" onClick={onBook}>Book Now</Button>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Typical Hours</h4>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex justify-between p-2 bg-muted/50 rounded">
                                                    <span>Mon - Fri</span>
                                                    <span>9:00 AM - 6:00 PM</span>
                                                </div>
                                                <div className="flex justify-between p-2 bg-muted/50 rounded">
                                                    <span>Saturday</span>
                                                    <span>10:00 AM - 2:00 PM</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                            <Video className="h-4 w-4" />
                                            <span>Video consultations available</span>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="reviews" className="mt-6">
                                    <ReviewSection />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                counselorName={counselor.name}
            />
        </>
    )
}
