# Jesse | Systems & Synthesis Portfolio

A high-performance portfolio built with React, Vite, and AI integration.

## Environment Variables

To run this project, you need the following environment variables. 

1. Create a `.env` file in the root of your project.
2. Add the keys below.

```env
# Required for "Lab" tools (e.g., Token Calculator, Env Checker)
# Get this from Google AI Studio (https://aistudio.google.com/)
API_KEY=your_gemini_api_key_here

# Optional: If you want to parameterize the ElevenLabs Agent ID
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
```

*Note: The current `Assistant.tsx` has a hardcoded demo Agent ID. You can replace it with `import.meta.env.VITE_ELEVENLABS_AGENT_ID` if you wish to use your own.*

## How It Works

### Voice Agent
The voice interface is powered by **ElevenLabs Conversational AI**.
- **Connection**: Uses `useConversation` hook to stream audio via WebSockets.
- **Tools**: The agent is equipped with client-side tools (e.g., `navigateToSection`) that allow it to control the React router and scroll the page based on voice commands.

### System Visualizer
The background animation uses a custom HTML5 Canvas implementation (`SystemVisualizer.tsx`) that projects 3D coordinates onto a 2D plane without heavy 3D libraries, ensuring high performance.

---

## Adding AgentJesse to Any Website

You can embed the "AgentJesse" (or any ElevenLabs agent) into an external website by isolating the Assistant component.

### 1. Install Dependencies
```bash
npm install @elevenlabs/react framer-motion
```

### 2. Create the Widget Component
Copy the code below to create a standalone voice widget.

```tsx
import React, { useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';

export const AgentWidget = ({ agentId }: { agentId: string }) => {
  const conversation = useConversation({
    // Optional: Define functions the agent can control on your site
    clientTools: {
      scrollDown: async () => {
        window.scrollBy({ top: 500, behavior: 'smooth' });
        return "Scrolled down.";
      }
    }
  });

  const { status, startSession, endSession, volume } = conversation;
  const isActive = status === 'connected';
  const isConnecting = status === 'connecting';

  const toggleChat = async () => {
    if (isActive) await endSession();
    else await startSession({ agentId }); 
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={toggleChat}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isActive ? 'bg-red-500 animate-pulse' : 'bg-black text-white'
        }`}
      >
        {isConnecting ? (
            <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
        ) : (
            <span className="material-symbols-outlined">
                {isActive ? 'mic_off' : 'mic'}
            </span>
        )}
      </button>
      
      {/* Visualizer Ring based on volume */}
      {isActive && (
        <div 
            className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
            style={{ transform: `scale(${1 + volume})`, opacity: 0.5 }}
        />
      )}
    </div>
  );
};
```

### 3. Usage
Import it into your `App.tsx` or `index.html` root.

```tsx
<AgentWidget agentId="your_agent_id_from_elevenlabs_dashboard" />
```
