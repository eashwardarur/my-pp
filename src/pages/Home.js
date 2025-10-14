import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: '📚',
    title: 'Personalized Learning',
    description: 'AI-powered course recommendations tailored to your learning style and progress.'
  },
  {
    icon: '🎯',
    title: 'Smart Assessments',
    description: 'Get instant feedback and personalized study plans based on your performance.'
  },
  {
    icon: '👨‍💻',
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with real-world experience.'
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Access your courses anytime, anywhere on any device.'
  },
  {
    icon: '🏆',
    title: 'Certification',
    description: 'Earn recognized certificates upon course completion.'
  },
  {
    icon: '🔄',
    title: 'Continuous Updates',
    description: 'Stay current with regularly updated course materials.'
  }
];

const testimonials = [
  {
    quote: "This platform transformed my learning experience. The AI recommendations were spot on!",
    author: "Sarah Johnson",
    role: "Student"
  },
  {
    quote: "As an instructor, I love how easy it is to create and manage my courses here.",
    author: "Michael Chen",
    role: "Instructor"
  },
  {
    quote: "The analytics helped me identify my weak areas and improve significantly.",
    author: "David Kim",
    role: "Professional"
  }
];

function Home() {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  const featureCardsRef = useRef([]);
  const testimonialCardsRef = useRef([]);
  
  // Initialize refs
  sectionsRef.current = [];
  featureCardsRef.current = [];
  testimonialCardsRef.current = [];

  const addToRefs = (el, refArray) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hero animation
    if (heroRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('[data-fade]'),
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }

    // Section animations
    sectionsRef.current.forEach((section, index) => {
      if (prefersReducedMotion) {
        gsap.set(section, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        section,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Feature cards animation
    featureCardsRef.current.forEach((card, index) => {
      if (!prefersReducedMotion) {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );
      } else {
        gsap.set(card, { opacity: 1 });
      }
    });

    // Testimonial cards animation
    testimonialCardsRef.current.forEach((card, index) => {
      if (!prefersReducedMotion) {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: index * 0.15,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );
      } else {
        gsap.set(card, { opacity: 1 });
      }
    });
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title" data-fade>Unlock Your Potential with AI‑Powered Learning</h1>
            <p className="hero-subtitle" data-fade>
              Experience personalized education tailored to your learning style, pace, and goals.
              Join thousands of students already transforming their careers.
            </p>
            <div className="cta-buttons" data-fade>
              <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
              <Link to="/features" className="btn btn-outline">Explore Features</Link>
            </div>
          </div>
          <div className="hero-visual" data-fade>
            <div className="hero-mockup">
              <div className="mockup-content">
                <h3>Interactive Learning Dashboard</h3>
                <p>Track your progress in real-time</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave"></div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={el => addToRefs(el, sectionsRef)}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div>
                <h3>10,000+</h3>
                <p>Students Enrolled</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div>
                <h3>500+</h3>
                <p>Courses Available</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🏫</div>
              <div>
                <h3>200+</h3>
                <p>Expert Instructors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={el => addToRefs(el, sectionsRef)}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform</h2>
            <p>Experience the future of learning with our cutting-edge features</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                className="feature-card" 
                key={index}
                ref={el => addToRefs(el, featureCardsRef)}
                style={{ opacity: 0 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" ref={el => addToRefs(el, sectionsRef)}>
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in just a few simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up & Set Goals</h3>
              <p>Create your account and tell us about your learning objectives.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Get Personalized Recommendations</h3>
              <p>Our AI analyzes your profile to suggest the perfect courses.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Start Learning</h3>
              <p>Dive into interactive lessons and track your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" ref={el => addToRefs(el, sectionsRef)}>
        <div className="container">
          <div className="section-header">
            <h2>What Our Students Say</h2>
            <p>Join thousands of satisfied learners</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                className="testimonial-card" 
                key={index}
                ref={el => addToRefs(el, testimonialCardsRef)}
                style={{ opacity: 0 }}
              >
                <div className="quote-icon">"</div>
                <p className="quote">{testimonial.quote}</p>
                <div className="author">
                  <div className="author-details">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={el => addToRefs(el, sectionsRef)}>
        <div className="container">
          <h2>Ready to transform your learning experience?</h2>
          <p>Join our community of lifelong learners today</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Start Learning Free</Link>
            <Link to="/courses" className="btn btn-outline">Browse Courses</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;