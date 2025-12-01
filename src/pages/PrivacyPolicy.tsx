import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">Privacy Policy</h1>
            <Card>
                <CardContent className="prose dark:prose-invert max-w-none pt-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Introduction</h3>
                    <p>
                        SalamaHaven ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
                    </p>

                    <h3>2. Information We Collect</h3>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>

                    <h3>3. Use of Your Information</h3>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>Compile anonymous statistical data and analysis for use internally.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Enable user-to-user communications.</li>
                        <li>Respond to product and customer service requests.</li>
                    </ul>

                    <h3>4. Disclosure of Your Information</h3>
                    <p>
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                    <ul>
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                    </ul>

                    <h3>5. Security of Your Information</h3>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at support@salamahaven.org.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
