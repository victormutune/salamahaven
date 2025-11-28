import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, ThumbsUp } from "lucide-react"
import { useState } from "react"

interface Review {
    id: number
    author: string
    rating: number
    date: string
    content: string
    likes: number
}

export function ReviewSection() {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 1,
            author: "Anonymous User",
            rating: 5,
            date: "2 weeks ago",
            content: "Dr. Sarah was incredibly understanding and helped me through a very difficult time. Highly recommended.",
            likes: 12
        },
        {
            id: 2,
            author: "J.D.",
            rating: 4,
            date: "1 month ago",
            content: "Great listener and provided practical advice. The booking process was smooth.",
            likes: 5
        }
    ])
    const [newReview, setNewReview] = useState("")
    const [rating, setRating] = useState(0)

    const handleSubmitReview = () => {
        if (!newReview.trim() || rating === 0) return

        const review: Review = {
            id: reviews.length + 1,
            author: "You",
            rating: rating,
            date: "Just now",
            content: newReview,
            likes: 0
        }

        setReviews([review, ...reviews])
        setNewReview("")
        setRating(0)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Write a Review</h3>
                <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <Textarea
                    placeholder="Share your experience..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="min-h-[100px]"
                />
                <Button onClick={handleSubmitReview} disabled={!newReview.trim() || rating === 0}>
                    Post Review
                </Button>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client Reviews ({reviews.length})</h3>
                {reviews.map((review) => (
                    <Card key={review.id} className="bg-muted/30">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`} />
                                        <AvatarFallback>{review.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{review.author}</p>
                                        <p className="text-xs text-muted-foreground">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm mt-2">{review.content}</p>
                            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground cursor-pointer hover:text-primary">
                                <ThumbsUp className="h-3 w-3" />
                                <span>Helpful ({review.likes})</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
