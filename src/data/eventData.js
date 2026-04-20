export const eventData = [
  {
    id: 1,
    title: "Mastering Java Streams",
    time: "10:00 AM",
    timeRaw: "2026-04-16T10:00:00.000Z",
    room: "Room A",
    techStack: ["Java", "Backend"],
    type: "Tech",
    keyTakeaways: [
      "Stream API drastically reduces boilerplate code for collection operations.",
      "Parallel streams can improve performance but require stateless, non-interfering behaviors.",
      "Always use intermediate operations (like filter/map) before terminal operations to optimize memory."
    ]
  },
  {
    id: 2,
    title: "The Future of Generative AI",
    time: "11:30 AM",
    timeRaw: "2026-04-16T11:30:00.000Z",
    room: "Main Ballroom",
    techStack: ["AI", "ML"],
    type: "Tech",
    keyTakeaways: [
      "Transformers are scaling beyond just text into multimodal capabilities.",
      "Agentic workflows are replacing standard zero-shot prompting for reliable software engineering.",
      "Prompt injection mitigation is becoming a massive sub-industry in cybersecurity."
    ]
  },
  {
    id: 3,
    title: "React Server Components Deep Dive",
    time: "02:00 PM",
    timeRaw: "2026-04-16T14:00:00.000Z",
    room: "Hall C",
    techStack: ["React", "Frontend"],
    type: "Tech",
    keyTakeaways: [
      "RSCs execute exclusively on the server, resulting in zero bundle size for the component itself.",
      "They allow direct access to backend resources like databases and file systems safely.",
      "You mix them with Client Components using the 'use client' directive for interactive elements."
    ]
  },
  {
    id: 4,
    title: "Founder’s Mixer",
    time: "04:00 PM",
    timeRaw: "2026-04-16T16:00:00.000Z",
    room: "Rooftop Lounge",
    focus: ["Networking", "Startup", "Founder"],
    type: "Networking",
    keyTakeaways: [
      "Networking is 90% listening. Find out what people are building.",
      "Exchange LinkedIn contacts rather than physical business cards.",
      "Focus on building 2-3 genuine relationships rather than 20 superficial ones."
    ]
  }
];
