
import React, { useEffect, useRef } from 'react';
import arframe from '../aframe'; // Ensure custom components are registered




interface ARSceneProps {
    currentPage: number;
    isQuizVisible: boolean;
    onPageFlip: (direction: 'next' | 'prev') => void;
    onShowQuiz: () => void;
    onSceneReady: () => void;
    onArError: (event: any) => void;
}

const ARScene: React.FC<ARSceneProps> = ({ currentPage, isQuizVisible, onPageFlip, onShowQuiz, onSceneReady, onArError }) => {
    const sceneRef = useRef<any>(null);

    // useEffect(() => {
    //     const sceneEl = sceneRef.current;
    //     if (sceneEl) {
    //         const handlePageFlip = (e: any) => onPageFlip(e.detail.direction);
            
    //         sceneEl.addEventListener('arReady', onSceneReady);
    //         sceneEl.addEventListener('arError', onArError);
    //         sceneEl.addEventListener('page-flip', handlePageFlip);
    //         sceneEl.addEventListener('show-quiz', onShowQuiz);

    //         return () => {
    //             sceneEl.removeEventListener('arReady', onSceneReady);
    //             sceneEl.removeEventListener('arError', onArError);
    //             sceneEl.removeEventListener('page-flip', handlePageFlip);
    //             sceneEl.removeEventListener('show-quiz', onShowQuiz);
    //         };
    //     }
    // }, [onArError, onPageFlip, onSceneReady, onShowQuiz]);

    useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const bindEvents = () => {
        sceneEl.addEventListener('arReady', onSceneReady);
        sceneEl.addEventListener('arError', onArError);
        sceneEl.addEventListener('page-flip', (e: any) => onPageFlip(e.detail.direction));
        sceneEl.addEventListener('show-quiz', onShowQuiz);
    };

    if (sceneEl.hasLoaded) {
        bindEvents();
    } else {
        sceneEl.addEventListener('loaded', bindEvents);
    }

    return () => {
        sceneEl.removeEventListener('loaded', bindEvents);
        sceneEl.removeEventListener('arReady', onSceneReady);
        sceneEl.removeEventListener('arError', onArError);
        sceneEl.removeEventListener('page-flip', (e: any) => onPageFlip(e.detail.direction));
        sceneEl.removeEventListener('show-quiz', onShowQuiz);
    };
}, [onArError, onPageFlip, onSceneReady, onShowQuiz]);


    return (
        <a-scene

            ref={sceneRef}
            mindar-image="imageTargetSrc: /assets/targets.mind; autoStart: true; uiScanning: no; maxTrack: 1;"
            color-space="sRGB"
            renderer="colorManagement: true"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
        >
            <a-assets>
                <video id="doiMoiVideo" src="/assets/page1_video.mp4" loop={true} preload="auto" crossOrigin="anonymous"></video>
            </a-assets>
            
            <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse; objects: [data-raycastable];"></a-camera>

            <a-entity mindar-image-target="targetIndex: 0">
                
                {/* Cinematic Lighting */}
                <a-light type="ambient" color="#FFF" intensity="0.4"></a-light>
                <a-light type="directional" color="#FFDDB3" intensity="0.8" position="-2 3 2"></a-light>
                <a-light type="point" color="#FF9900" intensity="0.6" position="0 1 1"
                    animation="property: intensity; to: 0.8; dur: 2000; dir: alternate; loop: true">
                </a-light>

                {/* The Book */}
                <a-entity id="book" position="0 -0.5 0" rotation="0 0 0" page-flipper={`enabled: ${!isQuizVisible}`}>
                    <a-entity
                        animation__open="property: rotation; to: -10 90 0; startEvents: start-experience; dur: 2000; easing: easeInOutQuad"
                        animation__close="property: rotation; to: 0 90 0; startEvents: close-experience; dur: 1500; easing: easeInOutQuad"
                        rotation="0 90 0"
                    >
                        {/* Book Cover (invisible when open) */}
                        <a-box color="#8B0000" depth="0.05" height="1.5" width="1" position="0 0 -0.025" visible={false}></a-box>

                        {/* Page 1 (Left) & Page 2 (Right) */}
                        <a-entity id="page-group-1" visible={currentPage === 0 || currentPage === 1}>
                             {/* Left Page (Back of cover, visible from page 2 onwards) */}
                            <a-plane material="color: #FFFFFF; side: double" height="1.4" width="0.95" position="-0.5 0 0" rotation="0 -180 0" visible={currentPage > 0}></a-plane>

                            {/* Page 1 Content */}
                            <a-entity id="page1" rotation="0 -180 0" visible={currentPage === 0}>
                                <a-video src="#doiMoiVideo" width="0.9" height="0.6" position="-0.5 0.3 0.01"></a-video>
                                <a-text value="Reform and Overcome Crisis (1986-1996)" color="#DAA520" align="center" width="1.5" position="-0.5 -0.3 0.01"></a-text>
                                <a-entity particle-system="preset: dust; particleCount: 500; color: #FFD700,#FF6347" position="-0.5 0 0"></a-entity>
                            </a-entity>
                            
                            {/* Page 2 Content */}
                             <a-entity id="page2" visible={currentPage === 1}>
                                <a-plane material="color: #f0f0f0; side: double" height="1.4" width="0.95" position="0.5 0 0" ></a-plane>
                                <a-text value="Industrialization & Cooperation (1996-2001)" color="#333" align="center" width="1.5" position="0.5 0.5 0.01"></a-text>
                                <a-entity geometry="primitive: cylinder; radius: 0.1; height: 0.02" material="color: #666" position="0.3 0 0.05" animation="property: rotation; to: 0 0 360; loop: true; dur: 5000; easing: linear;"></a-entity>
                                <a-entity geometry="primitive: cylinder; radius: 0.15; height: 0.02" material="color: #888" position="0.7 0.2 0.05" animation="property: rotation; to: 0 0 -360; loop: true; dur: 7000; easing: linear;"></a-entity>
                            </a-entity>
                        </a-entity>
                        
                        {/* Page 3 (Left) & Page 4 (Right) */}
                        <a-entity id="page-group-2" visible={currentPage === 2 || currentPage === 3}>
                            {/* Page 3 Content */}
                            <a-entity id="page3" rotation="0 -180 0" visible={currentPage === 2}>
                                 <a-plane material="color: #f0f0f0; side: double" height="1.4" width="0.95" position="-0.5 0 0"></a-plane>
                                 <a-sphere radius="0.3" material="color: #3366ff; opacity: 0.8" position="-0.5 0.2 0.1" animation="property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear;"></a-sphere>
                                 <a-text value="Becoming a Reliable Partner (2001-2018)" color="#333" align="center" width="1.2" position="-0.5 -0.2 0.01"></a-text>
                                 <a-text value="Ready to be a friend and a trusted partner of all nations." color="#111" align="center" width="1" position="-0.5 -0.4 0.01" font="dejavu" wrap-count="35"></a-text>
                            </a-entity>

                             {/* Page 4 Content */}
                             <a-entity id="page4" visible={currentPage === 3}>
                                <a-plane material="color: #fff; side: double" height="1.4" width="0.95" position="0.5 0 0"></a-plane>
                                <a-text value="Test Your Knowledge" color="#8B0000" align="center" width="2" position="0.5 0.4 0.01"></a-text>
                                <a-cylinder quiz-button data-raycastable radius="0.2" height="0.1" material="color: #FFD700" position="0.5 0 0.05"
                                    animation="property: position; to: 0.5 0.05 0.05; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine"
                                >
                                    <a-text value="START QUIZ" color="#000" align="center" width="1.5" position="0 0.06 0" rotation="-90 0 0"></a-text>
                                </a-cylinder>
                             </a-entity>
                        </a-entity>

                    </a-entity>
                </a-entity>
                
                {/* Feedback Particles */}
                <a-entity id="correct-particles" visible="false" position="0 1 0" particle-system="preset: star; color: #00FF00,#008000; maxAge: 2; size: 0.2, 0.5"></a-entity>
                <a-entity id="wrong-particles" visible="false" position="0 1 0" particle-system="preset: default; color: #FF0000, #8B0000; maxAge: 2; size: 0.1, 0.3"></a-entity>

            </a-entity>
        </a-scene>
    );
};

export default ARScene;
