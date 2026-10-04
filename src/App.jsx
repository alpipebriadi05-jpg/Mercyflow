import React from 'react';
import { ArrowRight, Eye, Heart, ShieldCheck, Sparkles, Wallet, CheckCircle2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const features = [
  { icon: Eye, title: 'Radical transparency', text: 'Every campaign is designed around clear information, traceable activity, and visible impact.' },
  { icon: ShieldCheck, title: 'Trust by design', text: 'Built with security and accountability in mind, so generosity can move with confidence.' },
  { icon: Heart, title: 'Human-first impact', text: 'Technology stays in the background. The people and causes that matter stay at the center.' },
];

function App() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="nav">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="brand-mark"><span>✦</span></span>
          <span>mercy<span>flow</span></span>
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <button onClick={() => scrollTo('mission')}>Mission</button>
          <button onClick={() => scrollTo('how')}>How it works</button>
          <button onClick={() => scrollTo('trust')}>Trust</button>
          <button className="nav-cta" onClick={() => scrollTo('start')}>Get involved <ArrowRight size={16}/></button>
        </nav>

        <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow glow-one"></div>
          <div className="hero-glow glow-two"></div>
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14}/> A new standard for meaningful giving</div>
            <h1>Give with clarity.<br/><em>Create lasting impact.</em></h1>
            <p className="hero-text">Mercyflow is building a transparent way to turn compassion into action — connecting people, trusted causes, and verifiable impact.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => scrollTo('start')}>Explore Mercyflow <ArrowRight size={18}/></button>
              <button className="secondary" onClick={() => scrollTo('mission')}>Our mission</button>
            </div>
            <div className="hero-note"><CheckCircle2 size={16}/> Built for transparency from day one</div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-a"></div><div className="orbit orbit-b"></div>
            <div className="impact-card">
              <div className="card-top"><span>IMPACT FLOW</span><span className="live-dot">● LIVE</span></div>
              <div className="impact-value">$24,680<span>+</span></div>
              <div className="impact-label">Community impact tracked</div>
              <div className="flow-line"><span></span><i></i><span></span><i></i><span></span></div>
              <div className="flow-labels"><span>Community</span><span>Mercyflow</span><span>Impact</span></div>
            </div>
            <div className="floating-pill pill-one"><Heart size={15}/> 1,284 contributions</div>
            <div className="floating-pill pill-two"><ShieldCheck size={15}/> Transparent by design</div>
          </div>
        </section>

        <section className="trust-strip" id="trust">
          <span>DESIGNED AROUND</span>
          <strong>Transparency</strong><b>•</b><strong>Accountability</strong><b>•</b><strong>Human impact</strong><b>•</b><strong>Open technology</strong>
        </section>

        <section className="section mission" id="mission">
          <div className="section-kicker">01 — WHY MERCYFLOW</div>
          <div className="two-col">
            <h2>Compassion deserves <em>clarity.</em></h2>
            <div>
              <p className="lead">Giving should feel powerful, not uncertain. Mercyflow is being built to make the journey from contribution to real-world impact easier to understand.</p>
              <p>We combine thoughtful product design with transparent infrastructure so communities can see where value moves, what it supports, and what changes because of it.</p>
            </div>
          </div>
          <div className="feature-grid">
            {features.map(({icon: Icon, title, text}) => (
              <article className="feature" key={title}>
                <div className="feature-icon"><Icon size={21}/></div>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section how" id="how">
          <div className="section-kicker">02 — HOW IT WORKS</div>
          <div className="section-heading"><h2>Simple for people.<br/><em>Built for trust.</em></h2><p>Mercyflow is designed to make every step understandable — from discovering a cause to seeing its impact.</p></div>
          <div className="steps">
            {[['01','Discover','Find causes and initiatives that deserve attention.'],['02','Contribute','Support a campaign through a simple, accessible flow.'],['03','Verify','Follow transparent activity and evidence of progress.'],['04','Impact','See contributions move toward meaningful outcomes.']].map(([n,t,d]) => (
              <div className="step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>
            ))}
          </div>
        </section>

        <section className="section vision">
          <div className="vision-card">
            <div className="section-kicker">03 — THE VISION</div>
            <h2>Technology should make <em>trust easier.</em></h2>
            <p>Today, Mercyflow starts with the experience. Tomorrow, transparent data, wallets, and blockchain infrastructure can strengthen the connection between generosity and measurable impact.</p>
            <button className="text-link" onClick={() => scrollTo('start')}>Follow the journey <ArrowRight size={17}/></button>
          </div>
        </section>

        <section className="section start" id="start">
          <div className="start-card">
            <div>
              <div className="eyebrow"><Wallet size={14}/> Mercyflow is growing</div>
              <h2>Be part of the flow.</h2>
              <p>We are building the foundation now. Join early, follow the progress, and help shape a more transparent future for giving.</p>
            </div>
            <button className="primary light" onClick={() => window.location.href='mailto:hello@mercyflow.org'}>Connect with Mercyflow <ArrowRight size={18}/></button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="brand"><span className="brand-mark"><span>✦</span></span><span>mercy<span>flow</span></span></div>
        <p>Give with clarity. Create lasting impact.</p>
        <span>© 2026 Mercyflow</span>
      </footer>
    </div>
  );
}

export default App;