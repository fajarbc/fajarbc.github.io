import { Project } from './types';

export const projects: Project[] = [
  {
    title: "NielAI Infrastructure",
    description: "Designed, developed, and deployed production-ready AI system from scratch. Migrated legacy infrastructure from Docker Swarm to GKE, enabling auto-scaling capabilities for high-load AI inference requests reducing latency by 40%.",
    tags: ["GKE", "Kubernetes", "Docker", "GCP", "DevOps", "AI System"],
    category: "Infrastructure"
  },
  {
    title: "Montiro Smartcar Dashboard",
    description: "Built realtime Mitsubishi Smart Car emergency monitoring dashboard from scratch. Containerized Docker backend with NodeJS, PHP & WebSocket. Google Cloud SQL MySQL database with CI/CD automation and Terraform infrastructure. Implemented load balancer for high availability with auto-scaling instances.",
    tags: ["NodeJS", "PHP", "WebSocket", "Docker", "GCP", "Terraform", "CI/CD", "Load Balancer"],
    category: "Infrastructure"
  },
  {
    title: "Multi-Cloud Infrastructure Management",
    description: "Managed Ubuntu & CentOS multi-cloud server infrastructure on AWS & GCP, ensuring optimal performance, reliability, and security with system monitoring using Grafana & Prometheus.",
    tags: ["AWS", "GCP", "Ubuntu", "CentOS", "Grafana", "Prometheus"],
    category: "Infrastructure"
  },
  {
    title: "Async Vision Pipeline",
    description: "Architected a non-blocking computer vision pipeline using RabbitMQ and WebSockets, allowing real-time photo processing without main-thread blocking.",
    tags: ["RabbitMQ", "WebSockets", "Python", "NodeJS"],
    category: "AI"
  },
  {
    title: "CI/CD Pipeline Automation",
    description: "Implemented CI/CD with GitLab Pipeline to automate building & deploying applications across multi-environment, multi-region servers with zero-downtime deployments.",
    tags: ["GitLab CI", "Pipeline", "Multi-environment", "Automation"],
    category: "Infrastructure"
  },
  {
    title: "Payment Gateway Integration",
    description: "Implemented optimal payment link, virtual account and disbursement solution by integrating core business logic with payment gateway supporting multi-nation transactions.",
    tags: ["Payment Gateway", "API Integration", "Multi-nation", "Backend"],
    category: "Infrastructure"
  },
  {
    title: "Real-time WebSocket Solutions",
    description: "Developed novel real-time WebSocket technology solutions to meet critical business needs, resolving core bottlenecks using Redis and RabbitMQ for optimized performance.",
    tags: ["WebSocket", "Redis", "RabbitMQ", "Real-time"],
    category: "Infrastructure"
  },
  {
    title: "IoT Streetlight Dashboard",
    description: "Built realtime IoT-based streetlight dashboard with containerized Docker backend using NodeJS & WebSocket for real-time communication. PostgreSQL for transactional data, InfluxDB for timeseries, and MQTT for device communication.",
    tags: ["NodeJS", "WebSocket", "PostgreSQL", "InfluxDB", "MQTT", "Docker"],
    category: "IoT"
  },
  {
    title: "Flutter Mobile Apps",
    description: "Build hybrid (Android/iOS) mobile apps with Flutter using BLoC architecture for state management and clean code practices.",
    tags: ["Flutter", "Dart", "BLoC", "Mobile"],
    category: "Mobile"
  },
  {
    title: "Olakata Mobile Game API & Dashboard",
    description: "Built Olakata (Crosswords Mobile Game) API & admin dashboard to manage application settings and contents. Implemented crosswords gamification OOP logic with automated CI/CD using GitHub Actions.",
    tags: ["Admin Dashboard", "OOP", "Gamification", "GitHub Actions"],
    category: "Gaming"
  },
  {
    title: "Business Solutions Platform",
    description: "Developed backend and frontend solutions to address complex business needs. Enhanced governance systems and facilitated operational integration during company transitions.",
    tags: ["Backend", "Frontend", "Business Logic", "Integration"],
    category: "Infrastructure"
  },
  {
    title: "Education & Hospitality Solutions",
    description: "Delivered backend and frontend development for tailored software solutions designed for Japanese education & hospitality companies, creating innovative IT solutions for international clients.",
    tags: ["Backend", "Frontend", "International", "Custom Solutions"],
    category: "Infrastructure"
  },
  {
    title: "Ozone Gas Control System",
    description: "Developed a system to control ozone gas flow using a GUI built with C# and .NET, integrated with an Arduino microcontroller programmed in C through serial communication.",
    tags: ["C#", ".NET", "Arduino", "C", "Serial Communication"],
    category: "IoT"
  },
  {
    title: "Robotic Club Leadership",
    description: "Coordinated and led technical trainings as Head of Robotic Club of Physics. Designed and assembled robotics line-followers & digital scoreboard system.",
    tags: ["Robotics", "Leadership", "Training", "Electronics"],
    category: "IoT"
  }
];