# Luca-Adrian Mihuț - Personal Website

A Windows 95-inspired personal portfolio built with Vue, TypeScript, and Vite.

## Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The About Me window opens automatically. Desktop icons use single-click selection and double-click opening, matching the Windows 95 interaction model.

## Build

```bash
npm run build
npm run preview
```

## Project structure

- `src/App.vue` owns desktop state, window state, focus order, dragging, and content composition.
- `src/components/Desktop.vue` renders selectable and draggable desktop icons.
- `src/components/WindowFrame.vue` renders reusable title bars and window controls.
- `src/components/FileExplorer.vue` renders the Projects Explorer view.
- `src/components/Taskbar.vue` renders Start, open-window buttons, and the clock.
- `src/data/` contains typed CV, project, contact, and blog data.
- `public/icons/` contains the Windows 95 and GifCities-style assets.

## PHP endpoint

`api/profile.php` is an optional JSON endpoint for PHP-capable hosting. Vite serves the frontend but does not execute PHP. For local PHP testing, run a PHP server from the project root:

```bash
php -S localhost:8080
```

Then visit `/api/profile.php` on that server. The current Vue app uses typed local data so frontend development does not depend on PHP being available.

## Privacy

The public interface intentionally excludes the CV's date of birth, phone number, and full residential addresses. Professional contact links and email are included.
