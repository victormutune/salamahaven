import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    counselorName: string
}

export function BookingModal({ isOpen, onClose, counselorName }: BookingModalProps) {
    const { user } = useAuth()
    const [date, setDate] = useState<Date>()
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!date) {
            alert("Please select a date")
            return
        }

        if (!user) {
            alert("You must be logged in to book an appointment")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    counselor_name: counselorName,
                    date: date.toISOString(),
                    reason: reason,
                    status: 'pending'
                })

            if (error) throw error

            alert(`Appointment request sent to ${counselorName}`)
            onClose()
            // Reset form
            setDate(undefined)
            setReason("")
        } catch (error: any) {
            console.error('Error booking appointment:', error)
            alert('Failed to book appointment: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        Schedule a session with {counselorName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason for visit (Optional)</Label>
                        <Textarea
                            id="reason"
                            placeholder="Briefly describe what you'd like to discuss..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Confirm Booking
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
