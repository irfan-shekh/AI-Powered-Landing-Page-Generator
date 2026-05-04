"use client";

import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import {
    Sparkles,
    Zap,
    Palette,
    LayoutTemplate,
    FolderOpen,
    X,
    Send,
    Layout,
    ArrowRight,
    CheckCircle2,
    Globe,
    MousePointer2,
    Layers,
    MessageSquare,
    BarChart3,
    Rocket
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();

    const [showNameModal, setShowNameModal] = useState(false);
    const [projectName, setProjectName] = useState("");
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showNameModal) {
            nameInputRef.current?.focus();
        }
    }, [showNameModal]);

    const handleGenerateClick = () => {
        if (!session) {
            toast.error('Please sign in to continue');
            router.push('/login');
        } else {
            setShowNameModal(true);
        }
    };

    const confirmAndNavigate = () => {
        if (!projectName.trim()) return;
        const slug = projectName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        router.push(`/generate?name=${slug}`);
    };

    const handleDashboardClick = () => {
        if (!session) {
            toast.error('Please sign in to access the dashboard');
            router.push('/login');
        } else {
            router.push('/dashboard');
        }
    };

    const handleClose = () => {
        if (projectName.trim()) {
            if (!confirm("Discard project name?")) return;
        }
        setShowNameModal(false);
    };

    return (
        <div className="bg-[#0a0a0f] text-slate-200 selection:bg-indigo-500/30">
            {/* ── HERO SECTION ── */}
            <section className="relative pt-20 pb-32 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/15 rounded-full blur-[100px] animate-pulse delay-700" />
                </div>

                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Revolutionizing Design with AI</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]"
                        >
                            Generate Stunning <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Landing Pages
                            </span> in Seconds
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            Stop spending weeks on design and copy. Describe your vision and let PageAI build a high-converting, professional landing page tailored to your brand.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button
                                onClick={handleGenerateClick}
                                className="group relative w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Start Generating Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={handleDashboardClick}
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all backdrop-blur-sm active:scale-95"
                            >
                                View Dashboard
                            </button>
                        </motion.div>
                    </div>

                    {/* Preview Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-20 relative max-w-5xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10" />
                        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-indigo-500/10">
                            <img
                                src="https://picsum.photos/id/180/1200/800"
                                alt="Dashboard Preview"
                                className="w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── TRUST SECTION ── */}
            <section className="py-20 border-b border-white/5">
                <div className="container mx-auto px-6">
                    <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-widest mb-12">
                        Trusted by innovators at
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all">
                        {['TECHFLOW', 'LUMINA', 'VERTIKA', 'NOVA', 'ORBIT'].map(logo => (
                            <span key={logo} className="text-2xl font-black text-white tracking-tighter">{logo}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES SECTION ── */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for Speed, <br className="md:hidden" /> Designed for Results</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Our AI doesn't just generate text; it crafts a complete user experience designed to convert visitors into customers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                                title: "Instant Generation",
                                desc: "Get a full landing page with copy, layout, and styling in under 10 seconds. No more writer's block.",
                                color: "yellow"
                            },
                            {
                                icon: <Palette className="w-6 h-6 text-pink-400" />,
                                title: "Adaptive Styling",
                                desc: "Choose your brand's tone and color palette, and PageAI creates a cohesive, modern visual language.",
                                color: "pink"
                            },
                            {
                                icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
                                title: "Conversion Optimized",
                                desc: "Every element is placed strategically to guide users towards your call-to-action efficiently.",
                                color: "emerald"
                            },
                            {
                                icon: <Globe className="w-6 h-6 text-blue-400" />,
                                title: "Global Deployment",
                                desc: "Your landing pages are fully responsive and look stunning on any device, from mobile to desktop.",
                                color: "blue"
                            },
                            {
                                icon: <Layers className="w-6 h-6 text-indigo-400" />,
                                title: "Structured Layouts",
                                desc: "Modular sections allow you to customize the flow of your page to match your specific business model.",
                                color: "indigo"
                            },
                            {
                                icon: <Rocket className="w-6 h-6 text-purple-400" />,
                                title: "Live Preview",
                                desc: "See your page come to life in real-time as the AI generates each section of your new site.",
                                color: "purple"
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-32 bg-white/[0.02] border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">From Idea to Live <br /> in Three Simple Steps</h2>
                            <div className="space-y-10">
                                {[
                                    { step: "01", title: "Describe Your Vision", desc: "Just tell us what you're building. Mention your industry, target audience, and key benefits." },
                                    { step: "02", title: "AI Generation", desc: "Our Gemini-powered engine writes high-converting copy and designs a custom layout for you." },
                                    { step: "03", title: "Refine & Launch", desc: "Tweak the results, change themes, and deploy your page to the world instantly." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6">
                                        <span className="text-4xl font-black text-indigo-600/30">{item.step}</span>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                            <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-full" />
                            <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                                <img
                                    src="https://picsum.photos/id/48/800/600"
                                    alt="Process Illustration"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Loved by Founders</h2>
                        <p className="text-slate-400">Join 5,000+ creators building the future with PageAI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Jenkins", role: "SaaS Founder", text: "PageAI saved me literally weeks of back-and-forth with designers. The quality of the first draft was better than what I usually pay $2k for." },
                            { name: "Marcus Chen", role: "Indie Hacker", text: "I can now test 5 different product ideas in a single afternoon. This is a total game-changer for lean validation." },
                            { name: "Elena Rodriguez", role: "Marketing Director", text: "The copy generation is surprisingly good. It understands the emotional triggers of my audience perfectly." }
                        ].map((t, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative">
                                <MessageSquare className="absolute top-8 right-8 w-6 h-6 text-indigo-500/20" />
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                                    <div>
                                        <h4 className="text-white font-bold">{t.name}</h4>
                                        <p className="text-slate-500 text-xs uppercase tracking-tighter">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 italic">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING SECTION ── */}
            <section className="py-32 bg-indigo-600/5 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Pricing for Every Stage</h2>
                        <p className="text-slate-400">Start for free, upgrade as you grow.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-10 rounded-3xl bg-[#0d111a] border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">$0</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10">
                                {["3 Generations / mo", "Standard AI Engine", "Community Support", "Basic Layouts"].map(feat => (
                                    <li key={feat} className="flex items-center gap-3 text-slate-400 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all">Get Started</button>
                        </div>

                        <div className="p-10 rounded-3xl bg-indigo-600 border border-indigo-400 shadow-2xl shadow-indigo-600/40 relative overflow-hidden">
                            <div className="absolute top-4 right-4 bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Popular</div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">$29</span>
                                <span className="text-indigo-200">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10">
                                {["Unlimited Generations", "Gemini Ultra Engine", "Priority Support", "Custom Domains", "Advanced Analytics"].map(feat => (
                                    <li key={feat} className="flex items-center gap-3 text-white text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-white" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20">Upgrade to Pro</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">Ready to launch your <br /> next big thing?</h2>
                        <p className="text-indigo-100 mb-12 max-w-xl mx-auto text-lg relative z-10">Join thousands of entrepreneurs who have built their online presence in minutes, not weeks.</p>

                        <button
                            onClick={handleGenerateClick}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-900/40 active:scale-95 relative z-10"
                        >
                            <Sparkles className="w-6 h-6" />
                            Build Your Landing Page
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="py-20 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white tracking-tighter">PageAI</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">Making landing page creation as simple as a single sentence. Powered by advanced AI.</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
                            <div>
                                <h5 className="text-white font-bold mb-6 text-sm">Product</h5>
                                <ul className="space-y-4 text-slate-500 text-sm">
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Examples</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-white font-bold mb-6 text-sm">Company</h5>
                                <ul className="space-y-4 text-slate-500 text-sm">
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                                </ul>
                            </div>
                            <div className="hidden sm:block">
                                <h5 className="text-white font-bold mb-6 text-sm">Social</h5>
                                <ul className="space-y-4 text-slate-500 text-sm">
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a></li>
                                    <li><a href="https://www.linkedin.com/in/Irfan-shekh" className="hover:text-indigo-400 transition-colors">LinkedIn</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-600 text-xs">
                        <p>© 2026 PageAI Inc. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-400">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ✅ MODAL COMPONENT (Preserved Logic) */}
            <AnimatePresence>
                {showNameModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md mx-4 rounded-[2.5rem] border border-white/10 bg-[#0d1526] p-10 shadow-2xl pointer-events-auto"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500/20 rounded-2xl">
                                            <FolderOpen className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <h2 className="text-2xl text-white font-bold tracking-tight">New Project</h2>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Project Name</label>
                                    <input
                                        ref={nameInputRef}
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && projectName.trim()) {
                                                confirmAndNavigate();
                                            }
                                        }}
                                        placeholder="e.g. Acme SaaS"
                                        className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 mt-10">
                                    <button
                                        onClick={confirmAndNavigate}
                                        disabled={!projectName.trim()}
                                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 rounded-2xl text-base font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
                                    >
                                        <Send className="w-5 h-5" />
                                        Create & Continue
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="w-full px-8 py-4 text-sm font-semibold text-slate-500 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}