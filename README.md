# Luca-Adrian Mihuț - Personal Website

A nostalgic, authentic Windows 95-inspired portfolio website built with Vue 3, TypeScript, and Vite.

Features draggable desktop icons, authentic 3D beveled windows, taskbar window management, and interactive retro apps (System Properties, File Explorer, MS Paint, WordPad CV, and Control Panel).

---

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: Vanilla CSS (authentic Windows 95 design system)
- **Deployment**: [Docker](https://www.docker.com/) & [Nginx](https://nginx.org/)

---

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Docker Deployment

Build and run the production container with Docker Compose:

```bash
# Build and start container in detached mode
docker compose up -d --build
```

The site will be available at [http://localhost:8088](http://localhost:8088).

To stop the container:

```bash
docker compose down
```

---

## Project Structure

```text
├── public/              # Static assets, retro icons (.gif, .png), audio, media
├── src/
│   ├── components/
│   │   ├── Desktop.vue        # Desktop surface & draggable icon layout
│   │   ├── FileExplorer.vue   # Windows Explorer folder views
│   │   ├── Taskbar.vue        # Windows 95 taskbar, Start button, & system tray
│   │   └── WindowFrame.vue    # Reusable draggable window frame & controls
│   ├── data/                  # Typed project, CV, contact, and bio data
│   ├── App.vue                # Main desktop environment & window manager
│   ├── main.ts                # App entrypoint
│   └── style.css              # Global retro styles & Windows 95 UI theme
├── Dockerfile           # Multi-stage production build (Node.js -> Nginx)
├── docker-compose.yml   # Docker compose configuration (port 8088)
└── nginx.conf           # Production Nginx configuration (gzip, caching, SPA routing)
```

---

## License

MIT
