# Lumina AI - Image Generation Platform

A full-stack AI image generation platform built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Hugging Face's Stable Diffusion API.

## Features
- **User Authentication**: Register and login securely using JWT.
- **Image Generation**: Create images from text prompts using Hugging Face Inference API.
- **Chat Sessions**: Organize your generated images in chat-style sessions.
- **History Gallery**: View, search, and paginate through your past creations.
- **Download**: Download your generated masterpieces directly.
- **Premium UI**: Sleek, modern, and fully responsive dark mode design.

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Lucide React, Vanilla CSS.
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **AI Provider**: Hugging Face (Stable Diffusion XL).

## Setup Instructions

1. Clone the repository.
2. Set up the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Usage
1. Register a new account.
2. Once logged in, type a prompt in the chat box (e.g., "A futuristic cyberpunk city at night with neon lights").
3. Wait a few seconds for the AI to generate your image.
4. Download the image or view your previous creations in the "History" tab.
