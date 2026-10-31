import React, { useState } from 'react';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
} from 'react-icons/fa';
import AlertBanner from '../components/common/AlertBanner';

const FAQS = [
  {
    q: 'How are accessibility features verified on AccessAble?',
    a: 'Locations submitted to AccessAble undergo a multi-tier review process. Community members submit photos and detailed descriptions of entrances, ramp slopes, elevator dimensions, and restrooms. Our volunteer auditors cross-check these submissions against ADA and local building guidelines before approving public listings.',
  },
  {
    q: 'How is the Accessibility Score calculated?',
    a: 'Each place is audited against 11 Universal Accessibility Checkpoints (such as wheelchair ramps, braille signage, hearing assistance, and accessible restrooms). The percentage score represents the proportion of these checkpoints fully verified and available at that venue.',
  },
  {
    q: 'Can venue owners update or add their business accessibility details?',
    a: 'Yes! Business and property managers are encouraged to register and suggest their venue or provide updated photos and equipment details. Once verified, venue managers can receive verified partner badges.',
  },
  {
    q: 'What should I do if an elevator or ramp is temporarily broken?',
    a: 'You can tap the "Report Issue" button on any place page to flag broken elevators, temporary maintenance, or inaccurate information. Our team reviews flags promptly to alert other travelers.',
  },
  {
    q: 'Is the platform compliant with accessibility standards?',
    a: 'Yes, AccessAble adheres to Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. We feature high-contrast modes, dyslexia-friendly typography, font scaling, keyboard-friendly navigation, and semantic ARIA labeling throughout the entire app.',
  },
];

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setAlert({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setSubmitted(true);
    setAlert({
      type: 'success',
      message: 'Thank you! Your message has been sent to our accessibility support team.',
    });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? -1 : idx);
  };

  return (
    <div className="contact-page section" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span className="section-subtitle-tag">Get in Touch</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            We're Here to Help
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Have questions about an accessibility audit, partner inquiries, or accessibility feedback?
            Reach out to our dedicated team.
          </p>
        </div>

        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4.5rem',
            alignItems: 'start',
          }}
        >
          {/* Contact Form */}
          <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contactName" className="form-label">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  className="form-control"
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactSubject" className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  id="contactSubject"
                  className="form-control"
                  placeholder="e.g. Accessibility Audit Request, Partnership"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactMessage" className="form-label">
                  Message Details *
                </label>
                <textarea
                  id="contactMessage"
                  className="form-control"
                  rows="4"
                  placeholder="How can our accessibility support specialists assist you?..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontWeight: 700 }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Office Card */}
          <div>
            <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>
                Contact Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>
                      Email Support
                    </h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                      For general questions & audits:
                    </p>
                    <a href="mailto:contact@accessable.org" style={{ fontWeight: 600 }}>
                      contact@accessable.org
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#f5f3ff',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FaPhoneAlt size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>
                      Toll-Free Helpline
                    </h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                      Monday - Friday: 9am - 6pm EST
                    </p>
                    <a href="tel:+18005552253" style={{ fontWeight: 600 }}>
                      +1 (800) 555-ABLE (2253)
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>
                      Headquarters
                    </h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                      AccessAble Accessibility Initiative<br />
                      450 Lexington Ave, Suite 1200<br />
                      New York, NY 10017, United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                border: '1px solid #bfdbfe',
              }}
            >
              <h4 style={{ color: '#1e40af', fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
                Emergency Accessibility Needs?
              </h4>
              <p style={{ color: '#1e3a8a', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                If you are currently stranded due to an unexpected barrier at a public transit hub,
                call our volunteer dispatch line at +1 (800) 555-2253 option 1.
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Accordion */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle-tag">FAQ</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: isOpen ? '#2563eb' : '#0f172a',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.25rem 1.5rem',
                        color: '#475569',
                        fontSize: '0.95rem',
                        lineHeight: 1.65,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
