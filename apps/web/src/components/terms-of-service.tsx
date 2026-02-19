'use client';
import { Separator } from "./ui/separator";

export const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 font-poppins text-slate-800 leading-relaxed">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Terms and Conditions</h1>
                <div className="space-y-1">
                    <p className="text-xl font-bold">Viswa Vignana Vaaradhi</p>
                    <p className="text-sm text-muted-foreground italic">
                        Registered under the Andhra Pradesh Societies Registration Act, 2001
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm font-bold uppercase tracking-wider">Last Updated:</span>
                        <span className="text-sm font-medium text-slate-600">07th January, 2026</span>
                    </div>
                </div>
            </header>
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>1.</span> Introduction
                </h2>
                <div className="space-y-4">
                    <p>
                        These Terms and Conditions (“Terms”) govern your access to and use of the website, portals,
                        programs, and services (collectively, the “Platform”) operated by Viswa Vignana Vaaradhi
                        (“VVV,” “Organization,” “we,” “us,” or “our”).
                    </p>
                    <p>
                        By creating an account, logging in, donating, registering for programs, or using the Platform,
                        you confirm that:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-slate-700">
                        <li>You have read these Terms</li>
                        <li>You understand them</li>
                        <li>You agree to be legally bound by them</li>
                    </ul>
                    <p className="mb-4">
                        If you do not agree, you must not register, log in, or use the Platform. Our Privacy Policy forms an integral part of these Terms.
                    </p>
                </div>
            </section>

            <Separator className="my-8"/>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>2.</span> Legal Status
                </h2>
                <p className="mb-4">
                    Viswa Vignana Vaaradhi is a <span className="font-bold">non-profit, non-governmental organization</span> registered under
                    the <span className="font-bold">Andhra Pradesh Societies Registration Act, 2001</span>, working exclusively for public benefit.
                </p>
                <p>
                    These Terms do not create employment, agency, or partnership relationships between you
                    and the Organization.
                </p>
            </section>

            <Separator className="my-8"/>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>3.</span> Mission and Scope of Services
                </h2>
                <p className="mb-4">We operate programs in the following domains:</p>
                <ul className="list-none space-y-3 mb-6">
                    {[
                        { title: "MISSION MEDHA", desc: "Promoting quality education" },
                        { title: "NYAYA SADAN", desc: "Free legal consultation for marginalized and weaker sections" },
                        { title: "MISSION MANO SWASTHYA", desc: "Mental health support and drug de-addiction guidance" },
                        { title: "MISSION TRUPTI", desc: "Hunger and malnutrition relief activities" },
                        { title: "MISSION JEEVADHARA", desc: "Technology innovations supporting rural livelihood and agriculture" }
                    ].map((item, i) => (
                        <li key={i} className="flex gap-2 items-start">
                            <span className="font-bold text-sm px-2 py-1 rounded min-w-40 text-center">{item.title}:</span>
                            <span className="">{item.desc}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-muted-foreground">Programs, eligibility, timing, and availability may change at our discretion.</p>
            </section>

            <Separator className="my-8"/>

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>4.</span> Account Registration and Access
                </h2>
                
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">4.1 Account Creation</h3>
                    <p className="mb-3">By registering on the Platform, you agree to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 mb-3">
                        <li>Provide accurate and complete information</li>
                        <li>Keep your profile updated</li>
                        <li>Not impersonate another person or misrepresent identity</li>
                    </ul>
                    <p className="text-sm">We reserve the right to approve, refuse, or suspend accounts.</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">4.2 Login Security</h3>
                    <p className="mb-3">You are responsible for:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Maintaining the confidentiality of your login credentials</li>
                        <li>All activity under your account</li>
                        <li>Immediately notifying us of any unauthorized access</li>
                    </ul>
                </div>
            </section>

            <Separator className="my-8"/>
            
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>5.</span> Minors Using the Platform
                </h2>
                <div className="space-y-4">
                    <p>We conduct programs involving children and youth.</p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>Minors may participate only with parental/guardian consent.</li>
                        <li>The parent/guardian assumes full responsibility for accounts created for minors.</li>
                        <li>Parents/guardians consent to minor participation in programs and communications.</li>
                    </ul>
                    <p className="text-sm font-medium">We may request proof of age or consent when required.</p>
                </div>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>6.</span> Nature of Support — Important Disclaimers
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-4 border rounded-lg bg-slate-50/50">
                        <h3 className="font-bold mb-2">6.1 Education Programs</h3>
                        <p className="text-sm">Educational materials are for awareness and learning. We do not guarantee academic results, employment, or certification.</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50/50">
                        <h3 className="font-bold mb-2">6.2 Free Legal Consultation</h3>
                        <ul className="text-sm list-disc list-inside space-y-1">
                            <li>Preliminary and informational only</li>
                            <li>No advocate–client relationship created</li>
                            <li>Does not replace independent legal representation</li>
                        </ul>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50/50">
                        <h3 className="font-bold mb-2">6.3 Mental Health Support</h3>
                        <ul className="text-sm list-disc list-inside space-y-1">
                            <li>Not medical advice or psychiatric therapy</li>
                            <li>Does not diagnose or treat illness</li>
                            <li>In emergencies, contact a qualified doctor immediately</li>
                        </ul>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50/50">
                        <h3 className="font-bold mb-2">6.4 Hunger Relief & Tech</h3>
                        <p className="text-sm">Assistance depends on resources and logistics. Tech programs do not guarantee income or commercial results.</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50/50">
                        <h3 className="font-bold mb-2">6.5 Technology and Rural Innovation</h3>
                        <p className="text-sm">
                            Programs involving technology demonstrations or advisory services do not guarantee
                            income, funding, or commercial results.
                        </p>
                    </div>
                </div>
            </section>

            <Separator className="my-8" />

            {/* Section 7 */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>7.</span> Acceptable Use
                </h2>
                <div className="space-y-4">
                    <p>You agree not to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Violate law or public policy</li>
                        <li>Upload harmful, abusive, or defamatory material</li>
                        <li>Interfere with Platform operations</li>
                        <li>Misuse organizational identity or resources</li>
                        <li>Collect or misuse personal information of others</li>
                    </ul>
                    <p className="text-sm">Violations may result in immediate account suspension or termination.</p>
                </div>
            </section>

            <Separator className="my-8"/>

            {/* Section 8 */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>8.</span> Donations and Online Payments
                </h2>
                <div className="space-y-4">
                    <p>Where donations are made through the Platform:</p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>Donations are voluntary and generally <span className="font-semibold">non-refundable</span>, except where legally required.</li>
                        <li>Receipts will be issued as per applicable Indian tax regulations.</li>
                        <li>Any tax exemption applies only if permitted by law and subject to official approvals.</li>
                        <li>Payments are processed by secure third-party gateways.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">We are not responsible for failures, delays, or breaches attributable to third-party payment systems.</p>
                </div>
            </section>

            <Separator className="my-8"/>

            {/* Section 9 & 10 */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>9.</span> Intellectual Property
                </h2>
                <p className="">
                    All content, branding, and educational resources belong to the Organization. 
                    Reproduction or distribution without written permission is prohibited, except for personal, non-commercial use.
                </p>
            </section>

            <Separator className="my-8"/>
                
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>10.</span> User Content
                </h2>
                <div>
                    By sharing testimonials or photos, you grant us a royalty-free license to use such content for awareness. You confirm you have the right to share this material.
                </div>
            </section>

            <Separator className="my-8"/>

            {/* Section 11, 12, 13 */}
            <section className="space-y-6 mb-8">
                <h2 className="text-xl font-bold mb-4">11. Third-Party Websites</h2>
                <div>We may provide references, links, or collaborations with other organizations. We do not control their content, policies, or practices, and we disclaim liability for third-party services.</div>
            </section>
            
            <Separator className="my-8"/>

            <section className="space-y-6 mb-8">
                <h2 className="text-xl font-bold mb-4">12. Privacy and Data Protection</h2>
                <div>Personal data is processed according to our <span className="font-semibold underline cursor-pointer">Privacy Policy</span> and applicable Indian laws.</div>
                <div>Please avoid sharing sensitive personal information unless necessary and submitted through secure channels.</div>
            </section>

            <Separator className="my-8"/>
            
            <section className="space-y-6 mb-8">
                <h2 className="text-xl font-bold mb-4">13. Volunteers & Participation</h2>
                <div>Participation in programs may require verification, declarations, consent letters, or orientation.</div>
                <div>We may refuse or discontinue participation if safety, ethical, or legal concerns arise.</div>
            </section>

            <Separator className="my-8"/>

            {/* Section 14 & 15: Legal Disclaimers */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">14. Limitation of Liability & Indemnity</h2>
                <div className="mb-4">
                    <p className="mb-4">To the fullest extent permitted by Indian law, Viswa Vignana Vaaradhi is not liable for indirect damages, loss of data, or reliance on advisory guidance.</p>
                    <p>You agree to indemnify the Organization, its trustees, and volunteers from claims arising from your misuse of the Platform or breach of these Terms.</p>
                </div>
                <p className="mb-4">Your sole remedy is to discontinue using the Platform.</p>
            </section>

            <Separator className="my-8"/>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">15. Indemnification</h2>
                <p className="mb-4">
                    You agree to indemnify and hold harmless the Organization, trustees, officers, volunteers, and
                    staff from claims arising due to:
                </p>

                <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>misuse of the Platform or Services</li>
                    <li>breach of these Terms</li>
                    <li>violation of applicable law</li>
                </ul>
            </section>

            {/* Section 16, 17, 18 */}
            <Separator className="my-8"/>

            <section className="mb-8">
                <h3 className="font-bold mb-2">16. Suspension or Termination</h3>
                <p>We may suspend access for violations or suspected fraud or required under law.</p>
            </section>

            <Separator className="my-8"/>

            <section className="mb-8">
                <h3 className="font-bold mb-2">17. Amendments</h3>
                <p>We may modify these Terms at any time. Continued use after changes means acceptance of the revised Terms.</p>
            </section>

            <Separator className="my-8"/>

            <section className="mb-8">
                <h3 className="font-bold mb-2">18. Governing Law and Jurisdiction</h3>
                    <p>These Terms are governed by the laws of <span className="font-semibold">India</span>including relevant provisions of the <span className="font-semibold">Andhra Pradesh Societies Registration Act, 2001.</span></p>
                    <p>You agree to the exclusive jurisdiction of competent courts in Andhra Pradesh, India.</p>
            </section>

            <Separator className="my-8"/>

            {/* Section 19: Contact Card */}
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
                            <a href="mailto:viswavignanavaaradi@gmail.com" className="text-blue-600 hover:underline font-medium">
                                viswavignanavaaradi@gmail.com
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
    );
};
