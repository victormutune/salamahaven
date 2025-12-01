import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">Terms of Service</h1>
            <Card>
                <CardContent className="prose dark:prose-invert max-w-none pt-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Agreement to Terms</h3>
                    <p>
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and SalamaHaven ("we", "us", or "our"), concerning your access to and use of the SalamaHaven website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                    </p>

                    <h3>2. Intellectual Property Rights</h3>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>

                    <h3>3. User Representations</h3>
                    <p>
                        By using the Site, you represent and warrant that:
                    </p>
                    <ul>
                        <li>All registration information you submit will be true, accurate, current, and complete.</li>
                        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                        <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                    </ul>

                    <h3>4. Prohibited Activities</h3>
                    <p>
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>

                    <h3>5. User Generated Contributions</h3>
                    <p>
                        The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions").
                    </p>

                    <h3>6. Site Management</h3>
                    <p>
                        We reserve the right, but not the obligation, to:
                    </p>
                    <ul>
                        <li>Monitor the Site for violations of these Terms of Service.</li>
                        <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Service.</li>
                        <li>Refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof.</li>
                    </ul>

                    <h3>7. Modifications and Interruptions</h3>
                    <p>
                        We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
                    </p>

                    <h3>8. Contact Us</h3>
                    <p>
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@salamahaven.org.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
