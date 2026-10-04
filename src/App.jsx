import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Eye,
  Heart,
  ShieldCheck,
  Sparkles,
  Wallet,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  CheckCircle2,
  Globe2,
  Users,
  LockKeyhole,
  BarChart3,
  HandHeart,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const features = [
  {
    icon: Eye,
    title: 'Radical transparency',
    text: 'Every campaign is designed around clear information, traceable activity, and visible impact.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust by design',
    text: 'Security, accountability, and responsible technology are built into the foundation of Mercyflow.',
  },
  {
    icon: Heart,
    title: 'Human-first impact',
    text: 'Technology stays in the background while people, communities, and meaningful causes stay at the center.',
  },
  {
    icon: Globe2,
    title: 'Borderless giving',
    text: 'We are building a future where meaningful support can move across communities and borders with greater clarity.',
  },
];

const principles = [
  {
    number: '01',
    title: 'Clarity',
    text: 'People should understand where their support goes and why it matters.',
  },
  {
    number: '02',
    title: 'Accountability',
    text: 'Impact should be measurable, visible, and supported by meaningful information.',
  },
  {
    number: '03',
    title: 'Accessibility',
    text: 'Giving should feel simple enough for anyone to participate.',
  },
  {
    number: '04',
    title: 'Technology',
    text: 'Modern infrastructure should make trust easier, not make generosity more complicated.',
  },
];

function App() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });

    setOpen(false);
  };

  const showAuth = (mode) => {
    setAuthMode(mode);
    setAuthMessage('');
    setAuthOpen(true);
    setOpen(false);
  };

  const closeAuth = () => {
    if (authLoading) return;

    setAuthOpen(false);
    setAuthMessage('');
    setEmail('');
    setPassword('');
  };

  const handleAuth = async (event) => {
    event.preventDefault();

    setAuthLoading(true);
    setAuthMessage('');

    if (password.length < 6) {
      setAuthMessage(
        'Password must contain at least 6 characters.'
      );
      setAuthLoading(false);
      return;
    }

    try {
      const result =
        authMode === 'signup'
          ? await supabase.auth.signUp({
              email,
              password,
            })
          : await supabase.auth.signInWithPassword({
              email,
              password,
            });

      if (result.error) {
        setAuthMessage(result.error.message);
        setAuthLoading(false);
        return;
      }

      if (authMode === 'signup' && !result.data.session) {
        setAuthMessage(
          'Account created. Please check your email to confirm your account.'
        );
        setAuthLoading(false);
        return;
      }

      setAuthMessage(
        authMode === 'signup'
          ? 'Your Mercyflow account has been created.'
          : 'Welcome back to Mercyflow.'
      );

      setAuthLoading(false);

      setTimeout(() => {
        setAuthOpen(false);
        setAuthMessage('');
        setEmail('');
        setPassword('');
      }, 1000);
    } catch (error) {
      setAuthMessage(
        error?.message || 'Something went wrong. Please try again.'
      );
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setUser(null);
    setOpen(false);
  };

  return (
    <div className="site-shell">
      {/* NAVIGATION */}
      <header className="nav">
        <a
          className="brand"
          href="#top"
          onClick={() => setOpen(false)}
        >
          <span className="brand-mark">
            <span>✦</span>
          </span>

          <span>
            mercy<span>flow</span>
          </span>
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <button onClick={() => scrollTo('mission')}>
            Mission
          </button>

          <button onClick={() => scrollTo('how')}>
            How it works
          </button>

          <button onClick={() => scrollTo('trust')}>
            Trust
          </button>

          <button onClick={() => scrollTo('vision')}>
            Vision
          </button>

          {user ? (
            <button
              className="auth-link"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Sign out
            </button>
          ) : (
            <>
              <button
                className="auth-link"
                onClick={() => showAuth('signin')}
              >
                <LogIn size={15} />
                Sign in
              </button>

              <button
                className="nav-signup"
                onClick={() => showAuth('signup')}
              >
                <UserPlus size={15} />
                Sign up
              </button>
            </>
          )}

          <button
            className="nav-cta"
            onClick={() => scrollTo('start')}
          >
            Get involved
            <ArrowRight size={16} />
          </button>
        </nav>

        <button
          className="menu-btn"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={14} />
              THE FUTURE OF TRANSPARENT GIVING
            </div>

            <h1>
              Let generosity
              <br />
              <span>flow with trust.</span>
            </h1>

            <p>
              Mercyflow is building a new foundation for giving:
              transparent, accountable, human-first, and powered
              by modern technology.
            </p>

            <p>
              Our mission is simple — make it easier for people
              to support meaningful causes while making the
              journey of impact easier to understand.
            </p>

            <div className="hero-actions">
              <button
                className="primary"
                onClick={() => showAuth('signup')}
              >
                Join Mercyflow
                <ArrowRight size={18} />
              </button>

              <button
                className="secondary"
                onClick={() => scrollTo('mission')}
              >
                Explore our mission
              </button>
            </div>

            {user && (
              <div className="signed-in-badge">
                <CheckCircle2 size={16} />
                Connected as {user.email}
              </div>
            )}

            <div className="hero-trust">
              <span>
                <CheckCircle2 size={15} />
                Transparency first
              </span>

              <span>
                <CheckCircle2 size={15} />
                Human-first
              </span>

              <span>
                <CheckCircle2 size={15} />
                Built for trust
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>

            <div className="hero-glow-card">
              <div className="mini-label">
                <span className="live-dot"></span>
                MERCYFLOW NETWORK
              </div>

              <div className="flow-symbol">
                ✦
              </div>

              <div className="flow-title">
                Giving
                <span>with purpose.</span>
              </div>

              <div className="flow-description">
                A transparent flow from generosity to
                measurable impact.
              </div>

              <div className="flow-bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="floating-card floating-card-one">
              <div className="floating-icon">
                <Heart size={18} />
              </div>

              <div>
                <strong>Human impact</strong>
                <small>Always at the center</small>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <div className="floating-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Trust by design</strong>
                <small>Built into the foundation</small>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-section">
          <div className="stat-item">
            <strong>01</strong>
            <span>Transparent by design</span>
          </div>

          <div className="stat-item">
            <strong>∞</strong>
            <span>Potential for global impact</span>
          </div>

          <div className="stat-item">
            <strong>24/7</strong>
            <span>Built for a connected world</span>
          </div>

          <div className="stat-item">
            <strong>1</strong>
            <span>Mission: meaningful impact</span>
          </div>
        </section>

        {/* MISSION */}
        <section
          className="section mission"
          id="mission"
        >
          <div className="section-heading">
            <div className="section-kicker">
              OUR MISSION
            </div>

            <h2>
              Giving should feel
              <br />
              <span>simple and trusted.</span>
            </h2>

            <p>
              Around the world, people want to help. But
              understanding where support goes, what happens
              next, and whether real impact was created can
              still be difficult.
            </p>

            <p>
              Mercyflow exists to help close that gap.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  className="feature-card"
                  key={feature.title}
                >
                  <div className="feature-icon">
                    <Icon size={21} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.text}</p>

                  <span className="feature-arrow">
                    <ChevronRight size={17} />
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          className="section how"
          id="how"
        >
          <div className="section-heading centered">
            <div className="section-kicker">
              HOW IT WORKS
            </div>

            <h2>
              A better flow for
              <br />
              <span>giving and impact.</span>
            </h2>

            <p>
              Mercyflow is being designed around a simple
              journey: discover meaningful causes, contribute
              with confidence, and follow the impact.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>

              <div className="step-icon">
                <Eye size={22} />
              </div>

              <h3>Discover</h3>

              <p>
                Explore causes, campaigns, and opportunities
                where your support can make a difference.
              </p>
            </div>

            <div className="step">
              <div className="step-number">02</div>

              <div className="step-icon">
                <HandHeart size={22} />
              </div>

              <h3>Contribute</h3>

              <p>
                Support meaningful initiatives through a
                simple and accessible experience.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>

              <div className="step-icon">
                <BarChart3 size={22} />
              </div>

              <h3>Follow the impact</h3>

              <p>
                See progress, activity, and meaningful
                information connected to the journey of your
                contribution.
              </p>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="section principles">
          <div className="section-heading">
            <div className="section-kicker">
              WHAT WE BELIEVE
            </div>

            <h2>
              Technology should
              <br />
              <span>strengthen trust.</span>
            </h2>

            <p>
              Mercyflow is not being built simply to add
              another technology layer to giving. We want
              technology to solve real problems and make
              meaningful participation easier.
            </p>
          </div>

          <div className="principle-grid">
            {principles.map((principle) => (
              <div
                className="principle-card"
                key={principle.number}
              >
                <span>{principle.number}</span>

                <h3>{principle.title}</h3>

                <p>{principle.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section
          className="section trust"
          id="trust"
        >
          <div className="trust-card">
            <div className="trust-visual">
              <div className="security-orbit orbit-a"></div>
              <div className="security-orbit orbit-b"></div>

              <div className="security-core">
                <LockKeyhole size={32} />
              </div>
            </div>

            <div className="trust-copy">
              <div className="section-kicker">
                TRUST & SECURITY
              </div>

              <h2>
                Transparency is not
                <br />
                <span>an extra feature.</span>
              </h2>

              <p>
                It is part of the foundation.
              </p>

              <p>
                Mercyflow is being built with accountability,
                responsible infrastructure, and security in
                mind from the beginning.
              </p>

              <div className="trust-points">
                <div>
                  <CheckCircle2 size={17} />
                  <span>Clear information</span>
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  <span>Responsible infrastructure</span>
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  <span>Accountability at every layer</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VISION */}
        <section
          className="section vision"
          id="vision"
        >
          <div className="vision-inner">
            <div className="section-kicker">
              THE LONG-TERM VISION
            </div>

            <h2>
              Imagine a world where
              <br />
              <span>every act of giving can flow further.</span>
            </h2>

            <p>
              Mercyflow starts with a simple idea: people
              deserve a better way to understand the impact of
              generosity.
            </p>

            <p>
              Over time, we envision an ecosystem connecting
              people, communities, organizations, technology,
              and transparent impact data into one trusted
              flow.
            </p>

            <div className="vision-pill">
              <Sparkles size={16} />
              THE FLOW STARTS HERE
            </div>
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="section community">
          <div className="community-card">
            <div className="community-icon">
              <Users size={28} />
            </div>

            <div>
              <div className="section-kicker">
                COMMUNITY
              </div>

              <h2>
                Mercyflow is being built
                <br />
                <span>with people, not just for people.</span>
              </h2>

              <p>
                Early supporters will have the opportunity to
                follow the project, provide feedback, and help
                shape the future direction of the platform.
              </p>
            </div>

            <button
              className="secondary"
              onClick={() => showAuth('signup')}
            >
              Join the community
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* START */}
        <section
          className="section start"
          id="start"
        >
          <div className="start-card">
            <div className="start-copy">
              <div className="eyebrow">
                <Wallet size={14} />
                MERCYFLOW IS GROWING
              </div>

              <h2>
                Be part of
                <br />
                the flow.
              </h2>

              <p>
                We are building the foundation now. Create
                your account, follow the progress, and become
                part of the early Mercyflow community.
              </p>
            </div>

            <div className="start-action">
              {user ? (
                <>
                  <div className="logged-card">
                    <CheckCircle2 size={20} />
                    <div>
                      <strong>You are in.</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <button
                    className="primary light"
                    onClick={handleLogout}
                  >
                    Sign out
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <button
                  className="primary light"
                  onClick={() => showAuth('signup')}
                >
                  Create your account
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-mark">
              <span>✦</span>
            </span>

            <span>
              mercy<span>flow</span>
            </span>
          </div>

          <p>
            Building a more transparent future for giving.
          </p>

          <button
            className="footer-button"
            onClick={() => scrollTo('top')}
          >
            Back to top
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Mercyflow. Building with purpose.
          </span>

          <span>
            Transparency · Trust · Impact
          </span>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {authOpen && (
        <div
          className="auth-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={
            authMode === 'signin'
              ? 'Sign in'
              : 'Sign up'
          }
          onClick={closeAuth}
        >
          <div
            className="auth-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="auth-close"
              aria-label="Close"
              onClick={closeAuth}
            >
              <X size={20} />
            </button>

            <div className="auth-icon">
              {authMode === 'signin' ? (
                <LogIn size={22} />
              ) : (
                <UserPlus size={22} />
              )}
            </div>

            <div className="section-kicker">
              {authMode === 'signin'
                ? 'WELCOME BACK'
                : 'JOIN MERCYFLOW'}
            </div>

            <h2>
              {authMode === 'signin'
                ? 'Sign in to Mercyflow'
                : 'Create your Mercyflow account'}
            </h2>

            <p>
              {authMode === 'signin'
                ? 'Continue your journey with Mercyflow.'
                : 'Create an account and become part of the early Mercyflow community.'}
            </p>

            <form
              onSubmit={handleAuth}
              style={{
                display: 'grid',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
              />

              <input
                type="password"
                placeholder="Password — minimum 6 characters"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={6}
                autoComplete={
                  authMode === 'signin'
                    ? 'current-password'
                    : 'new-password'
                }
              />

              {authMessage && (
                <div className="auth-message">
                  <CheckCircle2 size={16} />
                  <span>{authMessage}</span>
                </div>
              )}

              <button
                className="primary auth-action"
                type="submit"
                disabled={authLoading}
              >
                {authLoading
                  ? 'Please wait…'
                  : authMode === 'signin'
                    ? 'Sign in'
                    : 'Create account'}
              </button>
            </form>

            <button
              className="auth-switch"
              onClick={() => {
                setAuthMode(
                  authMode === 'signin'
                    ? 'signup'
                    : 'signin'
                );

                setAuthMessage('');
              }}
            >
              {authMode === 'signin'
                ? 'Need an account? Sign up'
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
