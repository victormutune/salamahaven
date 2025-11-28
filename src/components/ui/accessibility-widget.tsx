import { useState } from 'react';
import { Accessibility, X, ZoomIn, ZoomOut, Eye, Contrast, Type, MousePointer, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [highlightLinks, setHighlightLinks] = useState(false);
    const [largeCursor, setLargeCursor] = useState(false);
    const [screenReader, setScreenReader] = useState(false);

    const increaseFontSize = () => {
        const newSize = Math.min(fontSize + 10, 150);
        setFontSize(newSize);
        document.documentElement.style.fontSize = `${newSize}%`;
    };

    const decreaseFontSize = () => {
        const newSize = Math.max(fontSize - 10, 80);
        setFontSize(newSize);
        document.documentElement.style.fontSize = `${newSize}%`;
    };

    const resetFontSize = () => {
        setFontSize(100);
        document.documentElement.style.fontSize = '100%';
    };

    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
        if (!highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    };

    const toggleLargeText = () => {
        setLargeText(!largeText);
        if (!largeText) {
            document.documentElement.classList.add('large-text');
        } else {
            document.documentElement.classList.remove('large-text');
        }
    };

    const toggleHighlightLinks = () => {
        setHighlightLinks(!highlightLinks);
        if (!highlightLinks) {
            document.documentElement.classList.add('highlight-links');
        } else {
            document.documentElement.classList.remove('highlight-links');
        }
    };

    const toggleLargeCursor = () => {
        setLargeCursor(!largeCursor);
        if (!largeCursor) {
            document.documentElement.classList.add('large-cursor');
        } else {
            document.documentElement.classList.remove('large-cursor');
        }
    };

    const toggleScreenReader = () => {
        if (!screenReader) {
            // Enable screen reader mode
            setScreenReader(true);
            document.documentElement.classList.add('screen-reader-mode');
            // Add click listeners to read text
            document.addEventListener('click', handleScreenReaderClick);
            // Announce activation
            speak('Screen reader activated. Click on any text to hear it read aloud.');
        } else {
            // Disable screen reader mode - STOP ALL SPEECH IMMEDIATELY
            stopSpeaking();
            setScreenReader(false);
            document.documentElement.classList.remove('screen-reader-mode');
            document.removeEventListener('click', handleScreenReaderClick);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            // Multiple methods to ensure speech stops
            window.speechSynthesis.pause();
            window.speechSynthesis.cancel();
            // Force clear the queue
            setTimeout(() => {
                window.speechSynthesis.cancel();
            }, 0);
        }
    };

    const handleScreenReaderClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const text = target.innerText || target.textContent;
        if (text && text.trim()) {
            speak(text);
        }
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const resetAll = () => {
        stopSpeaking();
        setFontSize(100);
        setHighContrast(false);
        setLargeText(false);
        setHighlightLinks(false);
        setLargeCursor(false);
        setScreenReader(false);
        document.documentElement.style.fontSize = '100%';
        document.documentElement.classList.remove('high-contrast', 'large-text', 'highlight-links', 'large-cursor', 'screen-reader-mode');
        document.removeEventListener('click', handleScreenReaderClick);
    };

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-8 left-4 z-50">
                <Button
                    size="lg"
                    className="rounded-full h-8 w-8 shadow-2xl bg-blue-600 hover:bg-blue-700 text-white p-0"
                    onClick={() => setIsOpen(!isOpen)}
                    title="Accessibility Options"
                >
                    {/* Universal Accessibility Icon (Person with arms spread) */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6"
                    >
                        <circle cx="12" cy="4" r="2" />
                        <path d="M15.5 7H8.5c-.28 0-.5.22-.5.5s.22.5.5.5h7c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" />
                        <path d="M10 22c-.55 0-1-.45-1-1v-6H7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H9V9.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5V14h1.5c.28 0 .5.22.5.5s-.22.5-.5.5H15v6c0 .55-.45 1-1 1s-1-.45-1-1v-6h-2v6c0 .55-.45 1-1 1z" />
                    </svg>
                </Button>
            </div>

            {/* Accessibility Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <Card className="fixed bottom-36 left-4 z-50 w-80 shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Accessibility className="h-6 w-6 text-blue-600" />
                                Accessibility
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Font Size Controls */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Type className="h-4 w-4" />
                                    Text Size: {fontSize}%
                                </label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={decreaseFontSize}
                                        disabled={fontSize <= 80}
                                    >
                                        <ZoomOut className="h-6 w-6" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetFontSize}
                                        className="flex-1"
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={increaseFontSize}
                                        disabled={fontSize >= 150}
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Toggle Options */}
                            <div className="space-y-2">
                                <Button
                                    variant={highContrast ? "default" : "outline"}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={toggleHighContrast}
                                >
                                    <Contrast className="h-4 w-4 mr-2" />
                                    High Contrast
                                </Button>

                                <Button
                                    variant={largeText ? "default" : "outline"}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={toggleLargeText}
                                >
                                    <Type className="h-4 w-4 mr-2" />
                                    Large Text
                                </Button>

                                <Button
                                    variant={highlightLinks ? "default" : "outline"}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={toggleHighlightLinks}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Highlight Links
                                </Button>

                                <Button
                                    variant={largeCursor ? "default" : "outline"}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={toggleLargeCursor}
                                >
                                    <MousePointer className="h-4 w-4 mr-2" />
                                    Large Cursor
                                </Button>

                                <Button
                                    variant={screenReader ? "default" : "outline"}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={toggleScreenReader}
                                >
                                    {screenReader ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                                    Screen Reader
                                </Button>
                            </div>

                            {/* Reset All */}
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                onClick={resetAll}
                            >
                                Reset All Settings
                            </Button>
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    );
}
