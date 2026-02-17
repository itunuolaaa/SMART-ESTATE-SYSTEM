import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Home, Settings, Shield, BarChart3, Bell, ArrowRight, CheckCircle } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="navbar"
      >
        <div className="nav-container">
          <div className="nav-logo">SmartEstate</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="nav-cta"
            onClick={handleGetStarted}
          >
            Sign In
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1 className="hero-title">Smart Estate Management Made Simple</h1>
          <p className="hero-subtitle">
            Comprehensive solutions for residents, landlords, administrators, and security personnel.
            Manage your property with ease and efficiency.
          </p>
          <div className="hero-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              onClick={handleGetStarted}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-visual"
        >
          <div className="hero-placeholder">
            {/* Abstract Visual Representation */}
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={120} color="rgba(15, 118, 110, 0.2)" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{ position: 'absolute', top: '20%', right: '20%' }}
              >
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={24} color="#10B981" />
                  <span style={{ fontWeight: '600', color: '#0F172A' }}>Rent Paid</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                style={{ position: 'absolute', bottom: '20%', left: '10%' }}
              >
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bell size={24} color="#F59E0B" />
                  <span style={{ fontWeight: '600', color: '#0F172A' }}>New Visitor</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Powerful Features for Everyone
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="features-grid"
        >
          {/* Feature Card 1 */}
          <motion.div variants={fadeInUp} className="feature-card">
            <div className="feature-icon"><ClipboardList size={40} color="#0F766E" /></div>
            <h3>Resident Dashboard</h3>
            <p>Manage your apartment details, view announcements, and communicate with property management effortlessly.</p>
          </motion.div>

          {/* Feature Card 2 */}
          <motion.div variants={fadeInUp} className="feature-card">
            <div className="feature-icon"><Home size={40} color="#0F766E" /></div>
            <h3>Landlord Portal</h3>
            <p>Monitor properties, track residents, manage finances, and stay updated on all property-related activities.</p>
          </motion.div>

          {/* Feature Card 3 */}
          <motion.div variants={fadeInUp} className="feature-card">
            <div className="feature-icon"><Settings size={40} color="#0F766E" /></div>
            <h3>Admin Control</h3>
            <p>Complete oversight of the estate system. Manage users, residents, announcements, and emergency protocols.</p>
          </motion.div>

          {/* Feature Card 4 */}
          <motion.div variants={fadeInUp} className="feature-card">
            <div className="feature-icon"><Shield size={40} color="#0F766E" /></div>
            <h3>Security Management</h3>
            <p>Comprehensive security tracking, visitor logs, incident reporting, and real-time estate monitoring.</p>
          </motion.div>

          {/* Feature Card 5 */}
          <motion.div variants={fadeInUp} className="feature-card">
            <div className="feature-icon"><BarChart3 size={40} color="#0F766E" /></div>
            <h3>Analytics & Reports</h3>
            <p>Generate detailed reports and analytics to gain insights into estate operations and performance.</p>
          </motion.div>

          {/* Feature Card 6 */}
          <motion.div variants={fadeInUp} className="feature-card">
            <div className="feature-icon"><Bell size={40} color="#0F766E" /></div>
            <h3>Real-time Notifications</h3>
            <p>Stay informed with instant updates on announcements, maintenance schedules, and important events.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
        >
          How It Works
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="steps-container"
        >
          <motion.div variants={fadeInUp} className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account and select your role within the estate ecosystem.</p>
          </motion.div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <motion.div variants={fadeInUp} className="step">
            <div className="step-number">2</div>
            <h3>Configure</h3>
            <p>Set up your profile and preferences based on your role.</p>
          </motion.div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <motion.div variants={fadeInUp} className="step">
            <div className="step-number">3</div>
            <h3>Manage</h3>
            <p>Access all tools and features tailored to your role.</p>
          </motion.div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <motion.div variants={fadeInUp} className="step">
            <div className="step-number">4</div>
            <h3>Succeed</h3>
            <p>Enjoy efficient estate management and improved operations.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="cta-section"
      >
        <h2>Ready to Transform Your Estate Management?</h2>
        <p>Join hundreds of satisfied users managing their estates efficiently with SmartEstate.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-large"
          onClick={handleGetStarted}
        >
          Start Free Today
        </motion.button>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 SmartEstate. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
