# Social Media Clone (Frontend)

## 🌟 Project Overview

This is the frontend repository for a full-stack social media application, meticulously crafted to mimic the core functionalities of modern social networks. Developed using **React.js** and styled with **Tailwind CSS**, this application provides a smooth, responsive, and intuitive user experience. The project focuses on a clean architecture and efficient state management to ensure scalability and maintainability.

## ✨ Key Features

- **Secure User Authentication:** Users can register, log in, and manage their sessions securely.
- **Dynamic Content Feed:** A scrollable feed displays posts from all users with infinite loading.
- **Interactive Post Actions:** Users can like posts and add comments in real-time.
- **User Profiles:** Each user has a dedicated profile page showcasing their posts and follower/following count.
- **Follow/Unfollow System:** Users can follow and unfollow others to personalize their content feed.
- **Image Uploads:** Integrates with Cloudinary for seamless and optimized image handling.
- **Responsive Design:** The application is fully responsive and works flawlessly on various devices.

## 🚀 Technologies Used

- **React.js:** For building the interactive and dynamic user interface.
- **Tailwind CSS:** A utility-first CSS framework for rapid and clean styling.
- **React Router DOM:** For client-side routing and navigation.
- **TanStack Query (React Query):** For efficient data fetching, caching, and state management. This greatly enhances application performance and user experience by eliminating redundant API calls.
- **Axios:** A promise-based HTTP client for making API requests to the backend.


## 🔗 Live Demo

- **Live URL:** [https://social-media-frontend-swart.vercel.app])
  
_Replace the URL with your actual Vercel deployment link._

## ⚙️ How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Kyaw-ZinT/social-media-frontend.git])
    cd social-media-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**
    * Create a `.env.local` file in the root directory.
    * Add your backend API URL. Make sure your backend is running and accessible.
        ```
        VITE_API_BASE_URL=http://localhost:5003/api 
        ```
        _Replace `5003` with your backend server's port if it's different._
4.  **Run the application:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
5.  Open your browser and navigate to `http://localhost:5173`.

---
_This README is designed to be clear, professional, and easy to follow for anyone, including a potential interviewer. It highlights your technical skills and project contributions effectively._
