// Fix: Added `export {}` to make this a module, which is required for global augmentations.
// This resolves the error about `declare global` needing to be in a module and enables JSX type definitions.
// Fix: Added AFRAME to global scope to be used across the app without redeclaring it.
declare global {
  // Fix: Changed from `const` to `var` to avoid "Cannot redeclare block-scoped variable" error.
  var AFRAME: any;
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-camera': any;
      'a-box': any;
      'a-plane': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-text': any;
      'a-sky': any;
      'a-light': any;
      'a-video': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-animation': any;
    }
  }
}

export {};
