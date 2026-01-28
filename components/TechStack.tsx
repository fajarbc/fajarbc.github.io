import React, { useRef, useState, useEffect } from 'react';
import { Server, Brain, Code, Cloud } from 'lucide-react';
import { TechCategory } from '../types';
import Matter from 'matter-js';

const categories: TechCategory[] = [
  {
    title: "Cloud Native & DevOps",
    items: ["Docker", "AWS", "GCP", "Terraform", "RabbitMQ", "GitLab CI/CD", "GitHub Actions", "Bash Scripting", "Nginx", "GKE (Kubernetes)"],
    color: "cyan"
  },
  {
    title: "AI & Data Engineering",
    items: ["YOLO", "TensorFlow", "Computer Vision", "LLM", "MLflow", "AI Inference Serving"],
    color: "purple"
  },
  {
    title: "Core Backend",
    items: ["Node.js", "Go (Golang)", "PHP", "Python", "MySQL", "PostgreSQL", "InfluxDB", "MongoDB", "Redis", "GraphQL", "gRPC"],
    color: "emerald"
  },
  {
    title: "Frontend & Mobile",
    items: ["React", "TypeScript", "Vite", "Tailwind", "Bootstrap", "PWA", "Flutter", "WebSockets", "REST APIs"],
    color: "blue"
  },
  {
    title: "Monitoring & Observability",
    items: ["Prometheus", "Grafana", "Node Exporter", "Alertmanager", "CloudWatch"],
    color: "orange"
  }
];

const TechStack: React.FC = () => {
  const cloudTagsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const blackHoleContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  // Animation State Management
  const [animationState, setAnimationState] = useState<'idle' | 'expanding' | 'collapsing' | 'resetting' | 'reappearing'>('idle');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // State for AI items (for sorting Easter egg)
  const [aiItems, setAiItems] = useState<string[]>(categories[1].items);

  // Cleanup helper
  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const addTimeout = (cb: () => void, ms: number) => {
    const id = setTimeout(cb, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const hardResetPhysics = () => {
    clearTimeouts();
    if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
        runnerRef.current = null;
    }
    // Force DOM reset
    cloudTagsRef.current.forEach(el => {
        if (el) {
            el.style.cssText = ''; 
            el.style.opacity = '1';
        }
    });
    setAnimationState('idle');
  };

  const startResetSequence = () => {
    // 1. Stop Physics Engine
    if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
        runnerRef.current = null;
    }

    // 2. Prepare elements for reappearance (hidden in grid)
    cloudTagsRef.current.forEach(el => {
        if (el) {
            // Strip all physics-related inline styles but keep them hidden
            el.style.position = '';
            el.style.left = '';
            el.style.top = '';
            el.style.width = '';
            el.style.height = '';
            el.style.margin = '';
            el.style.zIndex = '';
            el.style.transform = '';
            el.style.opacity = '0';
        }
    });

    // 3. Trigger Black Hole Shrink
    setAnimationState('resetting');

    // 4. After Shrink (1s), Trigger Text Fade In
    addTimeout(() => {
        setAnimationState('reappearing');
    }, 1100);

    // 5. Back to Idle
    addTimeout(() => {
        cloudTagsRef.current.forEach(el => {
            if (el) {
                el.style.cssText = ''; 
                el.style.opacity = '1'; // Ensure explicitly visible
            }
        });
        setAnimationState('idle');
    }, 2600); // 1.1s + 1.5s fade
  };

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => hardResetPhysics();
  }, []);

  const initPhysics = () => {
    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Events = Matter.Events,
          Body = Matter.Body,
          Vector = Matter.Vector;

    const engine = Engine.create();
    // Slow motion physics
    engine.timing.timeScale = 0.3; 
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engineRef.current = engine;

    // Target (Black Hole) Position
    const targetEl = blackHoleContainerRef.current;
    if (!targetEl) return;
    const targetRect = targetEl.getBoundingClientRect();
    const targetX = targetRect.left + (targetRect.width / 2);
    const targetY = targetRect.top + (targetRect.height / 2) + 50; 

    const bodies: { body: Matter.Body, element: HTMLElement }[] = [];
    
    // Setup Bodies (initially static)
    cloudTagsRef.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        
        el.style.width = `${rect.width}px`;
        el.style.height = `${rect.height}px`;
        
        const body = Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                isStatic: true, 
                restitution: 0.5,
                frictionAir: 0.05,
                angle: (Math.random() - 0.5) * 0.2
            }
        );
        
        el.style.position = 'fixed';
        el.style.left = '0';
        el.style.top = '0';
        el.style.margin = '0';
        el.style.zIndex = '100'; 
        el.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
        
        bodies.push({ body, element: el });
    });

    Composite.add(engine.world, bodies.map(b => b.body));

    // Game Loop
    Events.on(engine, 'afterUpdate', () => {
        bodies.forEach(({ body, element }) => {
            if (body.isStatic) return;

            const dx = targetX - body.position.x;
            const dy = targetY - body.position.y;
            const distSq = dx * dx + dy * dy;
            const distance = Math.sqrt(distSq);

            // Event Horizon
            if (distance < 50) {
                 element.style.opacity = '0';
                 element.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
                 Composite.remove(engine.world, body);
                 return;
            }

            // Gravity
            const forceStrength = 1.0; 
            const force = Vector.create(dx / distance, dy / distance);
            const magnitude = Math.min(forceStrength / (distance * 0.1), 0.2); 
            
            Body.applyForce(body, body.position, Vector.mult(force, magnitude));

            // Sync visual
            const x = body.position.x - element.offsetWidth / 2;
            const y = body.position.y - element.offsetHeight / 2;
            
            element.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
        });
    });

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Sequence: Release bodies one by one
    const shuffledIndices = bodies.map((_, i) => i).sort(() => Math.random() - 0.5);
    
    shuffledIndices.forEach((index, i) => {
        addTimeout(() => {
            if (!engineRef.current) return;
            const body = bodies[index].body;
            Body.setStatic(body, false);
            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
        }, i * 300);
    });
  };

  const triggerSequence = () => {
    if (animationState !== 'idle') return;

    // 1. Start Expansion
    setAnimationState('expanding');

    // 2. Start Collapse (Physics)
    addTimeout(() => {
        setAnimationState('collapsing');
        initPhysics();
    }, 2500);

    // 3. Start Reset Sequence (Shrink hole -> Fade in text)
    // Decreased wait time from 10000 to 6500 to reduce the "long delay"
    addTimeout(() => {
        startResetSequence();
    }, 6500);
  };

  // Easter Egg: Sort AI items
  const handleSortAi = () => {
    setAiItems(prev => [...prev].sort((a, b) => a.localeCompare(b)));
  };

  // Calculate years of experience from start date
  const calculateYearsExperience = () => {
    const startDate = process.env.CAREER_START_DATE || '2018-01-01';
    const start = new Date(startDate);
    const now = new Date();
    const years = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    return years > 0 ? `${years}+` : '7+';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {/* Large Block - Cloud */}
      <div className="md:col-span-4 rounded-xl border border-slate-800 bg-slate-900/30 p-6 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 text-slate-800/20 group-hover:text-cyan-900/20 transition-colors duration-500">
          <Cloud size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <Server className="text-cyan-500" size={20} />
             <h3 className="text-lg font-bold text-slate-200 font-mono">Cloud Infrastructure</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories[0].items.map((item, idx) => (
              <span 
                key={item} 
                ref={el => { cloudTagsRef.current[idx] = el; }}
                className={`
                  px-3 py-1.5 text-sm bg-cyan-950/30 border border-cyan-900/50 text-cyan-200 rounded hover:bg-cyan-900/50 transition-colors cursor-default
                  ${animationState === 'expanding' ? 'animate-rumble' : ''} 
                  ${animationState === 'reappearing' ? 'animate-fade-in-slow' : ''}
                `}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Medium Block - AI */}
      <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/30 p-6 relative overflow-hidden group">
         <div className="absolute -right-4 -bottom-4 text-slate-800/20 group-hover:text-purple-900/20 transition-colors duration-500">
          <Brain size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <Brain className="text-purple-500" size={20} />
             <h3 className="text-lg font-bold text-slate-200 font-mono">AI / ML</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiItems.map(item => (
              <span key={item} className="px-3 py-1.5 text-sm bg-purple-950/30 border border-purple-900/50 text-purple-200 rounded hover:bg-purple-900/50 transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Wide Block - Backend */}
      <div className="md:col-span-3 rounded-xl border border-slate-800 bg-slate-900/30 p-6 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 relative">
             {/* Container for Black Hole / Icon Switch */}
             <div ref={blackHoleContainerRef} className="relative w-6 h-6 flex items-center justify-center">
                 {animationState === 'idle' && (
                     <Code className="text-emerald-500" size={20} />
                 )}
                 {animationState === 'reappearing' && (
                     <Code className="text-emerald-500 animate-fade-in-slow" size={20} />
                 )}
                 
                 {/* Black Hole Logic */}
                 {animationState !== 'idle' && animationState !== 'reappearing' && (
                     <div className={`absolute z-50 top-[50px] ${animationState === 'expanding' ? 'animate-rumble' : ''}`}>
                         <div 
                            className={`
                                rounded-full bg-black shadow-[0_0_30px_#a855f7]
                                ${animationState === 'expanding' ? 'animate-grow' : ''}
                                ${animationState === 'collapsing' ? 'scale-100' : ''}
                                ${animationState === 'resetting' ? 'animate-shrink-out' : ''}
                            `}
                            style={{
                                width: '180px',
                                height: '180px',
                                background: 'radial-gradient(circle, #000000 30%, #4c1d95 90%, #a855f7 100%)',
                            }}
                         ></div>
                     </div>
                 )}
             </div>
             <h3 className="text-lg font-bold text-slate-200 font-mono z-20 mix-blend-difference">Core Engineering</h3>
          </div>
          <div className="flex flex-wrap gap-2 relative z-10">
            {categories[2].items.map(item => (
              <span key={item} className="px-3 py-1.5 text-sm bg-emerald-950/30 border border-emerald-900/50 text-emerald-200 rounded hover:bg-emerald-900/50 transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Small Block - Stats/Info */}
      <div className="md:col-span-3 rounded-xl border border-slate-800 bg-slate-900/30 p-6 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-tr from-slate-900 to-slate-800/50">
          <div className="text-center">
            <h4 className="text-4xl font-bold text-white mb-1 font-mono">{calculateYearsExperience()}</h4>
            <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Years Experience</p>
          </div>
          <div className="mt-4 flex gap-4 text-xs font-mono relative">
             <span 
               onClick={triggerSequence}
               className={`
                 cursor-pointer font-bold select-none
                 bg-[linear-gradient(110deg,#94a3b8,45%,#fb923c,55%,#94a3b8)] 
                 bg-[length:250%_100%] 
                 bg-clip-text text-transparent
                 animate-shimmer
                 relative group/physics
               `}
             >
                PHYSICS BACKGROUND
                
                {/* Physics Tooltip */}
                <div className="absolute -top-10 left-0 bg-slate-700 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/physics:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap tooltip-arrow">
                    Warning: Unstable Gravity
                </div>
             </span>

             <span className="text-slate-500">•</span>
             
             {/* Tech Lead Easter Egg */}
             <span 
                onClick={handleSortAi}
                className={`
                 cursor-pointer font-bold select-none
                 bg-[linear-gradient(110deg,#94a3b8,45%,#06b6d4,55%,#94a3b8)] 
                 bg-[length:250%_100%] 
                 bg-clip-text text-transparent
                 animate-shimmer
                 relative group/techlead
               `}
             >
                TECH LEAD
                
                {/* Tech Lead Tooltip */}
                <div className="absolute -top-10 left-0 bg-slate-700 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/techlead:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap tooltip-arrow">
                    Line up the chaos!
                </div>
             </span>
          </div>
      </div>
    </div>
  );
};

export default TechStack;