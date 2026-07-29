'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [messageText, setMessageText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setMessageText('Please fill out all fields.');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      if (resData.success) {
        setStatus('success');
        setMessageText('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setMessageText(resData.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessageText('Something went wrong. Please try again later.');
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>
          Have a question or need to place a custom order? We're here to help!
        </p>
      </section>

      <section className={styles.content}>
        <div className={styles.infoSection}>
          <h2>Get In Touch</h2>
          
          <div className={styles.contactItem}>
            <Phone className={styles.icon} size={24} />
            <div className={styles.itemText}>
              <strong>Phone</strong>
              <span>(910) 865-1070</span>
              <span className={styles.subText}>(Ask for Amber or Brian)</span>
            </div>
          </div>

          <div className={styles.contactItem}>
            <Mail className={styles.icon} size={24} />
            <div className={styles.itemText}>
              <strong>Email</strong>
              <span>appointmentstudio@gmail.com</span>
              <span className={styles.subText}>For custom orders and inquiries</span>
            </div>
          </div>

          <div className={styles.contactItem}>
            <MapPin className={styles.icon} size={24} />
            <div className={styles.itemText}>
              <strong>Location</strong>
              <span>781 Tobermory Rd.</span>
              <span>Fayetteville, NC 28306</span>
            </div>
          </div>

          <div className={styles.contactItem}>
            <Clock className={styles.icon} size={24} />
            <div className={styles.itemText}>
              <strong>Hours</strong>
              <span>Mon - Thurs: 9AM - 5PM</span>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Send a Message</h2>
          {status === 'success' && <div style={{ color: '#155724', backgroundColor: '#d4edda', borderColor: '#c3e6cb', padding: '0.75rem 1.25rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid transparent' }}>{messageText}</div>}
          {status === 'error' && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', borderColor: '#f5c6cb', padding: '0.75rem 1.25rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid transparent' }}>{messageText}</div>}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Name</label>
              <input className={styles.input} type="text" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input className={styles.input} type="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="subject">Subject</label>
              <input className={styles.input} type="text" id="subject" placeholder="What is this regarding?" value={formData.subject} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="message">Message</label>
              <textarea className={styles.textarea} id="message" placeholder="How can we help you?" value={formData.message} onChange={handleChange} required></textarea>
            </div>

            <button type="submit" disabled={status === 'sending'} className={styles.submitBtn}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
