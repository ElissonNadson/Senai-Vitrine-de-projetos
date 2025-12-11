import React, { useEffect, useState } from 'react';

interface Particle {
    id: number;
    left: number;
    top: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
}

const ParticleBackground: React.FC = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate random particles
        const particleCount = 60; // Enough for a nice effect without lag
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 3 + 1, // 1px to 4px
                duration: Math.random() * 20 + 10, // 10s to 30s (slow float)
                delay: Math.random() * 5,
                opacity: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
            });
        }
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <style>
                {`
            @keyframes float-up {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) translateX(20px);
                    opacity: 0;
                }
            }
            @keyframes twinkle {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            `}
            </style>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: p.opacity,
                        animation: `float-up ${p.duration}s linear infinite, twinkle ${p.duration * 0.5}s ease-in-out infinite alternate`,
                        animationDelay: `-${p.delay}s`,
                        boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)' // Glow effect
                    }}
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
