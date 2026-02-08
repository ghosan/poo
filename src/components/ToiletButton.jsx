import React from 'react';

const ToiletButton = ({ isSitting, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`toilet-button ${isSitting ? 'sitting' : 'standing'}`}
            aria-label={isSitting ? "Terminar" : "Ir al baño"}
        >
            <span className="emoji">{isSitting ? '✅' : '🚽'}</span>
            <span className="text">
                {isSitting ? '¡Ya terminé!' : '¡Estoy en la taza!'}
            </span>
        </button>
    );
};

export default ToiletButton;
