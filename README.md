# 🧠 Failure Reasoner: Zero-Setup Multimodal Reasoning Engine

**Failure Reasoner** is a high-performance technical reasoning system built for the **Gemini API Developer Hackathon 2026**. It leverages Gemini 2.5 Flash's multimodal capabilities to visually and logically correlate technical failure evidence.

## 🚀 The Vision
Debugging is often a fragmented process of looking at text logs and trying to visualize UI states. **Failure Reasoner** merges these streams. By providing a technical log and a video or screenshot of the error in action, Gemini correlates the temporal events with the stack trace to provide a **Neural Root Cause Analysis**.

## ✨ Key Features
- **Zero-Setup Multimodal Processing**: Directly analyzes `.mp4`, `.mov`, `.png`, and `.jpg` evidence alongside raw text.
- **Neural Reasoning Reports**: Structured output including a Cognitive Summary, Neural Root Cause, and a prioritized Resolution Protocol.
- **Temporal Correlation**: Specifically tuned to watch videos and identify the exact moment a visual failure aligns with a log warning.
- **Premium Glassmorphism UI**: A futuristic, high-density interface built with Tailwind CSS v4 and Framer Motion.

## 🛠 Tech Stack
- **AI Brain**: Google Gemini API (`gemini-2.5-flash`)
- **Frontend**: React 19, Vite 7, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Icons**: Lucide React

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### 2. Installation
```bash
git clone https://github.com/johnking1ori-png/my-failure.git
cd my-failure
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your API key:
```env
VITE_GEMINI_API_KEY=your_actual_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

---
Built with ❤️ for the Gemini API Developer Hackathon.
