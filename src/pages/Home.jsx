import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import api from '../lib/api.js';
import { ArrowRight, Star, Shield, Zap, TrendingUp, Users, DollarSign, CheckCircle2, MessageCircle, BarChart3, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const features = [
  { title: 'Instant Earnings', icon: Zap, desc: 'Complete tasks and see your balance grow immediately.' },
  { title: 'Secure Payments', icon: Shield, desc: 'withdraw your earnings safely via Stripe or Crypto.' },
  { title: 'Growing Community', icon: Users, desc: 'Join thousands of workers and buyers worldwide.' },
];

const testimonials = [
  { name: 'Sarah J.', role: 'Worker', quote: 'TaskEarn helped me pay off my student loans. The tasks are easy and payments are instant.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Michael C.', role: 'Buyer', quote: 'I get quality work done for my business at a fraction of the cost. Highly recommended!', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Jessica L.', role: 'Worker', quote: 'Love the platform design and how easy it is to find tasks that match my skills.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'David R.', role: 'Buyer', quote: 'The best micro-task platform I have used. Great support and user-friendly interface.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
];

const statsData = [
  { label: 'Total Users', value: '50K+', icon: Users },
  { label: 'Tasks Completed', value: '1.2M+', icon: CheckCircle2 },
  { label: 'Total Paid Out', value: '$500K+', icon: DollarSign },
  { label: 'Active Countries', value: '120+', icon: BarChart3 },
];

const faqs = [
  { question: 'How do I earn money?', answer: 'Simply sign up as a worker, browse available tasks, complete them according to instructions, and get paid once approved.' },
  { question: 'Is there a fee to withdraw?', answer: 'We charge a small 5% processing fee on withdrawals to cover payment gateway costs.' },
  { question: 'How do I post a task?', answer: 'Register as a buyer, deposit coins, and use the "Add Task" form to describe your requirements and set a budget.' },
  { question: 'What is the minimum withdrawal?', answer: 'The minimum withdrawal amount is 200 coins, which is equivalent to $10. (20 coins = $1)' },
];

export default function Home() {
  const [topWorkers, setTopWorkers] = useState([]);

  useEffect(() => {
    api.get('/users/top-workers').then(({ data }) => setTopWorkers(data)).catch(() => setTopWorkers([]));
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Star size={16} className="text-brand-400 fill-brand-400" />
            <span className="text-sm font-medium text-brand-100">The #1 Micro-Task Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-tight"
          >
            Earn Crypto & Cash <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-600">
              Doing Micro Tasks
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join the decentralized workforce. Complete simple online tasks like surveys, app testing, and content moderation to earn real rewards instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="btn-primary flex items-center gap-2 group text-lg px-8 py-4"
            >
              Start Earning Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
            >
              Post a Task
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card hover:-translate-y-2"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-6">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Workers Swiper */}
      <section className="py-24 bg-dark-900/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-transparent to-dark-950 z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-brand-400 font-bold mb-4"
          >
            <TrendingUp size={20} />
            <span>Leaderboard</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Top Performers</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Meet our most active and highest-earning workers of the week.</p>
        </div>

        <div className="relative z-10 px-4">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            initialSlide={2}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 300,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="w-full py-12"
          >
            {(topWorkers.length ? topWorkers : Array(6).fill(null)).map((w, i) => (
              <SwiperSlide key={i} className="!w-[300px] md:!w-[350px]">
                <div className="glass-card p-8 flex flex-col items-center text-center h-full border-brand-500/20 bg-dark-950/60 backdrop-blur-xl">
                  <div className="relative mb-6">
                    <img
                      src={w?.photoURL || `https://ui-avatars.com/api/?name=User&background=random`}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover border-4 border-dark-950 shadow-2xl"
                    />
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-dark-950 font-bold text-sm ring-4 ring-dark-950">
                      #{i + 1}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2 truncate w-full">{w?.name || 'Top Worker'}</h3>
                  <div className="flex items-center gap-2 text-brand-400 font-bold bg-brand-500/10 px-4 py-2 rounded-full mb-4">
                    <DollarSign size={16} />
                    <span>{w?.coin ?? 0} Coins</span>
                  </div>
                  <p className="text-slate-400 text-sm">Consistent performer with high accuracy rating.</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-2xl text-center border-brand-500/10 hover:border-brand-500/30 transition-all"
            >
              <div className="w-12 h-12 mx-auto bg-brand-500/10 rounded-full flex items-center justify-center text-brand-400 mb-4">
                <s.icon size={24} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{s.value}</h3>
              <p className="text-slate-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-dark-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Start earning or getting work done in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

            {[
              { step: '01', title: 'Register', desc: 'Create an account as a Worker or Buyer to get started.' },
              { step: '02', title: 'Task / Post', desc: 'Browse tasks to complete or post new tasks for others.' },
              { step: '03', title: 'Earn / Promote', desc: 'Get paid instantly or watch your project grow.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 text-center"
              >
                <div className="w-24 h-24 mx-auto glass rounded-full flex items-center justify-center text-3xl font-bold text-brand-400 border-4 border-dark-950 mb-6 shadow-xl shadow-brand-500/10">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">User Reviews</h2>
            <p className="text-slate-400">See what our community has to say about TaskEarn.</p>
          </div>

          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            modules={[Autoplay]}
            className="pb-12"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="glass p-8 rounded-2xl h-full flex flex-col border-brand-500/10">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/50" />
                    <div>
                      <h4 className="font-bold text-white">{t.name}</h4>
                      <span className="text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">{t.role}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 italic flex-1">"{t.quote}"</p>
                  <div className="flex gap-1 text-amber-400 mt-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-dark-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-slate-400">Got questions? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto glass p-12 md:p-24 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-purple-600/20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Ready to start earning?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already earning by completing simple tasks on TaskEarn.
            </p>
            <Link to="/register" className="btn-primary text-xl px-10 py-5 inline-flex items-center gap-3">
              Create Free Account
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden border-brand-500/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-lg text-slate-200">{faq.question}</span>
        {isOpen ? <ChevronUp className="text-brand-400" /> : <ChevronDown className="text-slate-500" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5">
          {faq.answer}
        </div>
      </motion.div>
    </div>
  );
}
