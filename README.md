C.S. Media Manager
This is a React application that demonstrates routing, file validation, and media recording features. It is built to be a simple, self-contained starting point for your larger project.

Features
Client-side Routing: Uses useState to switch between different "pages" without a page reload.

File Upload Validation: Checks for valid file types (.wav, .flac, etc.) and size limits (50KB to 50MB).

Media Recording: Includes buttons to trigger permission requests for both audio-only and video+audio recording.

State Management: Utilizes React's Context API for simple, shared state.

UI: Styled with Tailwind CSS for a modern, responsive design.

How to use this code
Create a new React project using npx create-react-app my-app or a similar tool.

Navigate to the src folder in your project.

Replace the contents of your App.jsx with the code from the generated file.

Run npm start to see the application in your browser.

Troubleshooting Fast Refresh Issues
"Fast Refresh" is a React feature that reloads your components instantly as you save changes, preserving the state. If you encounter issues (e.g., the page doesn't update, or it reloads the entire application instead of just the component), here is a checklist to debug the problem in your local environment:

Check for Syntax Errors: The most common cause. Look for red underlines or error messages in your code editor or browser console. React will not hot-reload with syntax errors.

Verify Named Exports: Ensure you are not using a named export in a file that is also your default export.

Correct: export default App; and then import App from './App.jsx';

Incorrect: export function App() {...} and import { App } from './App.jsx';

Component Naming: Ensure your component functions start with a capital letter (e.g., function MyComponent()).

Hooks Rules: Be careful about the rules of hooks, such as calling them only at the top level of a function component.

Check for Infinite Loops: A useEffect hook without a dependency array that modifies state can cause an infinite re-render loop, which breaks Fast Refresh.

Browser Cache: Clear your browser cache and cookies, or try a different browser.

Terminal Output: Check the terminal where your app is running for any specific error messages related to Fast Refresh. They often provide clues about what's going wrong.

Dependencies: If you've just added a new library, check its documentation to ensure it's compatible with hot reloading.

This checklist should help you quickly identify and fix any Fast Refresh issues you encounter as you develop your application.