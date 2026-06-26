import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, Tag, Database, FolderTree, Search, Download,
  RefreshCw, Heart, ExternalLink, ArrowLeft, CheckCircle2,
  Loader2, Layers, GitBranch, Cpu, Brain, Zap,
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: easeOutExpo, delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOutExpo } },
};

function useCountUp(end: number, duration: number = 600, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return count;
}

function CountUp({ end, duration = 600, suffix = '', start }: { end: number; duration?: number; suffix?: string; start: boolean }) {
  const count = useCountUp(end, duration, start);
  return <span>{count}{suffix}</span>;
}

function StatCard({ value, label, description, icon }: { value: string; label: string; description: string; icon: React.ReactNode }) {
  return (
    <motion.div variants={staggerItem} className="flex flex-col items-center text-center p-5 rounded-[18px] border transition-all duration-[250ms] hover:-translate-y-[3px]" style={{ backgroundColor: '#faf8f5', borderColor: '#e5e1dc', boxShadow: '0 2px 8px rgba(28,25,23,0.04)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#e8f3f2' }}>{icon}</div>
      <span className="text-[2rem] font-normal leading-[1.2]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>{value}</span>
      <span className="text-[14px] font-semibold mt-1" style={{ color: '#1c1917' }}>{label}</span>
      <span className="text-[12px] mt-1 leading-[1.5]" style={{ color: '#5a5550' }}>{description}</span>
    </motion.div>
  );
}

function FeatureCard({ title, description, icon, iconBg }: { title: string; description: string; icon: React.ReactNode; iconBg: string }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(28,25,23,0.08)' }} transition={{ duration: 0.25, ease: easeOutExpo }} className="flex flex-col p-6 rounded-[18px] border transition-all duration-[250ms]" style={{ backgroundColor: '#faf8f5', borderColor: '#e5e1dc', boxShadow: '0 2px 8px rgba(28,25,23,0.04)' }}>
      <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-3" style={{ backgroundColor: iconBg }}>{icon}</div>
      <span className="text-[16px] font-semibold mt-3" style={{ color: '#1c1917', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{title}</span>
      <span className="text-[13px] mt-2 leading-[1.6]" style={{ color: '#5a5550', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{description}</span>
    </motion.div>
  );
}

function ResearchAreaRow({ name, count, topics, color, delay, icon }: { name: string; count: number; topics: string; color: string; delay: number; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.35, ease: easeOutExpo, delay }} className="flex items-center gap-4 py-4 border-b last:border-b-0" style={{ borderColor: '#eeeae5' }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <span className="text-[14px] font-semibold truncate block" style={{ color: '#1c1917', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{name}</span>
        <span className="text-[12px] leading-[1.5]" style={{ color: '#8a827a', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{topics}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <CountUp end={count} start={inView} />
        <span className="text-[12px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '18', color, fontFamily: "'DM Sans', system-ui, sans-serif" }}>papers</span>
      </div>
    </motion.div>
  );
}

export default function Over() {
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

  const handleCheckUpdates = useCallback(() => {
    setCheckingUpdates(true);
    setUpdateMessage(null);
    setTimeout(() => {
      setCheckingUpdates(false);
      setUpdateMessage('U heeft de nieuwste versie van Bibliotheek.');
      setTimeout(() => setUpdateMessage(null), 4000);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!updateMessage) return;
    const t = setTimeout(() => setUpdateMessage(null), 4000);
    return () => clearTimeout(t);
  }, [updateMessage]);

  return (
    <div className="flex-1 flex flex-col overflow-auto" style={{ backgroundColor: '#faf8f5' }}>
      <div className="w-full max-w-[800px] mx-auto px-5 sm:px-8 md:px-10 pb-8">
        <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.15 }} className="relative mt-6 rounded-[18px] border overflow-hidden" style={{ borderColor: '#e5e1dc', background: 'linear-gradient(135deg, #f4f1ed 0%, #e8f3f2 50%, #f4f1ed 100%)', padding: '48px 40px' }}>
          <div className="absolute top-[10%] left-[15%] w-[180px] h-[180px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(61,140,135,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-[10%] right-[15%] w-[160px] h-[160px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(250,248,245,0.8) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div className="relative flex flex-col items-center text-center z-[1]">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.2 }} className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-5" style={{ backgroundColor: '#ffffff', borderColor: '#3d8c87', boxShadow: '0 4px 12px rgba(61,140,135,0.15)' }}>
              <BookOpen size={28} style={{ color: '#3d8c87' }} />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.3 }} className="text-[36px] font-normal leading-[1.2] mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Bibliotheek</motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: easeOutExpo, delay: 0.4 }} className="text-[16px] font-normal leading-[1.5] mb-5 max-w-[480px]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#5a5550' }}>Uw academische referentiebibliotheek, geintegreerd in Medi-Bridge.</motion.p>
            <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } } }} className="flex flex-wrap items-center justify-center gap-2">
              {[{ label: 'v1.0.0', bg: '#3d8c87', color: '#ffffff' }, { label: 'Medi-Bridge Module', bg: '#7aac6e', color: '#ffffff' }, { label: 'Stable', bg: '#e8f3f2', color: '#3d8c87' }].map((badge, i) => (
                <motion.span key={i} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: easeOutExpo } } }} className="px-3 py-1 rounded-full text-[12px] font-semibold" style={{ backgroundColor: badge.bg, color: badge.color, fontFamily: "'DM Sans', system-ui, sans-serif" }}>{badge.label}</motion.span>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section ref={statsRef} initial="hidden" animate={statsInView ? 'visible' : 'hidden'} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <motion.div variants={fadeInUp} className="p-6 rounded-[18px] border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e1dc', boxShadow: '0 2px 8px rgba(28,25,23,0.04)' }}>
            <div className="flex items-center gap-2 mb-3"><Tag size={16} style={{ color: '#3d8c87' }} /><span className="text-[16px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Versie &amp; Release</span></div>
            <div className="text-[28px] font-normal" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#3d8c87' }}>v1.0.0</div>
            <p className="text-[13px] mt-2" style={{ color: '#5a5550', fontFamily: "'DM Sans', system-ui, sans-serif" }}>Uitgebracht: 27 juni 2025</p>
            <button onClick={handleCheckUpdates} disabled={checkingUpdates} className="mt-4 px-4 py-2 rounded-[10px] border text-[13px] font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-70" style={{ backgroundColor: '#faf8f5', borderColor: '#3d8c87', color: '#3d8c87', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {checkingUpdates ? <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Bezig met controleren...</span> : 'Controleer op updates'}
            </button>
            {updateMessage && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3, ease: easeOutExpo }} className="mt-3 flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-medium" style={{ backgroundColor: '#edf5eb', color: '#5e9e6e', fontFamily: "'DM Sans', system-ui, sans-serif" }}><CheckCircle2 size={14} />{updateMessage}</motion.div>}
          </motion.div>
          <motion.div variants={fadeInUp} className="p-6 rounded-[18px] border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e1dc', boxShadow: '0 2px 8px rgba(28,25,23,0.04)' }}>
            <div className="flex items-center gap-2 mb-3"><Database size={16} style={{ color: '#7aac6e' }} /><span className="text-[16px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Gegevens</span></div>
            <div className="space-y-0" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {[{ label: 'Publicaties', value: <CountUp end={502} start={statsInView} /> }, { label: 'Collecties', value: <CountUp end={5} start={statsInView} /> }, { label: 'Tags', value: '200+' }, { label: 'Laatste update', value: '27 juni 2025' }].map((row, i, arr) => (
                <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: i < arr.length - 1 ? '1px solid #eeeae5' : 'none' }}>
                  <span className="text-[14px]" style={{ color: '#5a5550' }}>{row.label}</span>
                  <span className="text-[16px] font-semibold" style={{ color: '#1c1917' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <StatCard value="502" label="publicaties" description="Artikelen, papers en preprints uit vijf onderzoeksgebieden" icon={<BookOpen size={18} style={{ color: '#3d8c87' }} />} />
          <StatCard value="5" label="collecties" description="Georganiseerd in thematische verzamelingen" icon={<Layers size={18} style={{ color: '#7aac6e' }} />} />
          <StatCard value="200+" label="tags" description="Gekleurde tags voor snel filteren en vinden" icon={<Tag size={18} style={{ color: '#c2893d' }} />} />
          <StatCard value="Geintegreerd" label="" description="Naadloos verbonden met je Medi-Bridge workflow" icon={<CheckCircle2 size={18} style={{ color: '#5a7fb5' }} />} />
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} className="mt-8">
          <motion.h2 variants={staggerItem} className="text-[22px] font-normal text-center mb-5" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Functies</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard title="Zoeken &amp; Filteren" description="Zoek in titels, auteurs en tags. Filter op collectie, tag of jaartal." icon={<Search size={24} style={{ color: '#3d8c87' }} />} iconBg="#e8f3f2" />
            <FeatureCard title="Organiseren" description="Verzamel papers in thematische collecties. Voeg eigen tags toe." icon={<FolderTree size={24} style={{ color: '#7aac6e' }} />} iconBg="#edf5eb" />
            <FeatureCard title="Citeren" description="Exporteer in BibTeX, RIS, APA, MLA en meer citatiestijlen." icon={<Download size={24} style={{ color: '#c2893d' }} />} iconBg="#fdf5ec" />
            <FeatureCard title="Synchroniseren" description="Synchroniseer met Zotero voor back-up en delen." icon={<RefreshCw size={24} style={{ color: '#5a7fb5' }} />} iconBg="#edf1f8" />
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} className="mt-8">
          <motion.h2 variants={staggerItem} className="text-[22px] font-normal text-center mb-5" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Onderzoeksgebieden</motion.h2>
          <motion.div variants={staggerItem} className="p-5 sm:p-6 rounded-[18px] border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e1dc', boxShadow: '0 2px 8px rgba(28,25,23,0.04)' }}>
            <ResearchAreaRow name="LLM Alignment" count={144} topics="RLHF, DPO, PPO, constitutional AI, safety" color="#3d8c87" delay={0} icon={<Brain size={18} style={{ color: '#3d8c87' }} />} />
            <ResearchAreaRow name="Diffusie &amp; Generatieve Modellen" count={98} topics="Image/video/audio generation, GANs, VAEs" color="#c2893d" delay={0.06} icon={<Zap size={18} style={{ color: '#c2893d' }} />} />
            <ResearchAreaRow name="Graf Neurale Netwerken" count={78} topics="GCN, GAT, knowledge graphs, graph transformers" color="#8a6ab5" delay={0.12} icon={<GitBranch size={18} style={{ color: '#8a6ab5' }} />} />
            <ResearchAreaRow name="Multimodaal Leren" count={118} topics="CLIP, BLIP, vision-language, medical imaging" color="#5e9e6e" delay={0.18} icon={<Layers size={18} style={{ color: '#5e9e6e' }} />} />
            <ResearchAreaRow name="Efficiente Inferentie &amp; Quantisatie" count={64} topics="Quantization, LoRA, FlashAttention, vLLM" color="#5a7fb5" delay={0.24} icon={<Cpu size={18} style={{ color: '#5a7fb5' }} />} />
          </motion.div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} className="mt-8">
          <motion.div variants={staggerItem} className="p-6 sm:p-7 rounded-[18px] border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e1dc', boxShadow: '0 2px 8px rgba(28,25,23,0.04)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3"><Heart size={16} style={{ color: '#c25e5e' }} fill="#c25e5e" /><span className="text-[16px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Met dank aan</span></div>
                <p className="text-[13px] leading-[1.6]" style={{ color: '#5a5550', fontFamily: "'DM Sans', system-ui, sans-serif" }}>Bibliotheek is gebouwd door het Medi-Bridge team als onderdeel van het Medi-Bridge ecosysteem voor gezondheidsonderzoek.</p>
                <div className="flex items-center gap-2 mt-4"><div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3d8c87' }}><span className="text-[10px] font-bold text-white">M</span></div><span className="text-[14px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#3d8c87' }}>Medi-Bridge</span></div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'].map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ backgroundColor: '#f4f1ed', color: '#5a5550', border: '1px solid #e5e1dc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{tech}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3"><BookOpen size={16} style={{ color: '#3d8c87' }} /><span className="text-[16px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Documentatie</span></div>
                {['Gebruikershandleiding', 'Snelstartgids', 'Veelgestelde vragen', 'API-documentatie', 'Probleem melden'].map((link, i) => (
                  <motion.a key={link} href="#" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.2 }} className="flex items-center gap-2 py-1.5 text-[13px] transition-colors hover:underline" style={{ color: '#3d8c87', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{link}<ExternalLink size={12} /></motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.8 }} className="mt-8 pt-5 pb-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: '#e5e1dc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3d8c87' }}><span className="text-[9px] font-bold text-white">M</span></div><span className="text-[14px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#3d8c87' }}>Medi-Bridge</span><span className="text-[12px]" style={{ color: '#8a827a' }}>Bibliotheek Module</span></div>
          <div className="text-center"><span className="text-[12px]" style={{ color: '#8a827a' }}>&copy; 2025 Medi-Bridge. Alle rechten voorbehouden.</span><span className="block text-[11px]" style={{ color: '#8a827a' }}>Versie 1.0.0 &mdash; Build 2025.06.27</span></div>
          <Link to="/" className="flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:underline" style={{ color: '#3d8c87' }}><ArrowLeft size={14} />Terug naar Bibliotheek</Link>
        </motion.footer>
      </div>
    </div>
  );
}