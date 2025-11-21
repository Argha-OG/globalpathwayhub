import React, { useEffect, useState } from 'react';

const MouseTracker = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
            style={{
                background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(109, 40, 217, 0.15), transparent 80%)`,
            }}
        />
    );
};

export default MouseTracker;
