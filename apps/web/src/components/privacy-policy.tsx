import { Separator } from "@base-ui/react"

export const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 font-poppins text-slate-800 leading-relaxed">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
                <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm font-bold uppercase tracking-wider">Last Updated:</span>
                    <span className="text-sm font-medium text-slate-600">07th January, 2026</span>
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        This Policy explains how we collect, use, store, and protect information.
                    </p>
                </div>
            </header>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>1.</span> Information We Collect
                </h2>
                <div className="space-y-4 mb-4">
                    <p>We may collect:</p>
                    <h3 className="text-lg font-semibold mb-2">1.1 Information provided by you</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Name, age, gender (optional)</li>
                        <li>Email, phone, address</li>
                        <li>Login credentials (encrypted)</li>
                        <li>Donation details (amount, date, reference)</li>
                        <li>Program registration information</li>
                        <li>Parent/guardian consent information</li>
                        <li>Feedback, communications, and forms submitted</li>
                    </ul>
                </div>

                <div className="space-y-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2">1.2 Sensitive or Special Categories (where applicable)</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Identification documents (if required by law)</li>
                        <li>Health or wellness-related details voluntarily provided during programs</li>
                        <li>Legal consultation details voluntarily shared</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">We collect such data <span className="font-semibold">only when necessary</span>, and with consent where required.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2">1.3 Automatically Collected Data</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>IP address</li>
                        <li>Device information</li>
                        <li>Browser type</li>
                        <li>Cookies and analytics data</li>
                        <li>Usage logs</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">Cookies help improve site performance and personalization. Users may disable cookies in browser settings, which may limit functionality.</p>
                </div>
            </section>

                <Separator className="my-8"/>

                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>2.</span> How We Use Information
                </h2>

                <div className="space-y-4">
                    <p>We may use the information we collect for:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Register user accounts and manage access</li>
                        <li>Facilitate program participation</li>
                        <li>Provide educational, legal advisory, and wellness services</li>
                        <li>Process and acknowledge donations</li>
                        <li>Issue receipts and statutory filings</li>
                        <li>Communicate updates, reports, and fundraising appeals</li>
                        <li>Perform audits, security, and fraud prevention</li>
                        <li>Comply with laws and regulations</li>
                        <li>Improve services, research, and program design (anonymized where possible)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">We do not sell personal data.</p>
                </div>
                </section>

                <Separator className="my-8"/>
                
                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>3.</span> Data Sharing and Disclosure
                </h2>

                <div className="space-y-4">
                    <p>We may share information with:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Authorized staff, volunteers, and program partners on a need-to-know basis</li>
                        <li>Payment gateway providers for processing donations</li>
                        <li>Government authorities when legally required</li>
                        <li>Auditors, legal advisors, and compliance authorities</li>
                        <li>Technology service providers supporting our systems</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">We require third parties to follow confidentiality and data-protection obligations.</p>
                    <p className="text-sm text-muted-foreground">We do not share personal data for marketing by third parties.</p>
                </div>
                </section>

                <Separator className="my-8"/>

                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>4.</span> Minors Data
                </h2>

                <div className="space-y-4">
                    <p>We do not knowingly collect data directly from minors without guardian consent.</p>
                    <p className="text-sm text-muted-foreground">Parents/guardians may:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Request to review collected data</li>
                        <li>Request deletion where appropriate</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">We may refuse deletion requests when required to retain data by law.</p>
                </div>
                </section>

                <Separator className="my-8"/>

                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>5.</span> Legal Basis (India)
                </h2>

                <div className="space-y-4">
                    <p>Processing may occur based on:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Consent of the data subject</li>
                        <li>Performance of legitimate non-profit activities</li>
                        <li>Compliance with legal obligations</li>
                        <li>Protection of vital interests in emergencies</li>
                        <li>Public interest and reporting obligations</li>
                    </ul>
                </div>
                </section>

                <Separator className="my-8"/>

                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>6.</span> Data Security
                </h2>

                <div className="space-y-4">
                    <p>We implement reasonable administrative, technical, and organizational safeguards including:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Encryption of sensitive data</li>
                        <li>Access controls and authentication</li>
                        <li>Secure payment gateways</li>
                        <li>Limited data retention policies</li>
                        <li>Staff confidentiality obligations</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">However, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.</p>
                </div>
                </section>

                <Separator className="my-8"/>
                
                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>7.</span> Data Retention
                </h2>

                <div className="space-y-4">
                    <p>We retain data:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                       <li>As long as necessary for stated purposes,</li> 
                       <li>As mandated by income-tax, FCRA (if applicable), accounting, audit, or legal requirements.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">Data no longer required is securely deleted or anonymized.</p>
                </div>
                </section>

                <Separator className="my-8"/>
                
                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>8.</span> Your Rights
                </h2>

                <div className="space-y-4">
                    <p>Subject to applicable law, users may:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Access their personal information</li>
                        <li>Request corrections or updates</li>
                        <li>Withdraw consent (where applicable)</li>
                        <li>Request deletion, subject to retention laws</li>
                        <li>Opt-out of communications</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">Requests may be submitted via email below, and we may require identity verification.</p>
                </div>
                </section>

                <Separator className="my-8"/>

                <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>9.</span> Third-Party Websites
                </h2>

                <div className="space-y-4">
                    <p>Our website may link to external sites. Their privacy practices are not controlled by VVV. Users should review third-party policies before sharing information.</p>
                </div>
                </section>

                <Separator className="my-8"/>

                <section className="mb-8">
                    <h3 className="font-bold mb-2">
                        <span>10.</span> Changes to This Policy
                    </h3>
                    <div className="space-y-4">
                        We may update this Policy periodically. Continued use constitutes acceptance of changes.
                    </div>
                </section>

                <Separator className="my-8"/>

                <section className="bg-slate-50 border border-slate-200 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6">19. Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-lg">Viswa Vignana Vaaradhi</p>
                                <p className="text-xs text-muted-foreground leading-tight mt-1">
                                    Registered under the Andhra Pradesh Societies <br/> Registration Act, 2001
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Office Address</p>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    14-15-171 /17/SF-1/YEGUVAPETA VEEDI<br/>
                                    WARD NO-1/Bakkanpalem/VISAKHAPATNAM/<br/>
                                    Andhra Pradesh - 531163
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Email Support</p>
                                <a href="mailto:contact@viswavignanavaardhi.org" className="text-blue-600 hover:underline font-medium">
                                    contact@viswavignanavaardhi.org
                                </a>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Phone</p>
                                <p className="font-medium text-slate-700">+91 94405 83595</p>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
    )
}