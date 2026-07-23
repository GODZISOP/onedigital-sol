'use client';

import { ReactNode } from 'react';

export default function ScrollReveal({ children }: { children: ReactNode }) {
  return (
    <div data-aos="fade-up">
      {children}
    </div>
  );
}
