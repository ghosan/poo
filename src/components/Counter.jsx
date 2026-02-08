import React from 'react';

const Counter = ({ count }) => {
    return (
        <div className="counter-container">
            <div className="counter-value">{count}</div>
            <p className="counter-text">
                {count === 1
                    ? "persona sentada en la taza ahora mismo 🧻"
                    : "personas sentadas en la taza contigo 🧻"
                }
            </p>
            {count === 0 && <p className="counter-text">¡Nadie está en la taza! ¿Serás el primero? 🏆</p>}
        </div>
    );
};

export default Counter;
