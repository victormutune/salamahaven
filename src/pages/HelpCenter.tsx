import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpCenter() {
    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">Help Center</h1>
            <p className="text-center text-muted-foreground mb-8">
                Find answers to common questions about using SalamaHaven.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <details className="group border rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-foreground">
                            <h3 className="text-lg font-medium">How do I report an incident?</h3>
                            <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            You can report an incident by clicking on the "Report" tab in the navigation menu. You can choose to report anonymously or while logged in.
                        </p>
                    </details>

                    <details className="group border rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-foreground">
                            <h3 className="text-lg font-medium">Is my report anonymous?</h3>
                            <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            Yes, if you choose the "Anonymous Report" option, no personal information will be linked to your report unless you voluntarily provide it.
                        </p>
                    </details>

                    <details className="group border rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-foreground">
                            <h3 className="text-lg font-medium">How can I contact a counselor?</h3>
                            <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            Navigate to the "Counselors" page to view a list of available professionals. You can view their profiles and contact details there.
                        </p>
                    </details>

                    <details className="group border rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-foreground">
                            <h3 className="text-lg font-medium">What should I do in an emergency?</h3>
                            <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            If you are in immediate danger, please call 1195 (in Kenya) or your local emergency number immediately. You can also visit our Emergency page for quick resources.
                        </p>
                    </details>
                </CardContent>
            </Card>
        </div>
    );
}
