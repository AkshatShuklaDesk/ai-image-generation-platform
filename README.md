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

### Option 1: Docker (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Clone this repository.
3. Rename `.env.example` to `.env` and add your `HF_API_TOKEN` (get one for free at [Hugging Face](https://huggingface.co/settings/tokens)).
4. Run the following command from the root directory:
   ```bash
   docker-compose up --build
   ```
5. The application will be available at `http://localhost`.

### Option 2: Local Setup
1. Ensure Node.js and MongoDB are installed locally.
2. Clone the repository.
3. Set up the backend:
   ```bash
   cd backend
   cp ../.env.example .env
   # Edit .env and add your HF_API_TOKEN
   npm install
   npm start
   ```
4. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).

## Usage
1. Register a new account.
2. Once logged in, type a prompt in the chat box (e.g., "A futuristic cyberpunk city at night with neon lights").
3. Wait a few seconds for the AI to generate your image.
4. Download the image or view your previous creations in the "History" tab.
