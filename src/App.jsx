import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import ToiletButton from './components/ToiletButton'
import Counter from './components/Counter'
import './index.css' // We'll rely on global styles for now or module if preferred

// Connect to the server
// In production, use the environment variable. In development, fallback to localhost.
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

function App() {
  const [count, setCount] = useState(0);
  const [isSitting, setIsSitting] = useState(false);

  useEffect(() => {
    console.log("Attempting to connect to:", import.meta.env.VITE_API_URL || 'http://localhost:3000');

    socket.on('connect', () => {
      console.log("Connected to server! Socket ID:", socket.id);
      socket.emit('getCount');
    });

    socket.on('connect_error', (err) => {
      console.error("Connection error:", err);
    });

    // Listen for count updates
    socket.on('updateCount', (newCount) => {
      console.log("Count updated:", newCount);
      setCount(newCount);
    });

    if (socket.connected) socket.emit('getCount');

    return () => {
      socket.off('updateCount');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  const handleToggle = () => {
    if (isSitting) {
      socket.emit('standUp');
      setIsSitting(false);
    } else {
      socket.emit('sitDown');
      setIsSitting(true);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>🚽 ¿Quién está en la taza?</h1>
      </header>

      <main>
        <Counter count={count} />
        <div className="button-wrapper">
          <ToiletButton isSitting={isSitting} onClick={handleToggle} />
        </div>
        {/* Helper debug for deployment troubleshooting */}
        <div style={{ padding: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          Debug: {import.meta.env.VITE_API_URL || 'Using localhost fallback'} <br />
          Status: {socket.connected ? 'Connected ✅' : 'Disconnected ❌'}
        </div>
      </main>

      <footer>
        <p>Una app inútil pero necesaria 💩</p>
      </footer>
    </div>
  )
}

export default App
