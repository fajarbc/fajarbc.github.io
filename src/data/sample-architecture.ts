/**
 * SAMPLE FIXTURES — LessOTP and LuringTalk architectures for demo purposes.
 * Add new exports following the same ArchitectureData shape to create more diagrams.
 *
 * Data schema: see src/types/architecture.ts
 */
import type { ArchitectureData } from '@/src/types/architecture';

// ─── LessOTP — Passwordless Authentication Platform ──────────────────────────

export const lessOtpArchitecture: ArchitectureData = {
  id: 'lessotp',
  title: 'LessOTP — Passwordless Authentication Platform',
  description:
    'B2B inbound phone authentication for developers. Verifies users via WhatsApp and Telegram without traditional OTP codes.',
  nodes: [
    {
      id: 'dev-app',
      label: 'Developer App',
      category: 'Client',
      summary: 'Third-party application integrating LessOTP for user authentication.',
      responsibilities: ['Initiate auth request via SDK/API', 'Receive verification callback', 'Display auth status to end user'],
      technologies: ['Any stack', 'REST API', 'SDK'],
    },
    {
      id: 'gateway',
      label: 'API Gateway',
      category: 'Gateway',
      summary: 'Edge layer handling API key validation, rate limiting, and TLS termination.',
      responsibilities: ['API key authentication', 'Rate limiting per tenant', 'Request routing', 'TLS termination'],
      technologies: ['Nginx', 'Docker'],
      reliabilityNotes: 'Containerized with health-check restart policy.',
    },
    {
      id: 'auth-api',
      label: 'Auth API',
      category: 'Service',
      summary: 'Core service managing verification sessions — generates challenges and validates inbound messages.',
      responsibilities: ['Create verification session', 'Generate unique challenge token', 'Match inbound message to session', 'Issue verification callback'],
      technologies: ['Next.js', 'Bun', 'TypeScript'],
      observabilityNotes: 'Request latency and verification success rate tracked.',
    },
    {
      id: 'wa-connector',
      label: 'WhatsApp Connector',
      category: 'Service',
      summary: 'Webhook listener for inbound WhatsApp messages — matches phone numbers to active sessions.',
      responsibilities: ['Listen for WhatsApp webhooks', 'Parse inbound messages', 'Forward match to Auth API'],
      technologies: ['Node.js', 'WhatsApp Business API'],
    },
    {
      id: 'tg-connector',
      label: 'Telegram Connector',
      category: 'Service',
      summary: 'Bot listener for inbound Telegram messages — matches user handles to active sessions.',
      responsibilities: ['Listen for Telegram bot updates', 'Parse inbound messages', 'Forward match to Auth API'],
      technologies: ['Node.js', 'Telegram Bot API'],
    },
    {
      id: 'session-store',
      label: 'Session Store',
      category: 'Cache',
      summary: 'TTL-backed store for short-lived verification sessions with automatic expiry.',
      responsibilities: ['Store pending sessions', 'TTL-based auto-expiry', 'Fast lookup by challenge token'],
      technologies: ['Redis'],
      reliabilityNotes: 'Persistence disabled — sessions are ephemeral by design.',
    },
    {
      id: 'db',
      label: 'Application Database',
      category: 'Database',
      summary: 'Stores tenant API keys, usage logs, and billing data.',
      responsibilities: ['Tenant management', 'API key storage', 'Usage metering', 'Audit logging'],
      technologies: ['PostgreSQL', 'Docker'],
      reliabilityNotes: 'Daily automated backups with point-in-time recovery.',
    },
    {
      id: 'webhook-out',
      label: 'Webhook Dispatcher',
      category: 'Service',
      summary: "Delivers verification result callbacks to the developer's configured endpoint.",
      responsibilities: ['Deliver webhook payloads', 'Retry with exponential backoff', 'Log delivery status'],
      technologies: ['Node.js', 'TypeScript'],
    },
  ],
  edges: [
    { id: 'e1', source: 'dev-app', target: 'gateway', label: 'Auth request', protocol: 'HTTPS', requestStep: 0 },
    { id: 'e2', source: 'gateway', target: 'auth-api', label: 'Route', protocol: 'HTTP', requestStep: 1 },
    { id: 'e3', source: 'auth-api', target: 'session-store', label: 'Create session', protocol: 'TCP', requestStep: 2 },
    { id: 'e4', source: 'auth-api', target: 'db', label: 'Validate API key', protocol: 'TCP' },
    { id: 'e5', source: 'wa-connector', target: 'auth-api', label: 'Inbound match', protocol: 'HTTP', requestStep: 3 },
    { id: 'e6', source: 'tg-connector', target: 'auth-api', label: 'Inbound match', protocol: 'HTTP', requestStep: 3 },
    { id: 'e7', source: 'auth-api', target: 'session-store', label: 'Verify & consume', protocol: 'TCP', requestStep: 4 },
    { id: 'e8', source: 'auth-api', target: 'webhook-out', label: 'Trigger callback', protocol: 'HTTP', requestStep: 5 },
    { id: 'e9', source: 'webhook-out', target: 'dev-app', label: 'Verification result', protocol: 'HTTPS', requestStep: 6 },
    { id: 'e10', source: 'auth-api', target: 'db', label: 'Log usage', protocol: 'TCP' },
  ],
  journeys: [
    {
      id: 'verification-flow',
      label: 'Verification Flow',
      edgeIds: ['e1', 'e2', 'e3', 'e5', 'e7', 'e8', 'e9'],
    },
  ],
};

// ─── LuringTalk — Offline P2P Video Calling PWA ──────────────────────────────

export const luringTalkArchitecture: ArchitectureData = {
  id: 'luringtalk',
  title: 'LuringTalk — Offline P2P Video Calling',
  description:
    'Two devices on the same local Wi-Fi exchange compressed WebRTC offers and answers through QR codes, then stream encrypted voice and video directly without a signaling server or Internet connection.',
  nodes: [
    {
      id: 'https-server',
      label: 'Local HTTPS Server',
      category: 'Gateway',
      summary: 'Serves the built PWA to devices on the LAN and redirects HTTP traffic to HTTPS.',
      responsibilities: ['Serve static application assets', 'Redirect port 8081 to HTTPS on port 8080', 'Provide the secure context required for camera and microphone access'],
      technologies: ['Node.js', 'Express', 'HTTPS'],
      reliabilityNotes: 'Startup fails fast when the required TLS certificate and key are unavailable.',
    },
    {
      id: 'host-pwa',
      label: 'Host PWA',
      category: 'Client',
      summary: 'Device A captures local media, creates the WebRTC offer, and completes the handshake.',
      responsibilities: ['Request camera and microphone access', 'Create and display the SDP offer', 'Scan and apply the guest answer', 'Control the active call'],
      technologies: ['React', 'TypeScript', 'WebRTC', 'MediaDevices API'],
      reliabilityNotes: 'Falls back to audio-only when video initialization fails.',
    },
    {
      id: 'guest-pwa',
      label: 'Guest PWA',
      category: 'Client',
      summary: 'Device B scans the host offer, creates an SDP answer, and joins the peer connection.',
      responsibilities: ['Scan and apply the host offer', 'Request local media', 'Create and display the SDP answer', 'Control the active call'],
      technologies: ['React', 'TypeScript', 'WebRTC', 'MediaDevices API'],
      reliabilityNotes: 'Supports manual code paste and QR image upload when live scanning is unavailable.',
    },
    {
      id: 'qr-signaling',
      label: 'QR Signaling',
      category: 'Service',
      summary: 'Out-of-band signaling exchanges compressed SDP without a WebSocket or signaling backend.',
      responsibilities: ['Keep essential ICE and codec data', 'Compress SDP into QR-sized payloads', 'Generate and scan offer/answer QR codes', 'Parse manual fallback codes'],
      technologies: ['qrcode', 'jsQR', 'lz-string'],
      reliabilityNotes: 'Manual copy/paste is available when QR scanning fails.',
    },
    {
      id: 'local-lan',
      label: 'Local Wi-Fi LAN',
      category: 'Network',
      summary: 'Carries the direct peer-to-peer media stream between devices on the same hotspot or router.',
      responsibilities: ['Expose local ICE host candidates', 'Route direct encrypted media between peers', 'Keep call traffic on the local network'],
      technologies: ['Wi-Fi', 'ICE', 'DTLS-SRTP', 'RTP'],
      reliabilityNotes: 'WebRTC handles minor packet loss; call quality depends on local Wi-Fi signal strength.',
    },
    {
      id: 'media-session',
      label: 'WebRTC Media Session',
      category: 'Service',
      summary: 'The negotiated browser-to-browser connection transports live audio and video.',
      responsibilities: ['Negotiate peer connection', 'Send and receive media tracks', 'Monitor ICE and connection state', 'Mute audio/video and switch cameras'],
      technologies: ['RTCPeerConnection', 'VP8', 'Opus', 'Screen Wake Lock API'],
      observabilityNotes: 'Connection, ICE, signaling, and media-track states are exposed in the local debug UI and console.',
    },
    {
      id: 'pwa-cache',
      label: 'PWA Asset Cache',
      category: 'Cache',
      summary: 'A service worker caches the application shell and fetched assets for offline reuse.',
      responsibilities: ['Pre-cache core assets', 'Serve cached responses first', 'Cache successful asset responses', 'Remove stale cache versions'],
      technologies: ['Service Worker', 'Cache API', 'Web App Manifest'],
    },
  ],
  edges: [
    { id: 'e1', source: 'https-server', target: 'host-pwa', label: 'Serve PWA', protocol: 'HTTPS' },
    { id: 'e2', source: 'https-server', target: 'guest-pwa', label: 'Serve PWA over LAN', protocol: 'HTTPS' },
    { id: 'e3', source: 'host-pwa', target: 'pwa-cache', label: 'Cache app shell', protocol: 'Cache API' },
    { id: 'e4', source: 'guest-pwa', target: 'pwa-cache', label: 'Cache app shell', protocol: 'Cache API' },
    { id: 'e5', source: 'host-pwa', target: 'qr-signaling', label: 'Generate SDP offer', protocol: 'QR / manual code', requestStep: 0 },
    { id: 'e6', source: 'qr-signaling', target: 'guest-pwa', label: 'Scan offer', protocol: 'Camera / QR', requestStep: 1 },
    { id: 'e7', source: 'guest-pwa', target: 'qr-signaling', label: 'Generate SDP answer', protocol: 'QR / manual code', requestStep: 2 },
    { id: 'e8', source: 'qr-signaling', target: 'host-pwa', label: 'Scan answer', protocol: 'Camera / QR', requestStep: 3 },
    { id: 'e9', source: 'host-pwa', target: 'media-session', label: 'Add local tracks', protocol: 'WebRTC', requestStep: 4 },
    { id: 'e10', source: 'guest-pwa', target: 'media-session', label: 'Add local tracks', protocol: 'WebRTC', requestStep: 4 },
    { id: 'e11', source: 'media-session', target: 'local-lan', label: 'Direct encrypted media', protocol: 'DTLS-SRTP', requestStep: 5 },
    { id: 'e12', source: 'local-lan', target: 'host-pwa', label: 'Remote media', protocol: 'RTP', requestStep: 6 },
    { id: 'e13', source: 'local-lan', target: 'guest-pwa', label: 'Remote media', protocol: 'RTP', requestStep: 6 },
  ],
  journeys: [
    {
      id: 'establish-call',
      label: 'Establish a Call',
      edgeIds: ['e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12', 'e13'],
    },
    {
      id: 'load-offline-app',
      label: 'Load the PWA',
      edgeIds: ['e1', 'e2', 'e3', 'e4'],
    },
  ],
};

/** Default architecture for the demo page */
export const sampleArchitecture = lessOtpArchitecture;
