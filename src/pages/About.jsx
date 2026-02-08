import { motion } from 'framer-motion';
import { Target, Users, ShieldCheck, Zap, Globe, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
    {
        title: 'Our Mission',
        icon: Target,
        desc: 'To bridge the gap between global opportunities and talented individuals by providing a decentralized, secure, and efficient micro-tasking ecosystem.',
        color: 'from-blue-400 to-blue-600'
    },
    {
        title: 'Community First',
        icon: Users,
        desc: 'We believe in the power of collective intelligence. Our platform is built specifically to empower workers and provide value to businesses.',
        color: 'from-purple-400 to-purple-600'
    },
    {
        title: 'Unmatched Security',
        icon: ShieldCheck,
        desc: 'Trust is our foundation. Using advanced verification systems and secure payment gateways, we ensure every transaction is protected.',
        color: 'from-brand-400 to-brand-600'
    }
];

export default function About() {
    return (
        <div className="pt-24 pb-16 px-4">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto text-center mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6"
                >
                    About TaskEarn
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight"
                >
                    Empowering the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-600">
                        Global Workforce
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
                >
                    TaskEarn is more than just a platform; it's a movement towards a more accessible,
                    decentralized, and rewarding future of work. We connect businesses needing micro-services
                    with individuals look to monetize their time and skills.
                </motion.p>
            </section>

            {/* Stats/Values Grid */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-32">
                {values.map((v, i) => (
                    <motion.div
                        key={v.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card hover:-translate-y-2 group"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform`}>
                            <v.icon size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{v.title}</h3>
                        <p className="text-slate-400 leading-relaxed text-lg">{v.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* Story Section */}
            <section className="max-w-5xl mx-auto mb-32 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-display font-bold text-white mb-6 italic tracking-tight">"Democratizing Micro-Services for Everyone, Everywhere."</h2>
                        <div className="space-y-4 text-slate-400 leading-relaxed">
                            <p>
                                Founded on the principles of transparency and efficiency, TaskEarn has grown from a simple idea
                                into a robust ecosystem serving thousands of active participants.
                            </p>
                            <p>
                                Whether you're a student looking to earn pocket money, a professional testing new applications,
                                or a business owner needing to scale operations, TaskEarn provides the tools and infrastructure
                                to make it happen.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {[
                            { label: 'Active Countries', value: '120+', icon: Globe },
                            { label: 'Verified Workers', value: '50K+', icon: Users },
                            { label: 'Instant Payouts', value: '24/7', icon: Zap },
                            { label: 'Support Rate', value: '99.9%', icon: MessageCircle }
                        ].map((stat, i) => (
                            <div key={i} className="glass p-6 rounded-2xl border-white/5 text-center">
                                <stat.icon className="text-brand-400 mx-auto mb-3" size={24} />
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Roles Section */}
            <section className="max-w-7xl mx-auto mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-bold text-white mb-4">Our Roles</h2>
                    <p className="text-slate-400">Different ways to participate in our growing ecosystem.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            role: 'Worker',
                            desc: 'Earn coins by completing micro-tasks like surveys, testing apps, and moderating content.',
                            icon: Zap,
                            color: 'text-brand-400'
                        },
                        {
                            role: 'Buyer',
                            desc: 'Post tasks and scale your business operations with high-quality, verified human output.',
                            icon: Target,
                            color: 'text-blue-400'
                        },
                        {
                            role: 'Admin',
                            desc: 'Oversees platform operations by managing user roles, addressing reports, and maintaining system integrity.',
                            icon: ShieldCheck,
                            color: 'text-purple-400'
                        }
                    ].map((r, i) => (
                        <motion.div
                            key={r.role}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-2xl border-white/5 text-center flex flex-col items-center"
                        >
                            <div className={`mb-6 ${r.color}`}>
                                <r.icon size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{r.role}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA section */}
            <section className="max-w-4xl mx-auto text-center">
                <div className="glass p-12 rounded-3xl border-brand-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-500/5 z-0" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-6">Want to be part of the future?</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="btn-primary px-8 py-3 w-full sm:w-auto">Join the Community</Link>
                            <Link to="/login" className="btn-secondary px-8 py-3 w-full sm:w-auto">Start Posting Tasks</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
