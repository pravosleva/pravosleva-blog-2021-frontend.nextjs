import 'react';

declare module 'react' {
  interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
