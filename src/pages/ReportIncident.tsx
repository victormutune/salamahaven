import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Check,
    Upload,
    ArrowRight,
    ArrowLeft,
    MapPin,
    AlertTriangle,
    Shield,
    Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ReportIncident() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        location: '',
        date: '',
        files: [] as File[],
        anonymous: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setFormData((prev) => ({
            ...prev,
            files,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // TODO: Handle file uploads to Supabase Storage 'evidence' bucket
            // const fileUrls = await uploadFiles(formData.files);

            const { error } = await supabase.from('reports').insert({
                type: formData.category,
                description: formData.description,
                incident_date: formData.date ? new Date(formData.date).toISOString() : null,
                location_address: formData.location,
                is_anonymous: formData.anonymous,
                user_id: formData.anonymous ? null : (user?.id || null),
                status: 'pending'
            });

            if (error) throw error;

            // Success - navigate or show success message
            // For now, redirect to home or a success page
            alert('Report submitted successfully!');
            navigate('/');
        } catch (error: any) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canGoNext =
        step === 1
            ? Boolean(formData.category && formData.description)
            : true;

    const steps = [
        { id: 1, title: 'Incident Details', icon: AlertTriangle },
        { id: 2, title: 'Evidence Upload', icon: Upload },
        { id: 3, title: 'Confirmation', icon: Check },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-amber-50 via-orange-50 to-emerald-50/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-6 md:py-10">
            <div className="container max-w-5xl px-4 sm:px-6">
                <div className="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                            <Shield className="h-3 w-3" />
                            Safe, encrypted reporting
                        </div>
                        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">
                            Report an Incident
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl">
                            Share what happened in your own words. You can choose to remain anonymous. Your story helps us
                            protect you and others.
                        </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2 text-xs md:text-sm">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                            <Clock className="h-4 w-4" />
                            Takes about 3–5 minutes
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xs text-xs">
                            If you are in immediate danger, please use the Emergency page or your local emergency number.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {/* Sidebar Progress */}
                    <div className="md:col-span-4 lg:col-span-3 space-y-4 md:space-y-6">
                        <Card className="border-none bg-white/70 dark:bg-slate-900/60 shadow-md backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Your safety comes first</CardTitle>
                                <CardDescription>
                                    You can stop at any time. Your report is stored securely and can be anonymous.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                                <p>• Avoid sharing passwords or PINs.</p>
                                <p>• If you feel unsafe, close this page and seek immediate help.</p>
                                <p>• You can attach screenshots, audio, or video as evidence.</p>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            {steps.map((s) => (
                                <div
                                    key={s.id}
                                    className={`flex items-center gap-4 rounded-xl border px-3 py-2 text-sm transition-all ${step === s.id
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100'
                                        : step > s.id
                                            ? 'border-emerald-300 bg-emerald-50/60 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100'
                                            : 'border-slate-200 bg-white/70 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60'
                                        }`}
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-current bg-white/80 dark:bg-slate-900/80">
                                        {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{s.title}</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Step {s.id} of {steps.length}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="md:col-span-8 lg:col-span-9">
                        <Card className="border-none shadow-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>{steps[step - 1].title}</CardTitle>
                                <CardDescription>
                                    {step === 1 && "Please provide as much detail as possible about the incident."}
                                    {step === 2 && "Upload any screenshots, videos, or audio recordings you have."}
                                    {step === 3 && "Review your report before submitting."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {step === 1 && (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label>
                                                        Category<span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select
                                                        value={formData.category}
                                                        onValueChange={(value) =>
                                                            setFormData((prev) => ({ ...prev, category: value }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="cyberbullying">Cyberbullying</SelectItem>
                                                            <SelectItem value="harassment">Online Harassment</SelectItem>
                                                            <SelectItem value="stalking">Cyberstalking</SelectItem>
                                                            <SelectItem value="doxing">Doxing</SelectItem>
                                                            <SelectItem value="hate-speech">Hate Speech</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Date &amp; Time</Label>
                                                    <Input
                                                        type="datetime-local"
                                                        value={formData.date}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, date: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Location / Platform</Label>
                                                    <div className="relative">
                                                        <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            className="pl-9"
                                                            placeholder="e.g. Instagram, Facebook, WhatsApp, or physical location"
                                                            value={formData.location}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, location: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Description<span className="text-red-500">*</span>
                                                    </Label>
                                                    <Textarea
                                                        placeholder="Describe what happened, including dates, people involved, and any threats made..."
                                                        className="min-h-[160px]"
                                                        value={formData.description}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, description: e.target.value })
                                                        }
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        You can write in any language you are comfortable with.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className="space-y-6">
                                                <label
                                                    htmlFor="evidence"
                                                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                                                >
                                                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                                                    <h3 className="font-semibold mb-1">Upload evidence (optional)</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Screenshots, chat exports, videos, audio, or documents.
                                                    </p>
                                                    <Button variant="secondary" size="sm">
                                                        Select Files
                                                    </Button>
                                                    <input
                                                        id="evidence"
                                                        type="file"
                                                        className="hidden"
                                                        multiple
                                                        onChange={handleFilesChange}
                                                    />
                                                </label>
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">Supported formats</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        JPG, PNG, MP4, MP3, PDF (Max 50MB per file)
                                                    </p>
                                                </div>
                                                {formData.files.length > 0 && (
                                                    <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                                                        <p className="font-medium mb-1">Selected files:</p>
                                                        <ul className="space-y-1">
                                                            {formData.files.map((file) => (
                                                                <li
                                                                    key={file.name}
                                                                    className="flex items-center justify-between"
                                                                >
                                                                    <span className="truncate max-w-[220px]">
                                                                        {file.name}
                                                                    </span>
                                                                    <span className="text-muted-foreground">
                                                                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className="space-y-6">
                                                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <span className="font-medium text-muted-foreground">Category:</span>
                                                        <span>{formData.category || 'Not specified'}</span>

                                                        <span className="font-medium text-muted-foreground">
                                                            Date &amp; time:
                                                        </span>
                                                        <span>{formData.date || 'Not specified'}</span>

                                                        <span className="font-medium text-muted-foreground">
                                                            Platform / location:
                                                        </span>
                                                        <span>{formData.location || 'Not specified'}</span>

                                                        <span className="font-medium text-muted-foreground">
                                                            Files attached:
                                                        </span>
                                                        <span>
                                                            {formData.files.length > 0
                                                                ? `${formData.files.length} file(s)`
                                                                : 'No files attached'}
                                                        </span>
                                                    </div>
                                                    <div className="pt-2 border-t">
                                                        <span className="font-medium text-muted-foreground text-sm block mb-1">
                                                            Description:
                                                        </span>
                                                        <p className="text-sm">
                                                            {formData.description || 'No description provided.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="anonymous"
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={formData.anonymous}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, anonymous: e.target.checked })
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="anonymous"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Submit anonymously
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>

                                {step < 3 ? (
                                    <Button onClick={handleNext} disabled={!canGoNext}>
                                        Next <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Report'} <Check className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
