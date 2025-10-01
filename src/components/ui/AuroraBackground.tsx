"use client";

export function AuroraBackground() {
    return (
        <div className="aurora-background">
            <div className="aurora-gradient aurora-gradient-1"></div>
            <div className="aurora-gradient aurora-gradient-2"></div>
            <div className="aurora-gradient aurora-gradient-3"></div>

            <style jsx>{`
                .aurora-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 800px;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.7;
                }

                .aurora-gradient {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    will-change: transform, opacity;
                }

                /* Pink gradient */
                .aurora-gradient-1 {
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(255, 0, 106, 0.13) 0%, transparent 70%);
                    top: -250px;
                    left: 5%;
                    animation: aurora-float-1 20s ease-in-out infinite;
                }

                /* Blue gradient */
                .aurora-gradient-2 {
                    width: 800px;
                    height: 800px;
                    background: radial-gradient(circle, rgba(52, 116, 219, 0.3) 0%, transparent 70%);
                    top: -300px;
                    right: 10%;
                    animation: aurora-float-2 25s ease-in-out infinite;
                }

                /* Light grey/white gradient */
                .aurora-gradient-3 {
                    width: 650px;
                    height: 650px;
                    background: radial-gradient(circle, rgba(148, 163, 184, 0.2) 0%, transparent 70%);
                    top: -200px;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: aurora-float-3 18s ease-in-out infinite;
                }

                @keyframes aurora-float-1 {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.6;
                    }
                    25% {
                        transform: translate(30px, 20px) scale(1.1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translate(-20px, 40px) scale(0.95);
                        opacity: 0.7;
                    }
                    75% {
                        transform: translate(10px, -10px) scale(1.05);
                        opacity: 0.75;
                    }
                }

                @keyframes aurora-float-2 {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.5;
                    }
                    33% {
                        transform: translate(-30px, 30px) scale(1.15);
                        opacity: 0.7;
                    }
                    66% {
                        transform: translate(20px, -20px) scale(0.9);
                        opacity: 0.6;
                    }
                }

                @keyframes aurora-float-3 {
                    0%, 100% {
                        transform: translate(-50%, 0) scale(1);
                        opacity: 0.4;
                    }
                    40% {
                        transform: translate(-50%, 30px) scale(1.2);
                        opacity: 0.6;
                    }
                    80% {
                        transform: translate(-50%, -15px) scale(0.85);
                        opacity: 0.5;
                    }
                }

                /* Dark mode adjustments */
                @media (prefers-color-scheme: dark) {
                    .aurora-background {
                        opacity: 0.6;
                    }
                    
                    .aurora-gradient-1 {
                        background: radial-gradient(circle, rgba(255, 0, 106, 0.13) 0%, transparent 70%);
                    }
                    
                    .aurora-gradient-2 {
                        background: radial-gradient(circle, rgba(52, 116, 219, 0.22) 0%, transparent 70%);
                    }
                    
                    .aurora-gradient-3 {
                        background: radial-gradient(circle, rgba(148, 163, 184, 0.15) 0%, transparent 70%);
                    }
                }

                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .aurora-gradient {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}

