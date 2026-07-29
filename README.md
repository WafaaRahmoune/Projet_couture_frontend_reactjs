# KADI: Connected Sewing Platform (Frontend)

![React](https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

The **React frontend** of **KADI**, a connected sewing and e-commerce platform that links seamstresses, investors and clients, with built-in dropshipping and affiliate features. This repository is the client-side application; it consumes the KADI REST API.

**Live:** [projet-couture-frontend-reactjs.vercel.app](https://projet-couture-frontend-reactjs.vercel.app)

## Overview

A single-page application for the KADI platform, with dedicated spaces for **clients**, **seamstresses**, **dropshippers / affiliates** and **admins**.

## Features

- Public storefront with the catalog of sewing models
- Multi-role authentication (client, seamstress, dropshipper, admin) with email verification
- Admin dashboard: models, orders, affiliates, promo codes, and analytics with charts
- Multilingual UI (Arabic and French)
- Responsive interface with Material UI and Tailwind CSS, animations with Framer Motion

## Tech stack

React 18, Vite, Material UI, Radix UI, Tailwind CSS, axios, React Router, React Hook Form, Framer Motion, Recharts, React Toastify.

## Backend

This repository is the **frontend only**. It communicates with the KADI REST API (built with Django REST Framework). The full-stack version lives in [Sewing-Project](https://github.com/WafaaRahmoune/Sewing-Project).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run preview   # preview the build
```

The app calls the API at `https://api.kadi-inv.store`.

## Deployment

Deployed on Vercel: [projet-couture-frontend-reactjs.vercel.app](https://projet-couture-frontend-reactjs.vercel.app)

## License

Released under the MIT License. See [LICENSE](LICENSE).
