import type React from 'react';

interface ParallaxContainerProps {
  children: React.ReactNode;
}

export function ParallaxContainer({ children }: ParallaxContainerProps) {
  return (
    <main className="pt-16">
      {children}
    </main>
  );
}
