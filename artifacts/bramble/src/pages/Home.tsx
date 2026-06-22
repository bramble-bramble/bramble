import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Menu, X as CloseIcon, Check, ArrowUp, Lock, Sprout, Flower2, ShoppingBasket, Star, Flame, BarChart2, Orbit, Trophy } from "lucide-react";
import { SiX, SiTelegram } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MiniGame from "@/components/MiniGame";

const PetalRain = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <svg
          key={i}
          className="absolute opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            width: `${10 + Math.random() * 15}px`,
            height: `${10 + Math.random() * 15}px`,
            animation: `petal-fall ${8 + Math.random() * 10}s linear infinite`,
            animationDelay: `-${Math.random() * 15}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            fill: Math.random() > 0.5 ? '#FFF' : '#FFB6C1',
          }}
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
          <path d="M12 4C8.69 4 6 8.03 6 12s2.69 8 6 8 6-4.03 6-8-2.69-8-6-8z" />
        </svg>
      ))}
    </div>
  );
};

export default function Home() {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const CA = "4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump";

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
      setShowBackToTop(totalScroll > 400);
    };
    window.addEventListener('scroll', handleScroll);
    
    const saved = localStorage.getItem('bramble_high_score');
    if (saved) setHighScore(parseInt(saved, 10));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    toast({
      title: "Copied to meadow!",
      description: "Contract address copied to clipboard.",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" as const },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" as const },
    transition: { staggerChildren: 0.15 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const }
  };

  return (
    <div className="min-h-screen relative font-sans text-foreground">
      <div 
        className="fixed top-0 left-0 h-1 bg-[#4A7C59] z-[60] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
      <PetalRain />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#4A7C59]/90 to-[#3d6b47]/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight text-white cursor-pointer flex items-center gap-2 group" onClick={() => scrollTo('hero')}>
            $BRAMBLE
            <svg className="w-5 h-5 text-yellow-300 animate-spin-slow group-hover:animate-bounce-gentle" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
              <circle cx="12" cy="12" r="4" fill="#FFD700" />
            </svg>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {['About', 'Roadmap', 'Community'].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-white/90 hover:text-[#FFD700] transition-colors font-medium group relative flex items-center gap-1">
                <Flower2 className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all absolute -left-4" />
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <button onClick={() => scrollTo('play')} className="text-white/90 hover:text-[#FFD700] transition-colors font-medium group relative flex items-center gap-1">
              <Flower2 className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all absolute -left-4" />
              Play
              <span className="ml-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full" />
            </button>

            <Button className="rounded-full font-bold bg-[#D4A574] text-[#3D2817] hover:bg-[#D4A574]/90 animate-pulse-glow hover:scale-110 transition-transform shadow-md" asChild>
              <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer">
                BUY $BRAMBLE
              </a>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#3d6b47] border-b border-white/20 overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4 shadow-xl">
                {['About', 'Roadmap', 'Community', 'Play'].map((item, i) => (
                  <motion.button 
                    key={item}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollTo(item.toLowerCase())} 
                    className="text-left text-lg font-medium p-2 text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
                  >
                    <Flower2 className="w-4 h-4 text-[#FFD700]" />
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
          {/* Animated Sun */}
          <div className="absolute top-20 right-10 md:top-24 md:right-24 z-0 w-32 h-32 opacity-80 animate-pulse">
            <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400">
              <circle cx="50" cy="50" r="20" fill="currentColor" />
              <g className="animate-sun-rotate origin-center">
                {[...Array(12)].map((_, i) => (
                  <line key={i} x1="50" y1="10" x2="50" y2="25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />
                ))}
              </g>
            </svg>
          </div>

          {/* Clouds */}
          <svg className="absolute top-32 left-[10%] w-24 h-12 text-white/80 animate-[float_25s_linear_infinite]" viewBox="0 0 24 12" fill="currentColor">
            <path d="M6 12c-3.31 0-6-2.69-6-6s2.69-6 6-6c.22 0 .43.01.64.04C7.57 2.39 9.62 1 12 1c2.76 0 5.17 1.84 5.82 4.38.16-.01.32-.02.48-.02 3.14 0 5.7 2.56 5.7 5.7S21.44 12 18.3 12H6z" />
          </svg>
          <svg className="absolute top-48 right-[20%] w-32 h-16 text-white/70 animate-[float_30s_linear_infinite_reverse]" viewBox="0 0 24 12" fill="currentColor">
             <path d="M6 12c-3.31 0-6-2.69-6-6s2.69-6 6-6c.22 0 .43.01.64.04C7.57 2.39 9.62 1 12 1c2.76 0 5.17 1.84 5.82 4.38.16-.01.32-.02.48-.02 3.14 0 5.7 2.56 5.7 5.7S21.44 12 18.3 12H6z" />
          </svg>
          <svg className="absolute top-20 left-[60%] w-20 h-10 text-white/60 animate-[float_35s_linear_infinite]" viewBox="0 0 24 12" fill="currentColor">
             <path d="M6 12c-3.31 0-6-2.69-6-6s2.69-6 6-6c.22 0 .43.01.64.04C7.57 2.39 9.62 1 12 1c2.76 0 5.17 1.84 5.82 4.38.16-.01.32-.02.48-.02 3.14 0 5.7 2.56 5.7 5.7S21.44 12 18.3 12H6z" />
          </svg>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 z-10 flex flex-col md:flex-row items-center w-full">
            <motion.div 
              className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-700 animate-sway origin-bottom" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c3.49-8.31 8.87-10.35 12.3-10.42c-.01-1.02-.01-2.12-.02-3.15c-.71.55-1.39 1.15-1.94 1.87Z" />
                </svg>
                <span className="text-green-800 font-bold tracking-widest text-sm uppercase">Welcome to Sunbell Meadow</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-bold mb-4 leading-none shimmer-text pb-2">Bramble</h1>
              <p className="text-xl md:text-2xl text-[#3D2817] mb-2 max-w-md font-medium leading-relaxed">
                A tiny hedgehog with a bouquet, a big heart, and a whole meadow of holders behind him.
              </p>
              <p className="text-sm italic text-[#3D2817]/70 mb-8 flex items-center gap-2">
                Not a scam. Just a hedgehog. 
                <svg className="w-4 h-4 text-[#D4A574]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <path d="M15 9h.01" />
                </svg>
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-10 w-full">
                <Button size="lg" className="rounded-full font-bold text-lg px-8 bg-[#D4A574] text-[#3D2817] hover:bg-[#c29668] animate-pulse-glow shadow-xl hover:scale-105 transition-all border-4 border-white group" asChild data-testid="button-buy-hero">
                  <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer">
                    <Flower2 className="w-5 h-5 mr-2 group-hover:animate-spin-slow" />
                    BUY $BRAMBLE
                  </a>
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="lg" variant="outline" className="rounded-full bg-black text-white hover:bg-gray-800 border-none shadow-lg hover:scale-105 transition-all" asChild data-testid="link-x-hero">
                        <a href="https://x.com/bramblelxg" target="_blank" rel="noopener noreferrer"><SiX className="w-5 h-5 mr-2" /> X</a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Follow us on X</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="lg" variant="outline" className="rounded-full bg-[#229ED9] text-white hover:bg-[#1d8fc4] border-none shadow-lg hover:scale-105 transition-all" asChild data-testid="link-tg-hero">
                        <a href="https://t.me/brambletop" target="_blank" rel="noopener noreferrer"><SiTelegram className="w-5 h-5 mr-2" /> Telegram</a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Join the community</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="lg" variant="outline" className="rounded-full bg-[#2d5a3f] text-white hover:bg-[#234731] border-none shadow-lg hover:scale-105 transition-all font-bold" asChild data-testid="link-dex-hero">
                        <a href="https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer">
                          <BarChart2 className="w-5 h-5 mr-2" /> DEX
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Live chart</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
                {[
                  { icon: Orbit, label: "1B Supply" },
                  { icon: Trophy, label: "0% Tax" },
                  { icon: Lock, label: "Locked LP" },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm text-[#3D2817] font-semibold text-sm"
                  >
                    <stat.icon className="w-4 h-4 text-[#D4A574]" />
                    {stat.label}
                  </motion.div>
                ))}
              </div>

              <div className="relative p-[2px] rounded-2xl overflow-hidden group max-w-full">
                <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#D4A574_0%,#4A7C59_50%,#D4A574_100%)] animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2 bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white shadow-md overflow-hidden z-10">
                  <Lock className="w-4 h-4 text-[#4A7C59] shrink-0" />
                  <span className="text-sm font-bold text-[#3D2817] shrink-0">CA:</span>
                  <span className="text-sm font-mono truncate text-[#3D2817] max-w-[150px] sm:max-w-xs">{CA}</span>
                  <button onClick={copyToClipboard} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-all shrink-0 ml-auto shadow-sm" data-testid="button-copy-ca">
                    {copied ? <Check className="w-4 h-4 text-green-600 animate-wiggle" /> : <Copy className="w-4 h-4 text-[#3D2817]" />}
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="w-full md:w-1/2 mt-12 md:mt-0 relative flex justify-center z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute inset-10 bg-[#FFD700]/30 rounded-full blur-3xl animate-pulse-glow" />
                <img src="/bramble-hero.png" alt="Bramble the Hedgehog" className="w-full h-full object-contain drop-shadow-2xl animate-float relative z-10" />
              </div>
            </motion.div>
          </div>

          {/* Hills background layer */}
          <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-0">
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto text-[#3d6b47]" preserveAspectRatio="none">
              <path fill="currentColor" fillOpacity="0.8" d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,144C1120,139,1280,181,1360,202.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto text-[#4A7C59]" preserveAspectRatio="none">
              <path fill="currentColor" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,192C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        {/* Divider SVG */}
        <div className="w-full overflow-hidden leading-none relative -mt-1 z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px] fill-[#4A7C59]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.6,26.47,110.15,50.7,169.1,62.83,219.78,73.28,272.5,67.8,321.39,56.44Z"></path>
          </svg>
          <div className="absolute top-2 left-0 w-full flex justify-around opacity-50 px-10">
            {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-3 bg-green-900/40 rounded-full animate-grass-sway" style={{ animationDelay: `${i * 0.1}s` }} />)}
          </div>
        </div>

        {/* Lore Section */}
        <section id="about" className="py-32 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
          {/* Decorative Background Elements */}
          <div className="absolute left-[-5%] top-[10%] opacity-20 w-64 h-96">
            <svg viewBox="0 0 100 150" fill="#3D2817">
              <path d="M45 150 Q50 100 45 50 Q40 0 50 0 Q60 0 55 50 Q50 100 55 150 Z" />
              <circle cx="50" cy="40" r="40" fill="#4A7C59" />
              <circle cx="20" cy="60" r="25" fill="#3d6b47" />
              <circle cx="80" cy="50" r="30" fill="#3d6b47" />
            </svg>
          </div>
          
          {[...Array(6)].map((_, i) => (
             <Flower2 key={i} className={`absolute text-[#D4A574] opacity-30 w-8 h-8 animate-sway`} style={{ 
               top: `${15 + Math.random() * 70}%`, 
               left: `${10 + Math.random() * 80}%`, 
               animationDelay: `${i * 0.4}s` 
             }} />
          ))}

          <motion.div className="max-w-4xl mx-auto relative z-10" variants={staggerContainer} initial="initial" whileInView="whileInView">
            <div className="relative inline-block mb-16">
              <div className="absolute -left-10 top-0 opacity-20 flex gap-2">
                {[...Array(4)].map((_,i) => <div key={i} className="w-3 h-3 bg-[#3D2817] rounded-full rotate-45 transform translate-y-4 translate-x-2" />)}
              </div>
              
              <div className="absolute -top-6 -left-6 bg-[#4A7C59] text-white text-xs font-bold px-3 py-1 rounded-full">01</div>
              <h2 className="text-5xl md:text-6xl font-bold text-[#3D2817] font-sans text-center relative z-10">
                The Keeper of Sunbell Meadow
              </h2>
              <svg className="absolute -bottom-4 left-0 w-full h-4 text-[#D4A574]" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0 10 Q 25 0 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </div>

            <div className="space-y-8 text-lg md:text-xl text-[#3D2817]/90 leading-relaxed font-medium">
              <motion.div variants={staggerItem} className="bg-white/60 p-8 rounded-3xl border border-white/70 shadow-sm relative">
                <p>
                  <span className="float-left text-7xl font-bold text-[#D4A574] leading-[0.8] mr-3 mt-2">B</span>
                  ramble was born under the old apple tree at the edge of Sunbell Meadow, where morning light turns every blade of grass into gold. He was the smallest hedgehog in the valley, but he carried the largest bouquet because he believed every traveler deserved a flower before choosing a path.
                </p>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#FFF8F0] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Flower2 className="w-6 h-6 text-[#D4A574]" />
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="bg-white/60 p-8 rounded-3xl border border-white/70 shadow-sm relative ml-4 md:ml-12">
                <p>
                  When the foxes started stealing seeds from the garden, Bramble gathered the meadow folk and built a new rule: nobody walks alone. Every holder became a tiny fence post, every meme became a daisy, and every raid became a trail of petals leading back home.
                </p>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#FFF8F0] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Lock className="w-5 h-5 text-[#4A7C59]" />
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="bg-white/60 p-8 rounded-3xl border border-white/70 shadow-sm relative mr-4 md:mr-12">
                <p>
                  Now Bramble wanders the hills with his flowers, guarding the garden, sharing warmth, and proving that the softest mascot can still have the sharpest spikes.
                </p>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#FFF8F0] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <svg className="w-6 h-6 text-[#3D2817]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2 13h4v2h-4zm0-9h4v7h-4z"/>
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Chart Section */}
        <section className="py-24 px-4 sm:px-6 bg-[#F5E6D3] relative">
          <motion.div className="max-w-5xl mx-auto" variants={staggerContainer} initial="initial" whileInView="whileInView">
            <div className="text-center mb-16 relative">
              <div className="absolute -top-6 -left-0 md:left-20 bg-[#4A7C59] text-white text-xs font-bold px-3 py-1 rounded-full">02</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3D2817] flex items-center justify-center gap-3">
                Watch the Meadow Grow
                <Sprout className="w-8 h-8 text-[#4A7C59] animate-bounce-gentle" />
              </h2>
              <p className="text-[#3D2817]/70 italic mt-2 text-lg">The chart doesn't lie. Bramble is on the move.</p>
            </div>

            <motion.div variants={staggerItem} className="relative rounded-[32px] shadow-2xl bg-white border-4 border-[#D4A574] p-1 md:p-3 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-5 z-10 overflow-hidden">
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 20 Q15 0 30 20 Q45 0 60 20 Q75 0 90 20 Q105 0 120 20 Q135 0 150 20 Q165 0 180 20 Q195 0 210 20 Q225 0 240 20 Q255 0 270 20 Q285 0 300 20 Z" fill="#4A7C59"/>
                </svg>
              </div>
              
              <Flower2 className="absolute top-1 left-1 w-6 h-6 text-[#D4A574] z-20" />
              <Flower2 className="absolute top-1 right-1 w-6 h-6 text-[#D4A574] z-20" />
              <Flower2 className="absolute bottom-1 left-1 w-6 h-6 text-[#D4A574] z-20" />
              <Flower2 className="absolute bottom-1 right-1 w-6 h-6 text-[#D4A574] z-20" />

              <div className="relative pt-6 rounded-[24px] overflow-hidden bg-white">
                <iframe 
                  src="https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump?embed=1&theme=light&trades=0&info=0" 
                  style={{ width: '100%', height: '500px', border: 'none' }}
                  title="$BRAMBLE DexScreener Chart"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-32 px-4 sm:px-6 relative overflow-hidden bg-[repeating-linear-gradient(45deg,#E8F4F8,#E8F4F8_20px,#F0F8FB_20px,#F0F8FB_40px)]">
          <div className="absolute right-[-10%] top-[20%] opacity-10 w-96 h-96 pointer-events-none">
            <svg viewBox="0 0 100 150" fill="#4A7C59">
              <path d="M45 150 L55 150 L55 50 L45 50 Z" />
              <circle cx="50" cy="40" r="40" />
              <circle cx="20" cy="50" r="25" />
              <circle cx="80" cy="50" r="25" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20 relative">
               <div className="absolute -top-6 -left-0 md:left-[30%] bg-[#4A7C59] text-white text-xs font-bold px-3 py-1 rounded-full">03</div>
               <motion.h2 className="text-5xl md:text-6xl font-bold text-[#3D2817]" {...fadeIn}>From Seed to Meadow</motion.h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {[
                { num: "01", title: "SPROUT", bg: "from-green-50 to-emerald-100", icon: Sprout, items: ["Launch identity, lock the meadow aesthetic", "Open X, publish first meme kit", "Start holder quests"], active: true },
                { num: "02", title: "BLOOM", bg: "from-pink-50 to-rose-100", icon: Flower2, items: ["Community raids, sticker packs", "DEX visibility, token page polish", "Daily Bramble lore drops"] },
                { num: "03", title: "HARVEST", bg: "from-amber-50 to-yellow-100", icon: ShoppingBasket, items: ["Mini game events, leaderboard seasons", "Creator contests, merch concepts", "Partner garden raids"] },
                { num: "04", title: "EVERGREEN", bg: "from-blue-50 to-cyan-100", icon: Star, items: ["Expanded game mode, collectible badges", "Meadow quests, seasonal art", "Long-term holder rewards"] }
              ].map((phase, i) => (
                <motion.div 
                  key={phase.num} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group"
                >
                  <Card className={`bg-gradient-to-br ${phase.bg} border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-300 h-full rounded-[32px] overflow-hidden relative group-hover:-translate-y-2`}>
                    <div className="absolute -bottom-8 -right-4 text-[8rem] font-bold text-[#3D2817] opacity-5 leading-none select-none pointer-events-none">
                      {phase.num}
                    </div>
                    
                    <CardContent className="p-8 md:p-10 relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-white/50 text-sm font-bold text-[#3D2817] shadow-sm flex items-center gap-2">
                          <phase.icon className="w-4 h-4 text-[#4A7C59]" />
                          Phase {phase.num}
                        </div>
                        {phase.active && (
                          <div className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                            Active
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-4xl font-bold text-[#3D2817] mb-8">{phase.title}</h3>
                      
                      <ul className="space-y-4">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-4">
                            <div className="mt-1 p-1.5 bg-white/60 rounded-full shrink-0 shadow-sm border border-white/50">
                              <phase.icon className="w-4 h-4 text-[#4A7C59]" />
                            </div>
                            <span className="text-[#3D2817]/90 font-medium text-lg leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-32 px-4 sm:px-6 relative bg-gradient-to-br from-[#2d5a3f] to-[#1a3d2b] overflow-hidden">
          {/* Firefly dots */}
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white animate-pulse" style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }} />
          ))}

          <motion.div className="max-w-6xl mx-auto relative z-10" variants={staggerContainer} initial="initial" whileInView="whileInView">
            <div className="text-center mb-16 relative">
              <div className="absolute -top-6 -left-0 md:left-[35%] bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">04</div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">Join the Meadow</h2>
              <p className="text-xl text-white/80 italic">The community is growing. Get in before it's a forest.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { name: "PumpFun", desc: "Buy on Pump.fun", url: "https://pump.fun/coin/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump", bg: "from-rose-50 to-pink-100", icon: Flame, color: "text-rose-500", hover: "hover:shadow-rose-500/50" },
                { name: "DexScreener", desc: "Track it live", url: "https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump", bg: "from-indigo-50 to-purple-100", icon: BarChart2, color: "text-indigo-500", hover: "hover:shadow-indigo-500/50" },
                { name: "Jupiter", desc: "Swap on Jupiter", url: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump", bg: "from-blue-50 to-cyan-100", icon: Orbit, color: "text-blue-500", hover: "hover:shadow-blue-500/50" }
              ].map((card, i) => (
                <motion.a 
                  key={i} 
                  href={card.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block group"
                  variants={staggerItem}
                >
                  <Card className={`bg-gradient-to-br ${card.bg} border-0 shadow-xl text-center h-full rounded-[24px] transition-all duration-300 group-hover:scale-105 group-hover:border-white ${card.hover}`}>
                    <CardContent className="p-8 flex flex-col items-center gap-4 relative">
                      <div className="w-20 h-20 rounded-full bg-white/60 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform">
                        <card.icon className={`w-10 h-10 ${card.color}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{card.name}</h3>
                        <p className="text-gray-600 mt-1 font-medium">{card.desc}</p>
                      </div>
                      <span className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all font-bold text-2xl">→</span>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <motion.a href="https://x.com/bramblelxg" target="_blank" rel="noopener noreferrer" className="block group" variants={staggerItem}>
                <Card className="bg-black text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:scale-105 shadow-xl rounded-[24px] border border-white/20">
                  <CardContent className="p-8 flex items-center gap-6 relative">
                    <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                      <SiX className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">X/Twitter</h3>
                      <p className="text-white/70 font-medium">Follow our updates</p>
                    </div>
                    <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all font-bold text-2xl">→</span>
                  </CardContent>
                </Card>
              </motion.a>
              <motion.a href="https://t.me/brambletop" target="_blank" rel="noopener noreferrer" className="block group" variants={staggerItem}>
                <Card className="bg-[#229ED9] text-white hover:shadow-[0_0_30px_rgba(34,158,217,0.5)] transition-all duration-300 group-hover:scale-105 shadow-xl rounded-[24px] border border-white/20">
                  <CardContent className="p-8 flex items-center gap-6 relative">
                    <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <SiTelegram className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Telegram</h3>
                      <p className="text-white/80 font-medium">Join the community</p>
                    </div>
                    <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all font-bold text-2xl">→</span>
                  </CardContent>
                </Card>
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* Mini Game Section */}
        <section id="play" className="py-32 px-4 sm:px-6 bg-gradient-to-br from-[#1a2f1e] to-[#0d1f12] relative overflow-hidden">
          <motion.div className="max-w-5xl mx-auto text-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative mb-6 inline-block">
              <div className="absolute -top-6 -left-10 bg-[#D4A574] text-[#3D2817] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> NEW
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white flex items-center justify-center gap-4">
                Run with Bramble
                <ArrowUp className="w-8 h-8 text-[#D4A574] animate-bounce-gentle rotate-45" />
              </h2>
            </div>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">
              Roll through Sunbell Meadow, collect flowers, dodge the foxes. How far can you go?
            </p>
            
            <MiniGame />

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 px-6 py-3 rounded-full text-white">
                <Trophy className="w-5 h-5 text-[#FFD700]" />
                <span className="font-medium text-lg">Your Best: <span className="font-bold text-[#FFD700] ml-1">{highScore}</span> flowers</span>
                <Flower2 className="w-4 h-4 text-[#D4A574]" />
              </div>
              
              <div className="flex items-center gap-4 text-white/60 text-sm font-medium mt-4">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 border-2 border-white/30 rounded-lg bg-white/5 font-mono shadow-[0_4px_0_rgba(255,255,255,0.2)]">SPACE</div>
                  <span>to jump</span>
                </div>
                <span className="opacity-50">•</span>
                <span>Tap canvas to jump on mobile</span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-4 bg-[#D4A574] text-[#3D2817] rounded-full shadow-2xl hover:bg-[#c29668] hover:scale-110 transition-all border-2 border-white"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#2a4a35] to-[#1a3025] text-white pt-20 pb-10 px-4 sm:px-6 relative overflow-hidden">
        {/* Rolling hills SVG topper */}
        <svg viewBox="0 0 1440 100" className="absolute top-0 left-0 w-full h-auto text-[#1a2f1e] -mt-1" preserveAspectRatio="none">
           <path fill="currentColor" d="M0,0L1440,0L1440,50 Q1080,100 720,50 Q360,0 0,50Z" />
        </svg>

        {/* Footer Fireflies */}
        {[...Array(10)].map((_, i) => (
          <div key={`ff-${i}`} className="absolute rounded-full bg-white/80 animate-pulse" style={{
            width: `${2}px`,
            height: `${2}px`,
            top: `${20 + Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`
          }} />
        ))}

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-white mb-2">$BRAMBLE</h2>
              <p className="text-white/60 font-medium">Guarding the meadow, one flower at a time</p>
            </div>
            
            <div className="flex gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://x.com/bramblelxg" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:scale-110 transition-all">
                      <SiX className="w-5 h-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent><p>Follow us on X</p></TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://t.me/brambletop" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#229ED9] hover:scale-110 transition-all">
                      <SiTelegram className="w-5 h-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent><p>Join Telegram</p></TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-500 hover:scale-110 transition-all">
                      <BarChart2 className="w-5 h-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent><p>DexScreener Chart</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-sm text-white/50 font-bold">CONTRACT ADDRESS</span>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <span className="font-mono text-sm text-white/80">{CA.substring(0,8)}...{CA.substring(CA.length-6)}</span>
                <button onClick={copyToClipboard} className="text-white/60 hover:text-white transition-colors p-1" title="Copy CA">
                   {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center flex flex-col items-center">
            <p className="text-sm text-white/50 max-w-2xl mx-auto mb-4 font-medium leading-relaxed">
              $BRAMBLE is a meme token. Just vibes and flowers. Not financial advice. Do your own research.
            </p>
            <p className="text-xs text-white/30 font-medium">
              © 2026, Bramble. Guarding the meadow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
