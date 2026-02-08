import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import ToiletButton from './components/ToiletButton'
import Counter from './components/Counter'
import './index.css' // We'll rely on global styles for now or module if preferred

// Connect to the server
const socket = io('http://localhost:3000');

function App() {
  const [count, setCount] = useState(0);
  const [isSitting, setIsSitting] = useState(false);

  useEffect(() => {
    // Listen for count updates
    socket.on('updateCount', (newCount) => {
      setCount(newCount);
    });

    return () => {
      socket.off('updateCount');
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
      </main>

      <footer>
        <p>Una app inútil pero necesaria 💩</p>
      </footer>
    </div>
  )
}

export default App
