
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ARScene from './components/ARScene';
import QuizOverlay from './components/QuizOverlay';
import './ar-components';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isQuizVisible, setQuizVisible] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [arError, setArError] = useState<string | null>(null);

    const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);

    const narrationTracks = [
        '/assets/page1_narration.mp3',
        '/assets/page2_narration.mp3',
        '/assets/page3_narration.mp3',
        ''
    ];

    const playNarration = useCallback((pageIndex: number) => {
        if (narrationAudioRef.current) {
            narrationAudioRef.current.pause();
            narrationAudioRef.current.currentTime = 0;
        }
        const track = narrationTracks[pageIndex];
        if (track) {
            if (!narrationAudioRef.current) {
                narrationAudioRef.current = new Audio(track);
            } else {
                narrationAudioRef.current.src = track;
            }
            narrationAudioRef.current.play().catch(e => console.error("Narration play failed:", e));
        }
    }, [narrationTracks]);

    useEffect(() => {
        backgroundAudioRef.current = new Audio('/assets/background_music.mp3');
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = 0.3;

        const startAudio = () => {
            backgroundAudioRef.current?.play().catch(e => console.error("Audio play failed:", e));
            document.body.removeEventListener('click', startAudio);
            document.body.removeEventListener('touchend', startAudio);
        };

        document.body.addEventListener('click', startAudio);
        document.body.addEventListener('touchend', startAudio);

        return () => {
            backgroundAudioRef.current?.pause();
            narrationAudioRef.current?.pause();
            document.body.removeEventListener('click', startAudio);
            document.body.removeEventListener('touchend', startAudio);
        };
    }, []);

    const handleSceneReady = useCallback(() => {
        // Give it a moment to stabilize before hiding the loader
        setTimeout(() => setShowLoading(false), 1000);
    }, []);

    const handleArError = useCallback((event: any) => {
        const errorMessage = event.detail?.error === 'CAMERA_ERROR'
            ? "Camera access denied. Please allow camera permissions in your browser settings to use the AR feature."
            : "An error occurred while loading the AR engine.";
        setArError(errorMessage);
        setShowLoading(false); // Hide spinner, show error
    }, []);

    const handlePageFlip = useCallback((direction: 'next' | 'prev') => {
        setCurrentPage(prev => {
            let nextPage = direction === 'next' ? prev + 1 : prev - 1;
            if (nextPage > 3) nextPage = 0;
            if (nextPage < 0) nextPage = 3;
            playNarration(nextPage);
            return nextPage;
        });
    }, [playNarration]);

    const handleShowQuiz = useCallback(() => {
        setQuizVisible(true);
        backgroundAudioRef.current?.pause();
        narrationAudioRef.current?.pause();
    }, []);

    const handleCloseQuiz = useCallback(() => {
        setQuizVisible(false);
        backgroundAudioRef.current?.play().catch(e => console.error("Audio resume failed:", e));
    }, []);

    const handleAnswerFeedback = (isCorrect: boolean) => {
        const particleEntity = document.querySelector(isCorrect ? '#correct-particles' : '#wrong-particles');
        if (particleEntity) {
            particleEntity.setAttribute('visible', 'true');
            setTimeout(() => {
                if (particleEntity.parentElement) {
                    particleEntity.setAttribute('visible', 'false');
                }
            }, 2000);
        }
    };

    const handleRestart = () => {
        setCurrentPage(0);
        setQuizVisible(false);
        playNarration(0);
        backgroundAudioRef.current?.play().catch(e => console.error("Audio restart failed:", e));
    }

    return (
        <>
            {(showLoading || arError) && (
                 <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-white text-center p-4 z-50">
                    {showLoading && !arError && (
                        <>
                            <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-lg">Initializing AR Engine...</p>
                            <p className="text-sm mt-2">Point your camera at the trigger image.</p>
                        </>
                    )}
                    {arError && (
                         <>
                            <p className="text-xl font-bold text-red-500">AR Error</p>
                            <p className="mt-2">{arError}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg">
                                Reload
                            </button>
                        </>
                    )}
                </div>
            )}
            {!isQuizVisible && !showLoading && !arError && (
                 <button onClick={handleRestart} className="absolute top-4 right-4 bg-white bg-opacity-70 text-black px-4 py-2 rounded-lg shadow-lg hover:bg-opacity-90 transition-all z-20">
                    Restart
                </button>
            )}
            <ARScene
                currentPage={currentPage}
                onPageFlip={handlePageFlip}
                onShowQuiz={handleShowQuiz}
                isQuizVisible={isQuizVisible}
                onSceneReady={handleSceneReady}
                onArError={handleArError}
            />
            {isQuizVisible && (
                <QuizOverlay
                    onClose={handleCloseQuiz}
                    onAnswer={handleAnswerFeedback}
                />
            )}
        </>
    );
};

export default App;
