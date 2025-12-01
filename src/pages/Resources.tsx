import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Scale, Heart, Shield, ExternalLink, Lock, Play, BookOpen, Headphones, Clock, User } from "lucide-react";

export default function Resources() {
    const videos = [
        {
            title: "Healing After Trauma",
            duration: "15:30",
            thumbnail: "bg-amber-100 dark:bg-amber-900/20",
            description: "A guided session on understanding and processing traumatic experiences."
        },
        {
            title: "Understanding Your Rights",
            duration: "10:45",
            thumbnail: "bg-blue-100 dark:bg-blue-900/20",
            description: "Legal expert explains the basics of protection orders and digital safety laws."
        },
        {
            title: "Self-Care Routine for Survivors",
            duration: "08:20",
            thumbnail: "bg-emerald-100 dark:bg-emerald-900/20",
            description: "Simple daily practices to help ground yourself during difficult times."
        },
        {
            title: "Digital Safety Workshop",
            duration: "25:00",
            thumbnail: "bg-purple-100 dark:bg-purple-900/20",
            description: "Step-by-step guide to securing your devices and social media accounts."
        }
    ];

    const articles = [
        {
            title: "The Path to Recovery: A Guide",
            author: "Dr. Sarah Kimani",
            readTime: "5 min read",
            summary: "Explore the stages of healing and how to navigate them with patience and self-compassion.",
            category: "Mental Health"
        },
        {
            title: "Cyberstalking: What You Need to Know",
            author: "Legal Aid Kenya",
            readTime: "8 min read",
            summary: "Comprehensive overview of cyberstalking laws in Kenya and how to gather evidence.",
            category: "Legal"
        },
        {
            title: "Building a Support System",
            author: "Community Wellness Team",
            readTime: "4 min read",
            summary: "Tips on identifying safe people and building a network of support around you.",
            category: "Community"
        },
        {
            title: "Digital Hygiene Checklist",
            author: "Tech Safety Alliance",
            readTime: "6 min read",
            summary: "Essential steps to ensure your online presence is secure and private.",
            category: "Safety"
        }
    ];

    const podcasts = [
        {
            title: "Voices of Resilience",
            episode: "Ep. 12: Finding Your Voice",
            duration: "45 min",
            description: "Survivors share their stories of reclaiming their power and finding their voice after abuse."
        },
        {
            title: "Legal Insights",
            episode: "Ep. 5: Protection Orders Explained",
            duration: "30 min",
            description: "An interview with a family lawyer discussing the process of obtaining a restraining order."
        },
        {
            title: "Mindful Moments",
            episode: "Ep. 20: Grounding Techniques",
            duration: "15 min",
            description: "A short episode focusing on breathing exercises and grounding techniques for anxiety."
        }
    ];

    const emergencyResources = [
        {
            title: "National Domestic Violence Hotline",
            description: "24/7 confidential support.",
            contact: "1195 (Kenya)",
            icon: <Phone className="h-5 w-5 text-red-500" />
        },
        {
            title: "Gender-Based Violence Recovery Centers",
            description: "Medical and psychosocial support.",
            contact: "Various Locations",
            icon: <Heart className="h-5 w-5 text-pink-500" />
        },
        {
            title: "Legal Aid Service",
            description: "Free legal advice and representation.",
            contact: "0800 221 022",
            icon: <Scale className="h-5 w-5 text-blue-500" />
        }
    ];

    return (
        <div className="container py-8 max-w-6xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3  bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">
                    Resources & Inspiration
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    A collection of videos, articles, and podcasts to support your journey of healing, resilience, and empowerment.
                </p>
            </div>

            <Tabs defaultValue="videos" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 max-w-2xl mx-auto">
                    <TabsTrigger value="videos" className="gap-2">
                        <Play className="h-4 w-4" />
                        <span className="hidden sm:inline">Videos</span>
                    </TabsTrigger>
                    <TabsTrigger value="articles" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Articles</span>
                    </TabsTrigger>
                    <TabsTrigger value="podcasts" className="gap-2">
                        <Headphones className="h-4 w-4" />
                        <span className="hidden sm:inline">Podcasts</span>
                    </TabsTrigger>
                    <TabsTrigger value="emergency" className="gap-2 text-red-600 data-[state=active]:text-red-700 data-[state=active]:bg-red-50 dark:data-[state=active]:bg-red-950/20">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Emergency</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="videos" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {videos.map((video, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                                <div className={`aspect-video ${video.thumbnail} relative flex items-center justify-center`}>
                                    <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Play className="h-6 w-6 text-primary ml-1" />
                                    </div>
                                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {video.duration}
                                    </span>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{video.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{video.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="articles" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow border-l-4 border-l-primary/40">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                                            {article.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {article.readTime}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                                        {article.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <User className="h-3 w-3" /> {article.author}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">{article.summary}</p>
                                    <Button variant="outline" size="sm" className="w-full gap-2 group">
                                        Read Article <ExternalLink className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="podcasts" className="space-y-6">
                    <div className="space-y-4">
                        {podcasts.map((podcast, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-32 bg-muted flex items-center justify-center p-6 sm:rounded-l-lg sm:rounded-tr-none rounded-t-lg">
                                        <Headphones className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg">{podcast.title}</h3>
                                                <p className="text-sm text-primary font-medium">{podcast.episode}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded">
                                                <Clock className="h-3 w-3" /> {podcast.duration}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">{podcast.description}</p>
                                        <Button size="sm" className="gap-2">
                                            <Play className="h-3 w-3" /> Listen Now
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="emergency">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {emergencyResources.map((resource, index) => (
                            <Card key={index} className="border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                            {resource.icon}
                                        </div>
                                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-base">{resource.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                                        <p className="text-sm text-muted-foreground mb-1">Contact:</p>
                                        <p className="text-xl font-bold text-red-600 dark:text-red-400">{resource.contact}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 p-6 border border-dashed border-muted-foreground/30 rounded-xl text-center">
                        <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Your safety is paramount. If you are browsing this page on a shared device, consider using private browsing mode or clearing your history after you leave.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
