import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal } from 'lucide-react';
import { projects, techCategories } from '@/data';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string | React.ReactNode;
}

// Personal info from env
const fullName = process.env.FULL_NAME || 'Fajar Budi Cahyanto';
const firstName = fullName.split(' ')[0];
const jobTitle = process.env.JOB_TITLE || 'AI Infrastructure & Cloud Architect';
const careerStartDate = process.env.CAREER_START_DATE || '2019-01-01';
const careerStartYear = new Date(careerStartDate).getFullYear();
const contactEmail = process.env.CONTACT_EMAIL || 'email@example.com';
const githubUrl = process.env.URL_GITHUB || 'https://github.com/fajarbc';
const linkedinUrl = process.env.LINKEDIN_URL || 'https://linkedin.com/in/fajarbc';

const introText = [
  `> Initializing ${firstName}_Profile.sh...`,
  "> Loading modules: Physics, Engineering, AI...",
  "> Status: Online.",
  `> Role: ${jobTitle}.`,
  "> Bridging Business Goals with Hardcore Engineering."
];

export function TerminalWidget() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentTypingLine, setCurrentTypingLine] = useState('');
  const [introStep, setIntroStep] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isInteractive, setIsInteractive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        setLines(prev => [...prev, { type: 'output', content: targetLine }]);
        setCurrentTypingLine('');
        setTimeout(() => {
          setIntroStep(prev => prev + 1);
        }, 300);
      }
    }, 20);

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
    if (isInteractive && !isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInteractive, isProcessing, isExpanded, lines]);

  const triggerGlitch = useCallback(() => {
    document.body.classList.add('glitch-active');
    setTimeout(() => {
      document.body.classList.remove('glitch-active');
      setLines(prev => [
        ...prev,
        { type: 'error', content: "CRITICAL ERROR: SYSTEM INTEGRITY PROTECTED." },
        { type: 'output', content: "Nice try, but I have strict IAM policies here." }
      ]);
    }, 2000);
  }, []);

  const typeOutputLines = useCallback((baseLines: TerminalLine[], outputLines: string[], delay: number) => {
    setIsProcessing(true);
    // Include the first output line immediately with baseLines
    setLines([...baseLines, { type: 'output', content: outputLines[0] }]);

    let i = 1;
    if (outputLines.length <= 1) {
      setIsProcessing(false);
      return;
    }
    const interval = setInterval(() => {
      if (i < outputLines.length) {
        setLines(prev => [...prev, { type: 'output', content: outputLines[i] }]);
        i++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, delay);
  }, []);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleCommand = useCallback((cmd: string) => {
    const command = cmd.trim();
    const newLines: TerminalLine[] = [
      ...lines,
      { type: 'input', content: command }
    ];

    if (command !== '') {
      setCommandHistory(prev => [...prev, command]);
    }

    if (command === 'ls') {
      const lsOutput = [
        'drwxr-xr-x  projects/',
        ...projects.map((p) => `  - ${p.title}`),
      ];
      setInputVal('');
      typeOutputLines(newLines, lsOutput, 80);
      return;
    } else if (command === 'whoami') {
      newLines.push({
        type: 'output',
        content: <span className="text-emerald-400 font-bold">{fullName} — {jobTitle}</span>
      });
    } else if (command === 'skills') {
      const skillsOutput = techCategories.flatMap((cat) => [
        `┌─ ${cat.title}`,
        `│  ${cat.items.join(', ')}`,
        '└─',
      ]);
      setInputVal('');
      typeOutputLines(newLines, skillsOutput, 60);
      return;
    } else if (command === 'contact') {
      const contactOutput = [
        `  📧 Email:    ${contactEmail}`,
        `  🔗 GitHub:   ${githubUrl}`,
        `  🔗 LinkedIn: ${linkedinUrl}`,
      ];
      setInputVal('');
      typeOutputLines(newLines, ['Reach me at:', ...contactOutput], 80);
      return;
    } else if (command === 'uptime') {
      const years = new Date().getFullYear() - careerStartYear;
      newLines.push({
        type: 'output',
        content: `up ${years} years — coding since ${careerStartYear}. No downtime (mostly).`
      });
    } else if (command === 'neofetch') {
      const neofetchOutput = [
        '  ┌─┐   ',
        '  │▓│   OS:     Linux (btw)',
        '  │▓│   Editor: VS Code / Vim',
        '  │▓│   Cloud:  GCP / AWS',
        '  │▓│   Orch:   Kubernetes, Docker Swarm',
        '  │▓│   Lang:   Go, TS, ,JS, Python, PHP',
        '  │▓│   Coffee: ████████░░ 80%',
        '  └─┘   ',
      ];
      setInputVal('');
      typeOutputLines(newLines, neofetchOutput, 50);
      return;
    } else if (command === 'date') {
      newLines.push({ type: 'output', content: new Date().toString() });
    } else if (command === 'history') {
      if (commandHistory.length === 0) {
        newLines.push({ type: 'output', content: 'No commands in history yet.' });
      } else {
        const histOutput = commandHistory.map((c, i) => `  ${i + 1}  ${c}`);
        setInputVal('');
        typeOutputLines(newLines, histOutput, 40);
        return;
      }
    } else if (command.startsWith('echo ')) {
      const text = command.slice(5);
      newLines.push({ type: 'output', content: text || '' });
    } else if (command === `sudo hire ${firstName.toLowerCase()}`) {
      newLines.push({
        type: 'output',
        content: <span className="text-emerald-400 font-bold">✓ Access granted. Sending offer letter... 🎉</span>
      });
      newLines.push({
        type: 'output',
        content: <span className="text-slate-400">Reach out via the 'contact' command to make it official.</span>
      });
    } else if (command === 'sudo rm -rf /') {
      setLines(newLines);
      setInputVal('');
      triggerGlitch();
      return;
    } else if (command === 'exit') {
      newLines.push({ type: 'error', content: "Nice try. There's no escape from this portfolio." });
    } else if (command === 'clear') {
      setLines([]);
      setInputVal('');
      return;
    } else if (command === 'help') {
      const helpOutput = [
        '  whoami      — about me',
        '  skills      — tech stack',
        '  ls          — list projects',
        '  contact     — get in touch',
        '  neofetch    — system info',
        '  uptime      — years of experience',
        '  history     — command history',
        '  date        — current date/time',
        '  echo <msg>  — repeat after me',
        '  clear       — clear terminal',
        '  exit        — try to leave',
        `  sudo hire ${firstName.toLowerCase()} — 😏`,
        '  sudo rm -rf /   — don\'t do it',
      ];
      setInputVal('');
      typeOutputLines(newLines, helpOutput, 40);
      return;
    } else if (command !== '') {
      newLines.push({ type: 'output', content: `command not found: ${command}. Type 'help' for available commands.` });
    }

    setLines(newLines);
    setInputVal('');
  }, [lines, triggerGlitch, typeOutputLines, commandHistory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputVal(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(newIndex);
        setInputVal(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div
      className="mx-auto mt-8 w-full"
      style={{
        maxWidth: isExpanded ? 'calc(100vw - 3rem)' : '48rem',
        transition: 'max-width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={`rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-900/10 hover:border-slate-700 ${isShaking ? 'animate-shake' : ''}`}
        style={{ transition: 'border-color 300ms' }}
      >
        {/* Terminal title bar */}
        <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShaking(true);
                setLines(prev => [...prev, { type: 'error', content: 'ERROR: Cannot terminate process. This portfolio is immortal.' }]);
                setTimeout(() => setIsShaking(false), 500);
              }}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer transition-colors"
              aria-label="Close (just kidding)"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer transition-colors"
              aria-label="Collapse terminal"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer transition-colors"
              aria-label="Expand terminal"
            />
          </div>
          <div className="ml-4 text-xs font-mono text-slate-500 flex items-center gap-2">
            <Terminal size={12} />
            <span>{firstName.toLowerCase()}@infrastructure:~/portfolio</span>
          </div>
        </div>

        {/* Terminal body */}
        <div
          ref={containerRef}
          className={`p-6 font-mono text-sm md:text-base overflow-y-auto flex flex-col justify-start scroll-smooth text-left ${isExpanded ? 'h-[28rem]' : 'h-72'}`}
          style={{ transition: 'height 400ms ease' }}
        >
          {/* History Lines */}
          {lines.map((line, idx) => (
            <div key={idx} className="mb-1 break-words">
              {line.type === 'input' ? (
                <div className="flex items-center">
                  <span className="text-emerald-500 mr-2 shrink-0">{firstName.toLowerCase()}@infrastructure:~$</span>
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
              <span className="inline-block w-2.5 h-4 bg-cyan-500 ml-1 animate-pulse align-middle"></span>
            </div>
          )}

          {/* Interactive Input Line */}
          {isInteractive && !isProcessing && (
            <div className="flex items-center mt-1">
              <span className="text-emerald-500 mr-2 shrink-0">{firstName.toLowerCase()}@infrastructure:~$</span>
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
                spellCheck={false}
                aria-label="Terminal command input"
              />
            </div>
          )}
        </div>
      </div>
      {isInteractive && (
        <p className="text-center text-xs text-slate-600 mt-2 font-mono">
          Tip: Try 'help' for commands. Click the <span className="text-emerald-500">●</span> to expand, <span className="text-amber-500">●</span> to collapse, <span className="text-red-500">●</span> to rage quit.
        </p>
      )}
    </div>
  );
}
