import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import api from '../lib/api.js';
import { ArrowRight, Star, Shield, Zap, TrendingUp, Users, DollarSign } from 'lucide-react';
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const features = [
  { title: 'Instant Earnings', icon: Zap, desc: 'Complete tasks and see your balance grow immediately.' },
  { title: 'Secure Payments', icon: Shield, desc: 'withdraw your earnings safely via Stripe or Crypto.' },
  { title: 'Growing Community', icon: Users, desc: 'Join thousands of workers and buyers worldwide.' },
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
