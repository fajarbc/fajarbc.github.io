import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { projects } from '../data';

interface TerminalLine {
  type: 'output' | 'input' | 'error';
  content: string | React.ReactNode;
}

const TerminalHero: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentTypingLine, setCurrentTypingLine] = useState('');
  const [introStep, setIntroStep] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isInteractive, setIsInteractive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const introText = [
    "> Initializing Fajar_Profile.sh...",
    "> Loading modules: Physics, Engineering, AI...",
    "> Status: Online.",
    "> Role: AI Infrastructure & Cloud Architect.",
    "> Mission: Bridging Business Goals with Hardcore Engineering."
  ];

  // Initial Typing Animation
  useEffect(() => {
    if (introStep >= introText.length) {
      setIsInteractive(true);
      return;
    }

    const targetLine = introText[introStep];
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex <= targetLine.length) {
        setCurrentTypingLine(targetLine.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        // Add completed line to history
        setLines(prev => [...prev, { type: 'output', content: targetLine }]);
        setCurrentTypingLine('');
        setTimeout(() => {
          setIntroStep(prev => prev + 1);
        }, 300);
      }
    }, 20); // Speed of typing

    return () => clearInterval(interval);
  }, [introStep]);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentTypingLine, isInteractive]);

  // Auto focus input when interactive
  useEffect(() => {
    if (isInteractive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInteractive, lines]);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim();
    const newLines: TerminalLine[] = [
      ...lines, 
      { type: 'input', content: command }
    ];

    if (command === 'ls') {
      const projectList = (
        <div className="flex flex-col gap-1 mt-1 mb-2">
          <div className="text-cyan-400 font-bold mb-1">drwxr-xr-x  projects/</div>
          {projects.map((p, i) => (
             <div key={i} className="pl-4 text-slate-300 hover:text-cyan-300 transition-colors">
               - {p.title}
             </div>
          ))}
        </div>
      );
      newLines.push({ type: 'output', content: projectList });
    } else if (command === 'whoami') {
      newLines.push({ 
        type: 'output', 
        content: <span className="text-emerald-400 font-bold">root user: Fajar Budi Cahyanto</span> 
      });
    } else if (command === 'sudo rm -rf /') {
      // Trigger Glitch Effect
      document.body.classList.add('glitch-active');
      
      setTimeout(() => {
        document.body.classList.remove('glitch-active');
        setLines(prev => [
          ...prev, 
          { type: 'error', content: "CRITICAL ERROR: SYSTEM INTEGRITY PROTECTED." },
          { type: 'output', content: "Nice try, but I have strict IAM policies here." }
        ]);
      }, 2000);
    } else if (command === 'clear') {
       setLines([]);
       setInputVal('');
       return;
    } else if (command === 'help') {
       newLines.push({ type: 'output', content: "Available commands: ls, whoami, clear, sudo rm -rf /" });
    } else if (command !== '') {
       newLines.push({ type: 'output', content: `command not found: ${command}` });
    }

    setLines(newLines);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-16" onClick={() => inputRef.current?.focus()}>
      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-900/10 transition-all duration-300 hover:border-slate-700">
        <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="ml-4 text-xs font-mono text-slate-500 flex items-center gap-2">
            <Terminal size={12} />
            <span>fajar@infrastructure:~/portfolio</span>
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="p-6 font-mono text-sm md:text-base h-80 overflow-y-auto flex flex-col justify-start scroll-smooth"
        >
            {/* History Lines */}
            {lines.map((line, idx) => (
                <div key={idx} className="mb-1 break-words">
                    {line.type === 'input' ? (
                       <div className="flex items-center">
                          <span className="text-emerald-500 mr-2 shrink-0">visitor@portfolio:~$</span>
                          <span className="text-slate-100">{line.content}</span>
                       </div>
                    ) : (
                       <div className={`text-slate-300 ${line.type === 'error' ? 'text-red-500 font-bold' : ''}`}>
                          {typeof line.content === 'string' && line.content.startsWith('>') ? (
                             <span className="text-emerald-500 mr-2">➜</span>
                          ) : null}
                          {line.content}
                       </div>
                    )}
                </div>
            ))}

            {/* Current Animation Line (during intro) */}
            {!isInteractive && (
                <div className="text-slate-300">
                    <span className="text-emerald-500 mr-2">➜</span>
                    {currentTypingLine}
                    <span className="inline-block w-2.5 h-4 bg-cyan-500 ml-1 animate-cursor-blink align-middle"></span>
                </div>
            )}

            {/* Interactive Input Line */}
            {isInteractive && (
               <div className="flex items-center mt-1">
                  <span className="text-emerald-500 mr-2 shrink-0">visitor@portfolio:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent border-none outline-none text-slate-100 font-mono caret-cyan-500 p-0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
               </div>
            )}
        </div>
      </div>
      {isInteractive && <p className="text-center text-xs text-slate-600 mt-2 font-mono">Tip: Try typing 'ls', 'whoami' or 'help'</p>}
    </div>
  );
};

export default TerminalHero;
