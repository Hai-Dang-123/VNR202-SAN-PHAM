
# Vietnam’s Path to Global Integration – The Living Book

This is an interactive 3D Augmented Reality web experience built using React, A-Frame, and MindAR.js. It brings to life the story of Vietnam's political and diplomatic transformation.

## Project Setup

This project is a single-page application built with React and TypeScript. All necessary dependencies are loaded via CDNs in `index.html`. No `npm install` is required for external libraries.

### Prerequisites

You'll need a local web server to run this project. This is because browser security policies restrict camera access (`getUserMedia`) for pages opened directly from the local file system (`file:///...`).

A simple way to start a server is using Python:
- If you have Python 3: `python -m http.server`
- If you have Python 2: `python -m SimpleHTTPServer`

Or you can use `npx`:
- `npx serve`

After starting the server, open your browser and navigate to the provided local address (e.g., `http://localhost:8000` or `http://localhost:3000`).

### Asset Setup

You need to create an `assets` folder in the project's root directory and place the necessary files inside it.

1.  **Create the `assets` folder:**
    ```
    /
    |-- assets/
    |-- components/
    |-- ... other files
    ```

2.  **Add the following files to the `assets` folder:**
    *   **Trigger Image (`vietnam_flag.png`):** This is the image the user will scan to trigger the AR experience. You can use any image you like.
    *   **MindAR Target File (`targets.mind`):** This is crucial. You must compile your trigger image into a `.mind` file.
        *   Go to the **[MindAR Online Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)**.
        *   Upload your `vietnam_flag.png` (or another trigger image).
        *   Download the compiled `targets.mind` file and place it in the `assets` folder.
    *   **Audio Files:**
        *   `background_music.mp3`: Ambient music for the experience.
        *   `page1_narration.mp3`: Voice-over for page 1.
        *   `page2_narration.mp3`: Voice-over for page 2.
        *   `page3_narration.mp3`: Voice-over for page 3.
    *   **Video File:**
        *   `page1_video.mp4`: Background video for page 1.

The final `assets` directory should look like this:
```
assets/
|-- background_music.mp3
|-- page1_narration.mp3
|-- page2_narration.mp3
|-- page3_narration.mp3
|-- page1_video.mp4
|-- targets.mind
|-- vietnam_flag.png
```

**Note:** For development, you can use placeholder silent audio files and a short video if you don't have the final assets ready.

## How to Use

1.  **Start your local web server** in the project's root directory.
2.  **Access the URL** on a mobile device that supports WebAR (most modern smartphones).
3.  **Grant camera permissions** when prompted.
4.  **Point your camera** at the physical trigger image (the one you used to create `targets.mind`).
5.  The 3D book will appear in AR. Interact with it by swiping pages and taking the quiz.

## Customization

*   **Trigger Image:** To change the trigger image, simply replace `vietnam_flag.png` and re-compile it to get a new `targets.mind` file.
*   **Content:** All text, models, and animations can be modified within the `components/ARScene.tsx` file.
*   **Quiz:** The quiz questions and logic are located in `components/QuizOverlay.tsx`.
