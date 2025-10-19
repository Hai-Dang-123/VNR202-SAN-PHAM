// Fix: Removed `declare const AFRAME: any;` to prevent a redeclaration error.
// The global AFRAME object is now declared in `aframe.d.ts`.
// aframe.ts
// Ensure this file is a module
export {};

// Make AFRAME global
declare global {
  var AFRAME: any;
}

// Wait until AFRAME is loaded
if (typeof window !== 'undefined') {
  if (!window.AFRAME) {
    console.error('AFRAME is not loaded!');
  } else {
    const AFRAME = window.AFRAME;

    // Polyfill for THREE.Math.generateUUID if missing
    if (!AFRAME.THREE?.Math?.generateUUID) {
      if (AFRAME.THREE?.Math) {
        AFRAME.THREE.Math.generateUUID = function () {
          // Simple UUID generator
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        };
        console.log('THREE.Math.generateUUID polyfilled');
      }
    }

// Component to handle swipe gestures for page flipping
AFRAME.registerComponent('page-flipper', {
    schema: {
        enabled: {type: 'boolean', default: true}
    },
    init: function () {
        this.startX = 0;
        this.isDragging = false;
        
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        
        this.el.sceneEl.canvas.addEventListener('mousedown', this.onMouseDown);
        this.el.sceneEl.canvas.addEventListener('mousemove', this.onMouseMove);
        this.el.sceneEl.canvas.addEventListener('mouseup', this.onMouseUp);
        
        this.el.sceneEl.canvas.addEventListener('touchstart', this.onMouseDown);
        this.el.sceneEl.canvas.addEventListener('touchmove', this.onMouseMove);
        this.el.sceneEl.canvas.addEventListener('touchend', this.onMouseUp);
    },
    onMouseDown: function (evt: any) {
        if (!this.data.enabled) return;
        this.isDragging = true;
        this.startX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    },
    onMouseMove: function (evt: any) {
        // We only care about the end position, so this can be empty
    },
    onMouseUp: function (evt: any) {
        if (!this.isDragging || !this.data.enabled) return;
        this.isDragging = false;

        const endX = evt.changedTouches ? evt.changedTouches[0].clientX : evt.clientX;
        const deltaX = endX - this.startX;
        
        if (Math.abs(deltaX) > 50) { // Swipe threshold
            const direction = deltaX < 0 ? 'next' : 'prev';
            this.el.sceneEl.emit('page-flip', { direction: direction });
        }
    },
    remove: function () {
        this.el.sceneEl.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.el.sceneEl.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.el.sceneEl.canvas.removeEventListener('mouseup', this.onMouseUp);
        
        this.el.sceneEl.canvas.removeEventListener('touchstart', this.onMouseDown);
        this.el.sceneEl.canvas.removeEventListener('touchmove', this.onMouseMove);
        this.el.sceneEl.canvas.removeEventListener('touchend', this.onMouseUp);
    }
});

// Component for the quiz button
AFRAME.registerComponent('quiz-button', {
    init: function () {
        this.el.addEventListener('click', (evt: any) => {
            this.el.sceneEl.emit('show-quiz');
        });

        // Add visual feedback for hovering
        this.el.addEventListener('mouseenter', () => {
            this.el.setAttribute('material', 'emissive', '#FFFF00');
            this.el.setAttribute('material', 'emissiveIntensity', 0.5);
        });
        this.el.addEventListener('mouseleave', () => {
            this.el.setAttribute('material', 'emissive', '#000000');
            this.el.setAttribute('material', 'emissiveIntensity', 0);
        });
    }
});
    }
}