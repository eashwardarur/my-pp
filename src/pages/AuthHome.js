import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

function AuthHome() {
  const navigate = useNavigate();
  const { user, enrolledCourses, progress } = useAuth();

  const rootRef = useRef(null);
  const sectionsRef = useRef([]);
  const cardsRef = useRef([]);
  const animationsRef = useRef([]);

  const addSection = (el) => { if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el); };
  const addCard = (el) => { if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el); };

  const validate = (el) => !!(el && el.isConnected && document.contains(el));

  useEffect(() => {
    // Kill previous
    animationsRef.current.forEach(a => a?.kill?.());
    animationsRef.current = [];
    ScrollTrigger.getAll().forEach(t => t?.kill?.());

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hero reveal
    if (!prefersReducedMotion && validate(rootRef.current)) {
      const heroEls = Array.from(rootRef.current.querySelectorAll('[data-hero]')).filter(validate);
      if (heroEls.length) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(heroEls, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 });
        animationsRef.current.push(tl);
      }
    }

    // Section scroll-reveals
    sectionsRef.current.filter(validate).forEach((sec) => {
      const anim = gsap.fromTo(sec, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sec, start: 'top 85%', toggleActions: 'play none none none' }
      });
      animationsRef.current.push(anim);
    });

    // Cards
    cardsRef.current.filter(validate).forEach((card, i) => {
      const anim = gsap.fromTo(card, { y: 30, opacity: 0, scale: 0.98 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.05,
        scrollTrigger: { trigger: card, start: 'top 90%' }
      });
      animationsRef.current.push(anim);
    });

    return () => {
      animationsRef.current.forEach(a => a?.kill?.());
      animationsRef.current = [];
      ScrollTrigger.getAll().forEach(t => t?.kill?.());
    };
  }, []);

  const total = enrolledCourses.length;
  const completed = enrolledCourses.filter(c => (progress[c.id]?.completedLessons || 0) >= (progress[c.id]?.totalLessons || c.totalLessons || 0)).length;

  const quickActions = [
    { label: 'Explore Courses', to: '/courses', primary: true },
    { label: 'My Learning', to: '/my-learning' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Profile', to: '/profile' },
  ];

  const recommended = enrolledCourses.length ? enrolledCourses : [
    { id: 'react-101', title: 'React 101', hint: 'Continue where you left off' },
    { id: 'ai-basics', title: 'AI & ML Basics', hint: 'Strengthen your foundations' },
  ];

  return (
    <div ref={rootRef} className="app-auth-home">
      {/* Hero */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <h1 className="heroTitle" data-hero>Welcome back{user?.name ? `, ${user.name}` : ''} 👋</h1>
          <p className="heroSubtitle" data-hero>
            Pick up your learning where you paused, discover new courses, and track your progress — all in one place.
          </p>
          <div className="ctaRow" data-hero>
            {quickActions.map((a, idx) => (
              <Link key={idx} to={a.to} className={`btn ${a.primary ? 'btnPrimary' : 'btnGhost'}`}>{a.label}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" ref={addSection}>
        <div className="container grid-3">
          <div className="card" ref={addCard}>
            <h3>Enrolled Courses</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{total}</p>
          </div>
          <div className="card" ref={addCard}>
            <h3>Completed</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{completed}</p>
          </div>
          <div className="card" ref={addCard}>
            <h3>Streak</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{(user?.streak ?? 0)} days</p>
          </div>
        </div>
      </section>

      {/* Continue / Recommended */}
      <section className="section features-section" ref={addSection}>
        <div className="container">
          <h2 className="section-title centered">Continue Learning</h2>
          <div className="grid-3">
            {recommended.map((c) => (
              <div key={c.id} className="card" ref={addCard}>
                <h3>{c.title}</h3>
                {c.hint && <p style={{ color: 'var(--text-muted)' }}>{c.hint}</p>}
                <div className="ctaRow">
                  <button className="btn btnPrimary" onClick={() => navigate(`/my-learning/${c.id}`)}>Open</button>
                  <Link to={`/courses/${c.id}`} className="btn btnGhost">Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="section" ref={addSection}>
        <div className="container grid-3">
          <div className="card" ref={addCard}>
            <h3>Tip: Set daily goals</h3>
            <p>Small, consistent steps compound. Try completing one lesson per day.</p>
          </div>
          <div className="card" ref={addCard}>
            <h3>Practice makes perfect</h3>
            <p>Use practice quizzes to reinforce concepts you learned today.</p>
          </div>
          <div className="card" ref={addCard}>
            <h3>Explore beyond comfort</h3>
            <p>Pick a new category each week to broaden your knowledge.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthHome;
