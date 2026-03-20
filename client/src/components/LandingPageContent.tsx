"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle, Shield, Zap, Globe, Cpu, FileText, BarChart3, Users, Star, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSession } from "next-auth/react";

gsap.registerPlugin(ScrollTrigger);

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    gsap.to(".bg-drift", {
      x: "random(-20, 20)",
      y: "random(-20, 20)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

    // Scroll-triggered parallax for stats
    gsap.utils.toArray<HTMLElement>(".stat-counter").forEach((el) => {
      gsap.from(el, {
        textContent: 0,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        snap: { textContent: 1 },
      });
    });
  }, []);

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const fadeUp = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-white">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] bg-drift" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] bg-drift" />
        <div className="absolute top-[50%] left-[50%] w-[20%] h-[20%] bg-cyan-50/50 rounded-full blur-[80px] bg-drift" />
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 glass rounded-3xl px-8 h-20 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-primary">HIREPROOF</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {["Features", "How It Works", "Testimonials"].map(item => (
            <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-bold text-slate-500 hover:text-primary transition-colors tracking-tight uppercase">
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-20 h-10 bg-slate-100 rounded-2xl animate-pulse" />
          ) : session ? (
            <Link href="/dashboard" className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-primary transition-colors uppercase tracking-widest">
                Log In
              </Link>
              <Link href="/signup" className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Get Started
              </Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative pt-48 md:pt-64 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-slate-900/10"
          >
            <Cpu className="w-3.5 h-3.5 text-accent" />
            AI-Powered Resume Intelligence
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-9xl font-display font-black tracking-tight text-primary mb-10 leading-[0.95]"
          >
            Your Career, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-slate-500 to-accent">Bulletproof</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-16 leading-relaxed font-medium px-4"
          >
            HIREPROOF leverages multi-model AI architectures to reconstruct your professional identity with surgical precision. Pass every ATS, bypass the noise, and secure the room.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {session ? (
              <Link href="/dashboard" className="btn-primary flex items-center justify-center gap-3">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary flex items-center justify-center gap-3">
                Build Your Resume <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <Link href="#how-it-works" className="px-8 py-4 bg-white text-primary border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" /> See How It Works
            </Link>
          </motion.div>

          {/* Trusted by */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-24 flex flex-col items-center gap-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Trusted by professionals at</p>
            <div className="flex items-center gap-10 opacity-30">
              {["Google", "Meta", "Amazon", "Microsoft", "Apple"].map(co => (
                <span key={co} className="text-lg font-black uppercase tracking-widest text-slate-400">{co}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* STATS BAR                                      */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { val: "99.2%", label: "Placement Rate" },
                { val: "10x", label: "Interview Multiplier" },
                { val: "4.9/5", label: "User Satisfaction" },
                { val: "140+", label: "Fortune 500 Entries" }
              ].map((stat, i) => (
                <div key={i} className="premium-card text-center">
                  <span className="text-4xl md:text-5xl font-black text-primary block mb-2">{stat.val}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════ */}
      {/* FEATURES                                       */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatedSection>
        <section id="features" className="py-32 px-6 bg-slate-900 text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Precision built for <br /> the elite player.</h2>
                <p className="text-slate-400 text-lg font-medium">Standard builders use templates. We use intelligence. Our platform analyzes high-frequency job vectors and reconstructs your bullets for maximum impact.</p>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Multi-Model AI Engine</span>
              </div>
            </div>

            <motion.div 
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { icon: <Zap className="w-8 h-8 text-accent" />, title: "Velocity Optimization", description: "AI-driven rewriting that increases resume engagement by up to 300% using behavioral psychology frameworks." },
                { icon: <Shield className="w-8 h-8 text-accent" />, title: "ATS Infiltration", description: "Engineered keyword mapping that ensures your profile ranks #1 in legacy Application Tracking Systems." },
                { icon: <Globe className="w-8 h-8 text-accent" />, title: "Global Standards", description: "Multi-jurisdictional compliance for USA, EU, and Asian markets automatically built into every export." },
                { icon: <BarChart3 className="w-8 h-8 text-accent" />, title: "JD Match Analysis", description: "Paste any Job Description and get an instant compatibility score with tactical gaps identified." },
                { icon: <FileText className="w-8 h-8 text-accent" />, title: "Smart Templates", description: "4 professional templates engineered for maximum readability and recruiter engagement patterns." },
                { icon: <Cpu className="w-8 h-8 text-accent" />, title: "5 AI Providers", description: "OpenAI, Anthropic, Gemini, OpenRouter, and NVIDIA — automatic failover for 99.9% uptime." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════ */}
      {/* HOW IT WORKS                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatedSection>
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-24">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">Deployment Protocol</p>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary leading-tight">Three steps to<br />career dominance.</h2>
            </div>

            <motion.div 
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-0"
            >
              {[
                { step: "01", title: "Ingest Your Data", description: "Paste your existing resume content or start from zero. Our system structures everything into a standardized professional format.", icon: <FileText className="w-7 h-7" /> },
                { step: "02", title: "AI Enhancement", description: "Select your preferred AI engine — from OpenAI to NVIDIA. Our multi-model system rewrites every bullet for maximum ATS compatibility and human impact.", icon: <Sparkles className="w-7 h-7" /> },
                { step: "03", title: "Export & Deploy", description: "Choose from 4 professional templates, preview in real-time with paper-fidelity rendering, and export a pixel-perfect PDF ready for submission.", icon: <ArrowRight className="w-7 h-7" /> },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  className="flex gap-8 md:gap-12 items-start group py-12 border-b border-slate-100 last:border-b-0"
                >
                  <div className="shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Step {item.step}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight text-primary mb-3">{item.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-xl">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-16">
              {session ? (
                <Link href="/dashboard" className="btn-accent inline-flex items-center gap-3">
                  Go to Dashboard <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link href="/signup" className="btn-accent inline-flex items-center gap-3">
                  Start Building Now <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatedSection>
        <section id="testimonials" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">Field Reports</p>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-primary">What operators say.</h2>
            </div>

            <motion.div 
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { name: "Sarah Chen", role: "Software Engineer → Google", quote: "I went from 0 callbacks to 5 interviews in one week. The AI rewrote my bullets with keywords I never would have thought of.", stars: 5 },
                { name: "Marcus Rivera", role: "Product Manager → Meta", quote: "The JD analyzer is insane. It told me exactly which skills to highlight and my match score went from 42% to 91%.", stars: 5 },
                { name: "Priya Sharma", role: "Data Scientist → Amazon", quote: "Best investment I've made in my career. The multi-provider AI option meant I could fine-tune my resume with different perspectives.", stars: 5 },
              ].map((testimonial, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  className="p-10 rounded-[32px] bg-white border border-slate-100 shadow-weighted hover:shadow-floating hover:-translate-y-1 transition-all"
                >
                  <div className="flex gap-1 mb-8">
                    {Array(testimonial.stars).fill(0).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed mb-10 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-primary">{testimonial.name}</p>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════ */}
      {/* FINAL CTA                                      */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-16 md:p-24 rounded-[48px] bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none" />
              
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-8">Ready to Deploy?</p>
                <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-tight mb-8">
                  Make your resume<br />
                  <span className="text-accent">impossible to ignore.</span>
                </h2>
                <p className="text-slate-400 font-medium text-lg mb-12 max-w-lg mx-auto">
                  Join thousands of professionals who've transformed their careers with HIREPROOF's AI-powered resume intelligence.
                </p>
                {session ? (
                  <Link href="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-accent/30">
                    Go to your Dashboard <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-accent/30">
                    Create Free Account <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════ */}
      {/* FOOTER                                         */}
      {/* ═══════════════════════════════════════════════ */}
      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">H</span>
              </div>
              <span className="font-display font-medium text-primary tracking-tight">HIREPROOF™ 2026</span>
            </div>
            <div className="flex gap-10">
              {["Privacy", "Terms", "Security", "Status"].map(item => (
                <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Multi-model AI intelligence for career professionals.
          </div>
        </div>
      </footer>
    </div>
  );
}
