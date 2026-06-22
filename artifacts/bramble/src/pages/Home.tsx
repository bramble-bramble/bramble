import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Sparkles, Menu, X as CloseIcon } from "lucide-react";
import { SiX, SiTelegram } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import MiniGame from "@/components/MiniGame";

export default function Home() {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const CA = "4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CA);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard.",
      duration: 2000,
    });
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
  } as const;

  return (
    <div className="min-h-screen relative font-sans text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/60 backdrop-blur-md border-b border-white/20 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight text-primary-foreground cursor-pointer" onClick={() => scrollTo('hero')}>
            $BRAMBLE
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => scrollTo('about')} className="text-foreground/80 hover:text-primary transition-colors font-medium">About</button>
            <button onClick={() => scrollTo('roadmap')} className="text-foreground/80 hover:text-primary transition-colors font-medium">Roadmap</button>
            <button onClick={() => scrollTo('community')} className="text-foreground/80 hover:text-primary transition-colors font-medium">Community</button>
            <button onClick={() => scrollTo('play')} className="text-foreground/80 hover:text-primary transition-colors font-medium">Play</button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-md border-b border-white/20 p-4 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollTo('about')} className="text-left text-lg font-medium p-2">About</button>
            <button onClick={() => scrollTo('roadmap')} className="text-left text-lg font-medium p-2">Roadmap</button>
            <button onClick={() => scrollTo('community')} className="text-left text-lg font-medium p-2">Community</button>
            <button onClick={() => scrollTo('play')} className="text-left text-lg font-medium p-2">Play</button>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-center min-h-[90vh] max-w-6xl mx-auto">
          <motion.div 
            className="w-full md:w-1/2 z-10 flex flex-col items-center md:items-start text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary font-semibold tracking-wider text-sm md:text-base uppercase mb-2">Sunlit Meadow Coin</span>
            <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4 leading-none">Bramble</h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-md">
              A tiny hedgehog with a bouquet, a big heart, and a whole meadow of holders behind him.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
              <Button size="lg" className="rounded-full font-semibold text-lg px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" asChild>
                <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer">
                  BUY $BRAMBLE
                </a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-white/50 border-white hover:bg-white" asChild>
                <a href="https://x.com/bramblelxg" target="_blank" rel="noopener noreferrer"><SiX className="w-5 h-5" /></a>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-white/50 border-white hover:bg-white" asChild>
                <a href="https://t.me/brambletop" target="_blank" rel="noopener noreferrer"><SiTelegram className="w-5 h-5" /></a>
              </Button>
              <Button variant="outline" className="rounded-full bg-white/50 border-white hover:bg-white font-medium" asChild>
                <a href="https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer">DEX</a>
              </Button>
            </div>

            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm max-w-full overflow-hidden">
              <span className="text-sm font-medium text-foreground/70 shrink-0">CA:</span>
              <span className="text-sm font-mono truncate text-foreground">{CA}</span>
              <button onClick={copyToClipboard} className="p-1.5 hover:bg-black/5 rounded-full transition-colors shrink-0" data-testid="button-copy-ca">
                <Copy className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="w-full md:w-1/2 mt-12 md:mt-0 relative flex justify-center z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md aspect-square">
              <img src="/bramble-hero.png" alt="Bramble the Hedgehog" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
          </motion.div>
        </section>

        {/* Lore Section */}
        <section id="about" className="py-24 px-4 sm:px-6 bg-white/30 backdrop-blur-sm relative">
          <motion.div className="max-w-3xl mx-auto text-center" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-secondary">The Keeper of Sunbell Meadow</h2>
            <div className="space-y-6 text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">
              <p>
                Bramble was born under the old apple tree at the edge of Sunbell Meadow, where morning light turns every blade of grass into gold. He was the smallest hedgehog in the valley, but he carried the largest bouquet because he believed every traveler deserved a flower before choosing a path.
              </p>
              <p>
                When the foxes started stealing seeds from the garden, Bramble gathered the meadow folk and built a new rule: nobody walks alone. Every holder became a tiny fence post, every meme became a daisy, and every raid became a trail of petals leading back home.
              </p>
              <p>
                Now Bramble wanders the hills with his flowers, guarding the garden, sharing warmth, and proving that the softest mascot can still have the sharpest spikes.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Chart Section */}
        <section className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-bold mb-10 text-center text-secondary">Watch the Meadow Grow</h2>
            <div className="bg-white/60 p-2 md:p-4 rounded-[24px] shadow-xl border border-white/80">
              <iframe 
                src="https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump?embed=1&theme=light&trades=0&info=0" 
                style={{ width: '100%', height: '500px', border: 'none', borderRadius: '16px' }}
                title="$BRAMBLE DexScreener Chart"
                className="bg-white"
              />
            </div>
          </motion.div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-24 px-4 sm:px-6 bg-secondary/10 relative">
          <div className="max-w-5xl mx-auto">
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-secondary" {...fadeIn}>From Seed to Meadow</motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { num: "01", title: "SPROUT", items: ["Launch identity, lock the meadow aesthetic", "Open X, publish first meme kit", "Start holder quests"] },
                { num: "02", title: "BLOOM", items: ["Community raids, sticker packs", "DEX visibility, token page polish", "Daily Bramble lore drops"] },
                { num: "03", title: "HARVEST", items: ["Mini game events, leaderboard seasons", "Creator contests, merch concepts", "Partner garden raids"] },
                { num: "04", title: "EVERGREEN", items: ["Expanded game mode, collectible badges", "Meadow quests, seasonal art", "Long-term holder rewards"] }
              ].map((phase, i) => (
                <motion.div key={phase.num} {...fadeIn} transition={{ delay: i * 0.1 }}>
                  <Card className="bg-white/70 backdrop-blur-sm border-white shadow-lg hover:shadow-xl transition-shadow h-full rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                    <CardContent className="p-8">
                      <div className="text-primary font-bold text-xl mb-1 opacity-70">Phase {phase.num}</div>
                      <h3 className="text-3xl font-bold text-secondary mb-6">{phase.title}</h3>
                      <ul className="space-y-3">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/80 font-medium">{item}</span>
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
        <section id="community" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-secondary">Join the Meadow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <a href="https://pump.fun/coin/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="bg-white hover:bg-primary/10 transition-colors border-white/50 shadow-md text-center h-full rounded-2xl">
                  <CardContent className="p-8 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">PumpFun</h3>
                      <p className="text-sm text-foreground/60 mt-1">Buy on Pump.fun</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
              <a href="https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="bg-white hover:bg-primary/10 transition-colors border-white/50 shadow-md text-center h-full rounded-2xl">
                  <CardContent className="p-8 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <div className="font-bold text-2xl">DX</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">DexScreener</h3>
                      <p className="text-sm text-foreground/60 mt-1">Live charts and trades</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
              <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="bg-white hover:bg-primary/10 transition-colors border-white/50 shadow-md text-center h-full rounded-2xl">
                  <CardContent className="p-8 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <div className="font-bold text-2xl">JUP</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Jupiter</h3>
                      <p className="text-sm text-foreground/60 mt-1">Swap on Jupiter</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a href="https://x.com/bramblelxg" target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="bg-[#000000] text-white hover:bg-black/80 transition-colors shadow-md rounded-2xl">
                  <CardContent className="p-6 flex items-center gap-4">
                    <SiX className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold">X/Twitter</h3>
                      <p className="text-sm text-white/70">Follow our updates</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
              <a href="https://t.me/brambletop" target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="bg-[#229ED9] text-white hover:bg-[#229ED9]/80 transition-colors shadow-md rounded-2xl">
                  <CardContent className="p-6 flex items-center gap-4">
                    <SiTelegram className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold">Telegram</h3>
                      <p className="text-sm text-white/70">Join the community</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Mini Game Section */}
        <section id="play" className="py-24 px-4 sm:px-6 bg-white/40 backdrop-blur-md">
          <motion.div className="max-w-4xl mx-auto text-center" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Run with Bramble</h2>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Roll through the meadow, collect flowers, dodge the foxes. How far can you go?
            </p>
            <MiniGame />
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">$BRAMBLE</h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="https://x.com/bramblelxg" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
              <SiX /> Twitter
            </a>
            <a href="https://t.me/brambletop" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
              <SiTelegram /> Telegram
            </a>
            <a href="https://dexscreener.com/solana/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              DexScreener
            </a>
            <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Jupiter
            </a>
            <a href="https://pump.fun/coin/4JPJLi59XP3NipggvjpdYTPPkSNK65rHjtAQren3pump" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              PumpFun
            </a>
          </div>
          
          <p className="text-sm opacity-80 max-w-2xl mx-auto mb-4 font-medium leading-relaxed">
            $BRAMBLE is a meme token. Just vibes and flowers. Not financial advice. Do your own research.
          </p>
          <p className="text-xs opacity-60">
            © 2026, Bramble. Guarding the meadow.
          </p>
        </div>
      </footer>
    </div>
  );
}
