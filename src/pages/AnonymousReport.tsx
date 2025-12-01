import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Upload, ArrowRight, ArrowLeft, MapPin, AlertTriangle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function AnonymousReport() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        location: '',
        date: '',
        files: [] as File[],
    });
    const navigate = useNavigate();
    useTranslation();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const steps = [
        { id: 1, title: 'Incident Details', icon: AlertTriangle },
        { id: 2, title: 'Evidence Upload', icon: Upload },
        { id: 3, title: 'Confirmation', icon: Check },
    ];

    return (
        <div className="container relative py-10 max-w-5xl min-h-screen flex flex-col justify-center">
            <div className="absolute top-4 right-4 flex gap-2">
                <LanguageSwitcher />
                <ModeToggle />
            </div>

            <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">Anonymous Reporting</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Your safety and privacy are our top priority. This report will be submitted securely and anonymously.
                    No personal identifiable information will be recorded unless you explicitly provide it.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar Progress */}
                <div className="md:col-span-4 lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        {steps.map((s) => (
                            <div
                                key={s.id}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${step === s.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                            >
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step === s.id ? 'border-primary bg-primary text-primary-foreground' : step > s.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                                    {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                                </div>
                                <div className="font-medium">{s.title}</div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Button>
                </div>

                {/* Form Area */}
                <div className="md:col-span-8 lg:col-span-9">
                    <Card className="border-none shadow-lg">
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
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Select
                                                    value={formData.category}
                                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                                                <Label>Date & Time</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Location / Platform</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        placeholder="e.g. Instagram, Facebook, or physical location"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    placeholder="Describe what happened..."
                                                    className="min-h-[150px]"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-6">
                                            <div className="border-2 border-dashed rounded-lg p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="font-semibold mb-1">Drag & drop files here</h3>
                                                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                                                <Button variant="secondary" size="sm">Select Files</Button>
                                                <input type="file" className="hidden" multiple />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium">Supported formats</h4>
                                                <p className="text-xs text-muted-foreground">JPG, PNG, MP4, MP3, PDF (Max 50MB)</p>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-6">
                                            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <span className="font-medium text-muted-foreground">Category:</span>
                                                    <span>{formData.category || 'Not specified'}</span>

                                                    <span className="font-medium text-muted-foreground">Date:</span>
                                                    <span>{formData.date || 'Not specified'}</span>

                                                    <span className="font-medium text-muted-foreground">Platform:</span>
                                                    <span>{formData.location || 'Not specified'}</span>
                                                </div>
                                                <div className="pt-2 border-t">
                                                    <span className="font-medium text-muted-foreground text-sm block mb-1">Description:</span>
                                                    <p className="text-sm">{formData.description || 'No description provided.'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg border border-yellow-500/20">
                                                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                                <p className="text-sm">
                                                    By submitting this report, you confirm that the information provided is true to the best of your knowledge.
                                                    Since this is an anonymous report, we will not be able to contact you for follow-up unless you provide contact details in the description.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={step === 1}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>

                            {step < 3 ? (
                                <Button onClick={handleNext}>
                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                                    // Mock submission
                                    alert("Report submitted anonymously!");
                                    navigate('/login');
                                }}>
                                    Submit Anonymous Report <Check className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
