Roast.io - The Professional Roast Bot

https://roast-io.vercel.app/

Roast.io is a full-stack web application designed to deliver humorous and sarcastic roasts of a user's professional online presence. The application uses Groq to analyze a person's GitHub and LinkedIn profiles and generates witty and observational commentary.
Tech Stack

    Frontend: React (created with Vite)

    Backend: Python with Flask

    AI Model: Groq

    Hosting:

        Frontend: Vercel

        Backend: Render

Backend Setup (Flask API)

This API serves the backend for Roast.io, handling all requests to external services like GitHub, LinkedIn, and the Groq AI model.
Prerequisites

To run the backend locally, you need Python installed on your machine. Install the required dependencies using pip:

pip install -r requirements.txt

Environment Variables

The application uses environment variables for secure access to external APIs. Create a .env file in the root of your backend directory and add the following variables:

GROQ_API_KEY=your_groq_api_key
APIFY_API_TOKEN=your_apify_api_token
GITHUB_PAT=your_github_personal_access_token

API Endpoints

The Flask application exposes the following endpoints:

    POST /githubRepo

        Description: Fetches a list of public repositories for a given GitHub username.

        Request Body: {"username": "github-username"}

        Response: A JSON object containing a list of repository names.

    POST /githubCommits

        Description: Fetches the last 10 commit messages from a specified repository and generates a humorous roast.

        Request Body: {"username": "github-username", "repo": "repository-name"}

        Response: A JSON object with the generated roast.

    POST /linkedin

        Description: Scrapes a LinkedIn profile and generates a roast based on the user's headline and posts.

        Request Body: {"username": "linkedin-profile-url"}

        Response: A JSON object with the generated roast.

Deployment

The frontend and backend are deployed on separate platforms:

    Frontend (Vercel): The React application is a static site hosted on Vercel. Its API calls are configured to point to the Render backend URL.

    Backend (Render): The Flask application is a web service hosted on Render. It handles the API requests and performs the heavy lifting of calling external services.

