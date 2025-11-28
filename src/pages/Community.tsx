import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Heart, Share2, Search, Plus, User, Shield, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Post {
    id: string;
    author_name: string;
    author_role: string;
    created_at: string;
    title: string;
    content: string;
    likes_count: number;
    comments_count: number;
    tags: string[];
}

const categories = [
    "General Discussion",
    "Success Stories",
    "Legal Advice",
    "Mental Health",
    "Tech Support",
    "Safety Tips"
];

export default function Community() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
    const [submitting, setSubmitting] = useState(false);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<Record<string, any[]>>({});
    const [newComment, setNewComment] = useState("");
    const [commenting, setCommenting] = useState(false);
    const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

    const fetchPosts = async () => {
        try {
            const { data: postsData, error: postsError } = await supabase
                .from('community_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (postsError) throw postsError;
            setPosts(postsData || []);

            if (user) {
                const { data: likesData, error: likesError } = await supabase
                    .from('post_likes')
                    .select('post_id')
                    .eq('user_id', user.id);

                if (likesError) throw likesError;
                setUserLikes(new Set(likesData?.map(l => l.post_id) || []));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.title || !newPost.content) return;
        setSubmitting(true);
        try {
            const { error } = await supabase.from('community_posts').insert({
                title: newPost.title,
                content: newPost.content,
                tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t),
                author_id: user?.id,
                author_name: user?.user_metadata?.full_name || 'Anonymous User',
                author_role: 'Survivor' // Default role
            });

            if (error) throw error;

            setNewPost({ title: '', content: '', tags: '' });
            setIsDialogOpen(false);
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (postId: string, currentLikes: number) => {
        if (!user) return; // Should probably prompt login

        const isLiked = userLikes.has(postId);
        const newLikesCount = isLiked ? currentLikes - 1 : currentLikes + 1;

        // Optimistic update
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: newLikesCount } : p));
        setUserLikes(prev => {
            const next = new Set(prev);
            if (isLiked) next.delete(postId);
            else next.add(postId);
            return next;
        });

        try {
            if (isLiked) {
                const { error } = await supabase
                    .from('post_likes')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('post_id', postId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('post_likes')
                    .insert({ user_id: user.id, post_id: postId });
                if (error) throw error;
            }
            // Note: Trigger updates the count on community_posts table
        } catch (error) {
            console.error('Error toggling like:', error);
            fetchPosts(); // Revert on error
        }
    };

    const toggleComments = async (postId: string) => {
        if (expandedPostId === postId) {
            setExpandedPostId(null);
            return;
        }

        setExpandedPostId(postId);
        if (!comments[postId]) {
            try {
                const { data, error } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('post_id', postId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                setComments(prev => ({ ...prev, [postId]: data || [] }));
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
    };

    const handlePostComment = async (postId: string) => {
        if (!newComment.trim()) return;
        setCommenting(true);
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    content: newComment,
                    user_id: user?.id,
                    user_name: user?.user_metadata?.full_name || 'Anonymous User'
                })
                .select()
                .single();

            if (error) throw error;

            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), data]
            }));

            // Update comment count on post (handled by trigger now)
            setPosts(posts.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p));

            setNewComment("");
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setCommenting(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user]); // Add user to dependency array to re-fetch likes when user logs in

    return (
        <div className="container py-10 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Community Support</h1>
                    <p className="text-muted-foreground">A safe space to share, connect, and heal together.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> New Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Post</DialogTitle>
                            <DialogDescription>
                                Share your story or ask for advice. You can post anonymously.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Give your post a title"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your post here..."
                                    className="min-h-[100px]"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    placeholder="e.g. Advice, Support, Legal"
                                    value={newPost.tags}
                                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreatePost} disabled={submitting}>
                                {submitting ? "Posting..." : "Post"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search topics..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y">
                                {categories.map((cat) => (
                                    <li key={cat} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors text-sm font-medium">
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Community Guidelines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p className="mb-2">1. Be respectful and kind.</p>
                            <p className="mb-2">2. No hate speech or bullying.</p>
                            <p>3. Protect your privacy and others'.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Feed */}
                <div className="lg:col-span-3 space-y-6">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading community posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No posts found. Be the first to share!</div>
                    ) : (
                        posts.map((post) => (
                            <Card key={post.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm flex items-center gap-2">
                                                    {post.author_name}
                                                    {post.author_role === "Verified Counselor" && (
                                                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-xl mt-2">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {post.content}
                                    </p>
                                    <div className="flex gap-2 mt-4">
                                        {post.tags && post.tags.map(tag => (
                                            <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t pt-4 flex flex-col gap-4 items-start">
                                    <div className="flex gap-6 text-muted-foreground w-full">
                                        <button
                                            className={`flex items-center gap-2 text-sm transition-colors ${userLikes.has(post.id) ? 'text-red-500 hover:text-red-600' : 'hover:text-primary'}`}
                                            onClick={() => handleLike(post.id, post.likes_count)}
                                        >
                                            <Heart className={`h-4 w-4 ${userLikes.has(post.id) ? 'fill-current' : ''}`} /> {post.likes_count}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                                            onClick={() => toggleComments(post.id)}
                                        >
                                            <MessageSquare className="h-4 w-4" /> {post.comments_count} Comments
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {expandedPostId === post.id && (
                                        <div className="w-full space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-3 pl-4 border-l-2 border-muted">
                                                {comments[post.id]?.map((comment) => (
                                                    <div key={comment.id} className="text-sm">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-xs">{comment.user_name}</span>
                                                            <span className="text-[10px] text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-muted-foreground">{comment.content}</p>
                                                    </div>
                                                ))}
                                                {(!comments[post.id] || comments[post.id].length === 0) && (
                                                    <p className="text-xs text-muted-foreground italic">No comments yet.</p>
                                                )}
                                            </div>

                                            <div className="flex gap-2 items-start pt-2">
                                                <Textarea
                                                    placeholder="Write a comment..."
                                                    className="min-h-[60px] text-sm"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                />
                                                <Button size="icon" onClick={() => handlePostComment(post.id)} disabled={commenting}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
