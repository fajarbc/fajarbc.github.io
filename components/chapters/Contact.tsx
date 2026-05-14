import type { ComponentType } from 'react';
import { ChapterSection } from '@/components/layout/ChapterSection';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { SpriteAnimation } from '@/components/SpriteAnimation';
import { socialLinks } from '@/data';
import { Github, Linkedin, Mail } from 'lucide-react';

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Github,
  Linkedin,
  Mail,
};

const fullName = process.env.FULL_NAME || 'Fajar Budi Cahyanto';
const jobTitle = process.env.JOB_TITLE || 'AI Infrastructure & Cloud Architect';

export function Contact() {
  return (
    <ChapterSection id="contact" aria-label="Contact" className="flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Sprite Animation */}
        <ScrollReveal delay={200}>
          <div className="flex justify-center mb-8">
            <SpriteAnimation
              src="/fajar-sprite-sheet.png"
              frameWidth={200}
              frameHeight={200}
              columns={3}
              rows={3}
              size={120}
              className="rounded-full"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Let's Connect
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
            {fullName}
          </p>
          <p className="text-base md:text-lg text-white/70 mb-8">
            {jobTitle}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={500}>
          <div className="flex items-center justify-center gap-6 mb-10">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon];
              const isExternal = link.platform !== 'email';

              return (
                <a
                  key={link.platform}
                  href={link.url}
                  aria-label={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  {...(isExternal && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                  className="inline-flex items-center justify-center min-h-11 min-w-11 p-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                >
                  {Icon && <Icon className="w-6 h-6" />}
                </a>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={600}>
          <a
            href={`mailto:${process.env.CONTACT_EMAIL || 'email@example.com'}`}
            className="inline-flex items-center justify-center min-h-11 min-w-11 px-8 py-3 rounded-full bg-white text-slate-900 font-semibold text-lg hover:bg-white/90 transition-colors duration-200 cursor-pointer"
          >
            Get in Touch
          </a>
        </ScrollReveal>
      </div>
    </ChapterSection>
  );
}
