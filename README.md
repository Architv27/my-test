# My Vehicle Dashboard

This repository contains a sample **Vehicle Dashboard** application, which emulates motor RPM, battery levels, and other car parameters. The frontend is built with React (or Next.js), and the backend leverages **Firebase Cloud Functions** with Firestore as the database.

---

## Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Environment Variables](#environment-variables)  
5. [Running Locally](#running-locally)  
6. [Deployment](#deployment)  
7. [Firestore Database Access](#firestore-database-access)  
8. [Contact](#contact)

---

## Features

- **Motor Speed Setting:** Adjust speed via a slider, with real-time reflection in the motor RPM gauge.  
- **Battery Monitoring:** Displays battery percentage and temperature, with charging toggle.  
- **Power Consumption:** Shows positive consumption when the motor is active, negative when charging.  
- **Indicators:** Parking brake, check engine, motor high RPM, and battery low states.

---

## Prerequisites

- **Node.js** (v16 or v18 recommended)  
- **npm** or **yarn**  
- **Firebase CLI** (for deploying Cloud Functions)  
- **Git** (to clone the repository)

---

## Installation

```bash
# 1) Clone the Repository
git clone https://github.com/YourUsername/Vehicle-Dashboard.git
cd Vehicle-Dashboard

# 2) Install Dependencies
#   a) Frontend (React/Next.js)
cd frontend
npm install
cd ..

#   b) Functions (Firebase Cloud Functions)
cd functions
npm install
cd ..

# (Now you are back in the root of the project)
# Navigate to the frontend directory
cd frontend

# Start the development server
npm start
---
# Open your browser to http://localhost:3000 or the port specified in your setup
---
##Backend 

The backend is already hosted on live endpoints so just run the project locally or access it on the https://test-archit-verma.web.app

Backend
The backend is already hosted on live endpoints.
You can simply run the project locally for the frontend, or access it at:

Live Frontend: https://test-archit-verma.web.app
(Optional) Local Emulation: Use Firebase Emulators for testing Functions locally if needed.