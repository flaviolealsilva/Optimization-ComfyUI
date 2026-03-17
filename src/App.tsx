import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Terminal as TerminalIcon, 
  Layers, 
  BarChart3, 
  ArrowRight, 
  Github, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  Code2,
  Monitor,
  HardDrive,
  Activity,
  Play,
  Settings,
  ShieldCheck,
  Box,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';

// --- Data ---
const performanceData = [
  { name: 'Padrão (CPU)', time: 180, color: '#4b5563' },
  { name: 'Intel UHD (1ª Gen)', time: 30, color: '#3b82f6' },
  { name: 'Intel UHD (Cache JIT)', time: 7, color: '#10b981' },
];

const loadData = [
  { time: '0s', cpu: 100, gpu: 5 },
  { time: '5s', cpu: 80, gpu: 40 },
  { time: '10s', cpu: 40, gpu: 85 },
  { time: '15s', cpu: 20, gpu: 94 },
  { time: '20s', cpu: 15, gpu: 94 },
  { time: '25s', cpu: 10, gpu: 94 },
  { time: '30s', cpu: 10, gpu: 10 },
];

// --- Components ---

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" />;
};

const Terminal = ({ commands }: { commands: string[] }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLine >= commands.length) return;

    let charIndex = 0;
    const command = commands[currentLine];
    setIsTyping(true);

    const timer = setInterval(() => {
      if (charIndex < command.length) {
        setTypedText(prev => prev + command[charIndex]);
        charIndex++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setTypedText('');
        }, 800);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [currentLine, commands]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentLine, typedText]);

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden font-mono text-xs shadow-2xl glass">
      <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
        </div>
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">deploy_protocol_v2.sh</span>
        </div>
        <div className="w-10" />
      </div>
      <div ref={scrollRef} className="p-6 h-64 overflow-y-auto space-y-1.5 scrollbar-hide">
        {commands.slice(0, currentLine).map((cmd, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-emerald-500/50 shrink-0 font-bold">root@igpu-x:~#</span>
            <span className="text-zinc-300">{cmd}</span>
          </div>
        ))}
        {currentLine < commands.length && (
          <div className="flex gap-3">
            <span className="text-emerald-500/50 shrink-0 font-bold">root@igpu-x:~#</span>
            <span className="text-white">
              {typedText}
              <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse align-middle" />
            </span>
          </div>
        )}
        {!isTyping && currentLine === commands.length && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-400 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-3"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold uppercase tracking-tighter">System Optimized: 1.4 it/s achieved</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TechSpec = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-3xl overflow-hidden glass">
    {[
      { label: "OS Architecture", value: "Ubuntu 24.04 LTS (Noble Numbat)", icon: Monitor },
      { label: "Compute Runtime", value: "Intel® OneAPI / OpenVINO™ 2024.1", icon: Zap },
      { label: "Target Hardware", value: "Intel® UHD Graphics (Integrated)", icon: Cpu },
      { label: "Memory Protocol", value: "DDR5-4800 + NVMe Gen4 Swap", icon: HardDrive },
      { label: "AI Framework", value: "PyTorch 2.6.0 (CPU/iGPU Hybrid)", icon: Box },
      { label: "Inference Engine", value: "ComfyUI + Custom JIT Kernels", icon: Layers },
    ].map((spec, i) => (
      <div key={i} className="p-8 bg-[#050505] hover:bg-white/5 transition-colors group">
        <spec.icon className="w-5 h-5 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
        <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">{spec.label}</span>
        <span className="text-sm font-mono text-zinc-200">{spec.value}</span>
      </div>
    ))}
  </div>
);

const ImageShowcase = () => {
  const images = [
    { url: "https://picsum.photos/seed/cyberpunk/800/800", title: "Cyberpunk Cityscape", prompt: "hyper-realistic cyberpunk city, neon lights, rain, 8k", seed: "4298374", sampler: "Euler a" },
    { url: "https://picsum.photos/seed/portrait/800/800", title: "AI Portrait", prompt: "renaissance style portrait of a robot, oil painting, intricate detail", seed: "1102938", sampler: "DPM++ 2M Karras" },
    { url: "https://picsum.photos/seed/abstract/800/800", title: "Neural Flow", prompt: "abstract neural network visualization, glowing synapses, deep blue", seed: "8837421", sampler: "UniPC" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {images.map((img, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className="group relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 glass"
        >
          <div className="aspect-square relative overflow-hidden">
            <img 
              src={img.url} 
              alt={img.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            
            {/* Processing Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/10" />
              <div className="absolute top-0 left-0 w-full h-px bg-emerald-500/50 animate-[scanline_2s_linear_infinite]" />
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {img.title}
            </h4>
            <p className="text-[10px] text-zinc-500 italic mb-4 line-clamp-2">"{img.prompt}"</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <span className="block text-[8px] uppercase text-zinc-600 font-black">Seed</span>
                <span className="text-[10px] font-mono text-zinc-400">{img.seed}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase text-zinc-600 font-black">Sampler</span>
                <span className="text-[10px] font-mono text-zinc-400">{img.sampler}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
const HardwareDiagram = () => (
  <div className="relative p-8 bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
    <div className="grid grid-cols-3 gap-8 items-center relative z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center shadow-lg">
          <Cpu className="w-8 h-8 text-zinc-400" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">CPU (Host)</span>
      </div>

      <div className="relative h-12 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-0.5 bg-zinc-800" />
        </div>
        <motion.div 
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 bg-emerald-500 rounded-full blur-[2px] relative z-10"
        />
        <div className="absolute -top-8 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">OpenVINO Hijack</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <Zap className="w-8 h-8 text-emerald-500" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Intel UHD GPU</span>
      </div>
    </div>
    
    <div className="mt-12 p-4 bg-black/40 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-zinc-500 uppercase">VRAM Compartilhada</span>
        <span className="text-[10px] text-emerald-500 font-mono">8.0 GB / 16.0 GB</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '50%' }}
          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        />
      </div>
    </div>
  </div>
);

const Step = ({ number, title, children, active }: { number: string; title: string; children: React.ReactNode; active?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={cn(
      "relative pl-16 pb-16 border-l-2 border-zinc-800 last:pb-0",
      active ? "border-emerald-500/30" : ""
    )}
  >
    <div className={cn(
      "absolute left-[-21px] top-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all duration-500",
      active ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110" : "bg-zinc-900 border-zinc-700 text-zinc-500"
    )}>
      {number}
    </div>
    <h3 className="text-2xl font-black mb-6 text-white tracking-tight uppercase italic">{title}</h3>
    <div className="text-zinc-400 leading-relaxed text-lg">
      {children}
    </div>
  </motion.div>
);

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-emerald-500 selection:text-black font-sans overflow-x-hidden bg-grid relative">
      <div className="scanline" />
      <MatrixBackground />
      
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-6 flex items-center justify-between",
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tighter text-2xl text-white leading-none">IGPU-X</span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-emerald-500 font-bold">OpenVINO Edition</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <a href="#paradigma" className="hover:text-emerald-400 transition-colors relative group">
            O Paradigma
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
          </a>
          <a href="#guia" className="hover:text-emerald-400 transition-colors relative group">
            Guia Prático
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
          </a>
          <a href="#performance" className="hover:text-emerald-400 transition-colors relative group">
            Performance
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            <Github className="w-4 h-4" /> v1.0.4
          </button>
          <button className="bg-emerald-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95">
            Workshop 2026
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto px-6 relative z-10 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Activity className="w-3 h-3 animate-pulse" />
              Hardware Optimization Protocol v2.0
            </div>
            
            <h1 className="text-[14vw] md:text-[12vw] font-display text-white tracking-tighter leading-[0.8] mb-12 uppercase italic text-glow">
              Extraindo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600">Leite de Pedra</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-zinc-500 text-xl md:text-2xl leading-relaxed mb-16 font-medium">
              A quebra do monopólio das GPUs dedicadas. IA Generativa de alta performance rodando em silício integrado Intel UHD.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="#guia" className="group w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                Iniciar Protocolo <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="w-full sm:w-auto border border-white/10 bg-white/5 backdrop-blur-md px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
                Benchmarks <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] uppercase tracking-[0.5em] text-zinc-600 font-bold">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
        </motion.div>
      </section>

      {/* The Paradigm Section */}
      <section id="paradigma" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <TechSpec />
          </div>
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl md:text-8xl font-display text-white mb-10 tracking-tighter uppercase italic leading-none">
                O Fim da <br />
                <span className="text-emerald-500 text-glow">Escassez</span>
              </h2>
              <p className="text-zinc-400 text-xl leading-relaxed mb-12">
                Enquanto o mundo compete por chips H100, nós olhamos para o que já está na sua mesa. 
                Engenharia de software inteligente não é sobre ter mais hardware, é sobre ter menos desperdício.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: ShieldCheck, title: "Zero Bloatware", desc: "Eliminação de drivers NVIDIA redundantes." },
                  { icon: Box, title: "JIT Compilation", desc: "Tradução direta para o silício Intel." },
                  { icon: Layers, title: "VRAM Hijack", desc: "Uso agressivo de memória compartilhada." },
                  { icon: Settings, title: "Kernel Tuning", desc: "Prioridade de renderização no nível do OS." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                    <item.icon className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-white text-sm uppercase tracking-widest mb-2">{item.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <HardwareDiagram />
              {/* Decorative Glow */}
              <div className="absolute -inset-20 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Simulation / Terminal Section */}
      <section className="py-32 bg-zinc-900/20 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Simulação de Deploy</h2>
                <p className="text-zinc-500 text-lg">Veja a mágica acontecer em tempo real. O script de otimização injeta as dependências críticas e prepara o ambiente OpenVINO.</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-widest text-zinc-500">Status do Nó</span>
                  <span className="text-xs font-mono text-emerald-400">READY_FOR_INJECTION</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Play className="w-5 h-5 text-black fill-current" />
                </div>
              </div>
            </div>
            
            <Terminal commands={[
              "sudo apt update && sudo apt install intel-opencl-icd -y",
              "python3 -m venv venv && source venv/bin/activate",
              "pip install torch --index-url https://download.pytorch.org/whl/cpu",
              "git clone https://github.com/openvino-dev-samples/comfyui_openvino",
              "cd comfyui_openvino && pip install -r requirements.txt",
              "python main.py --cpu --use-pytorch-cross-attention",
              "--- PROTOCOLO IGPU-X INICIADO ---",
              "Buscando hardware compatível...",
              "Dispositivo encontrado: [GPU.0] Intel(R) UHD Graphics",
              "Otimizando modelos para arquitetura x86_64...",
              "Sucesso! Sistema pronto para inferência em 7s."
            ]} />
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-display text-white mb-6 tracking-tighter uppercase italic leading-none">Galeria de <br /> <span className="text-emerald-500 text-glow">Resultados</span></h2>
            <p className="text-zinc-500 text-xl max-w-2xl mx-auto">Imagens geradas localmente em 7 segundos utilizando o protocolo IGPU-X.</p>
          </div>
          <ImageShowcase />
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section id="guia" className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-24">
              <h2 className="text-6xl md:text-9xl font-display text-white mb-8 tracking-tighter uppercase italic leading-none">O Mapa da <br /> <span className="text-emerald-500 text-glow">Mina</span></h2>
              <p className="text-zinc-500 text-xl max-w-2xl">Siga o protocolo rigorosamente. Cada comando foi testado para extrair o máximo de cada ciclo de clock.</p>
            </div>

            <div className="space-y-12">
              <Step number="01" title="Preparação do Terreno" active>
                <p className="mb-8">Primeiro, vamos garantir que seu Linux esteja atualizado e com as ferramentas básicas instaladas. Isso evita erros chatos lá na frente.</p>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 font-mono text-sm text-emerald-400">
                  <span className="text-zinc-600 mr-2"># Atualiza a lista de pacotes e o sistema</span> <br />
                  sudo apt update && sudo apt upgrade -y <br />
                  <span className="text-zinc-600 mr-2"># Instala ferramentas essenciais</span> <br />
                  sudo apt install git python3-pip python3-venv wget -y
                </div>
              </Step>

              <Step number="02" title="Drivers de Vídeo Intel">
                <p className="mb-8">Agora instalamos os drivers que permitem que o sistema use todo o poder da sua placa de vídeo integrada (iGPU). Sem isso, a IA rodaria apenas no processador, o que é muito mais lento.</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 font-mono text-sm text-emerald-400">
                    <span className="text-zinc-600 mr-2"># Adiciona o repositório oficial da Intel</span> <br />
                    wget -qO - https://repositories.intel.com/gpu/intel-graphics.key | sudo gpg --yes --dearmor --output /usr/share/keyrings/intel-graphics.gpg
                  </div>
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 font-mono text-sm text-emerald-400">
                    <span className="text-zinc-600 mr-2"># Instala os drivers de computação</span> <br />
                    sudo apt install intel-opencl-icd intel-level-zero-gpu level-zero -y
                  </div>
                </div>
              </Step>

              <Step number="03" title="Ambiente Isolado (Python)">
                <p className="mb-8">Vamos criar uma "caixa" (ambiente virtual) para instalar os programas da IA. Assim, se algo der errado, é só apagar a pasta e começar de novo, sem afetar o resto do seu computador.</p>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 font-mono text-sm text-emerald-400">
                  <span className="text-zinc-600 mr-2"># Cria a pasta do projeto</span> <br />
                  mkdir meu-projeto-ia && cd meu-projeto-ia <br />
                  <span className="text-zinc-600 mr-2"># Cria o ambiente virtual</span> <br />
                  python3 -m venv venv <br />
                  <span className="text-zinc-600 mr-2"># Ativa o ambiente</span> <br />
                  source venv/bin/activate
                </div>
              </Step>

              <Step number="04" title="Instalação do PyTorch">
                <p className="mb-8">O PyTorch é a base de quase toda IA hoje em dia. Aqui, instalamos a versão otimizada para CPU, que é a que o OpenVINO usa para fazer a ponte com a sua GPU Intel.</p>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 font-mono text-sm text-emerald-400">
                  <span className="text-zinc-600 mr-2"># Instala o PyTorch na versão leve</span> <br />
                  pip install torch==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cpu
                </div>
              </Step>

              <Step number="05" title="Cérebro OpenVINO">
                <p className="mb-8">Este é o segredo. O OpenVINO traduz os cálculos pesados da IA para uma linguagem que a sua placa Intel entende perfeitamente, multiplicando a velocidade de geração.</p>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 font-mono text-sm text-emerald-400">
                  <span className="text-zinc-600 mr-2"># Baixa o plugin de otimização</span> <br />
                  git clone https://github.com/openvino-dev-samples/comfyui_openvino <br />
                  <span className="text-zinc-600 mr-2"># Instala as dependências do plugin</span> <br />
                  cd comfyui_openvino && pip install -r requirements.txt
                </div>
              </Step>

              <Step number="06" title="Ligar os Motores">
                <p className="mb-8">Tudo pronto! Agora é só rodar o comando para abrir a interface e começar a criar. O parâmetro `--cpu` aqui é usado para inicializar, mas o OpenVINO cuidará de mover a carga para a GPU.</p>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 font-mono text-sm text-emerald-400">
                  <span className="text-zinc-600 mr-2"># Inicia a interface otimizada</span> <br />
                  python main.py --cpu --use-pytorch-cross-attention
                </div>
              </Step>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Deep Dive */}
      <section id="performance" className="py-32 bg-zinc-900/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-6xl md:text-8xl font-display text-white mb-8 tracking-tighter uppercase italic leading-none">Métricas de <br /> <span className="text-emerald-500 text-glow">Impacto</span></h2>
              <p className="text-zinc-400 text-lg mb-12">
                Não é apenas sobre ser rápido, é sobre eficiência energética e aproveitamento de recursos. 
                Veja como a carga migra da CPU para a GPU durante a inferência.
              </p>
              
              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-black/40 border border-white/10">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500">Carga de Trabalho</span>
                      <h4 className="text-xl font-black text-white">Migração de Tensores</h4>
                    </div>
                    <div className="flex gap-4 text-[10px] font-bold uppercase">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-zinc-600" /> CPU</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> iGPU</div>
                    </div>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={loadData}>
                        <defs>
                          <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="gpu" stroke="#10b981" fillOpacity={1} fill="url(#colorGpu)" strokeWidth={3} />
                        <Area type="monotone" dataKey="cpu" stroke="#4b5563" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="p-10 rounded-[40px] bg-emerald-500 text-black">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Resultado Final</span>
                <div className="text-8xl font-black tracking-tighter mb-4 italic">7s</div>
                <p className="font-bold text-xl leading-tight">Geração completa em hardware integrado. Performance de entrada, custo zero.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 rounded-[32px] bg-zinc-900 border border-white/5">
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter">1.4</div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">it/s</span>
                </div>
                <div className="p-8 rounded-[32px] bg-zinc-900 border border-white/5">
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter">94%</div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">GPU Usage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-8xl md:text-[15vw] font-display text-white mb-12 tracking-tighter uppercase italic leading-none">
              Seja o <br /> <span className="text-emerald-500 text-glow">Gargalo</span>
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-500 text-xl mb-16">
              Não deixe o hardware limitar sua criatividade. A otimização é a ferramenta definitiva do engenheiro moderno.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto bg-white text-black px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-emerald-400 transition-all hover:shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                Baixar Kit Completo
              </button>
              <button className="w-full sm:w-auto border border-white/10 bg-white/5 px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-colors">
                Comunidade Discord
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Massive Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none uppercase italic">
          OPTIMIZED
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
                <Zap className="text-black w-5 h-5 fill-current" />
              </div>
              <span className="font-black tracking-tighter text-xl text-white">IGPU-X</span>
            </div>
            <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">License</a>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-700 font-bold">
              © 2026 • Built for the Revolution
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
