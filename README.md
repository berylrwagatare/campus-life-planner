# Campus Life Planner

A small, accessible web app to plan assignments, study sessions, meetings and events.
Built with plain **HTML, CSS and JavaScript** (no libraries).

## Features

- Add, edit and delete tasks (title, date, duration, tag)
- Live **regex search** with highlighted matches
- Sort by date, title or duration
- Dashboard: total tasks, total time, top tag, last 7 days chart
- Time cap that tells you how much is left (or how far over you are)
- Show durations in minutes or hours
- Saves automatically in your browser (`localStorage`)
- Import and export your tasks as JSON
- Works on phones, tablets and laptops, and with the keyboard

## How to run

1. Open the folder in VS Code.
2. Right-click `index.html` and choose **Open with Live Server** (or click **Go Live**).

> Don't double-click `index.html`: the app uses JavaScript modules, which browsers block on plain files.

To load sample data, go to **Settings → Import JSON** and choose `seed.json`.
To run the tests, open `tests.html`.

## Files

| File | What it does |
|---|---|
| `index.html` | The page |
| `styles/style.css` | The looks |
| `scripts/state.js` | The data and saving |
| `scripts/validators.js` | Regex rules for the form |
| `scripts/search.js` | Regex search and highlighting |
| `scripts/storage.js` | Import and export |
| `scripts/ui.js` | Draws the page |
| `scripts/main.js` | Connects everything |
| `seed.json` | Sample tasks |
| `tests.html` | Small checks |


## DEMO VIDEO
https://youtu.be/LrinBDJC8Pk
