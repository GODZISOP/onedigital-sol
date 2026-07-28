import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Contact.module.css';

export default function ContactPage() {
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
              <span>[Client's new email address here]</span>
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
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Name</label>
              <input className={styles.input} type="text" id="name" placeholder="Your Name" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input className={styles.input} type="email" id="email" placeholder="Your Email" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="subject">Subject</label>
              <input className={styles.input} type="text" id="subject" placeholder="What is this regarding?" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="message">Message</label>
              <textarea className={styles.textarea} id="message" placeholder="How can we help you?"></textarea>
            </div>

            <button type="button" className={styles.submitBtn}>Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
}
