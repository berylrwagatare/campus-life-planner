import { state, fromMinutes } from './state.js';
import { highlight, matches } from './search.js';

const $ = (id) => document.getElementById(id);
const unit = () => (state.settings.unit === 'hours' ? ' h' : ' min');

const localISO = (d) => [
  d.getFullYear(),
  String(d.getMonth() + 1).padStart(2, '0'),
  String(d.getDate()).padStart(2, '0')
].join('-');

export function renderAll() {
  const dir = state.sortDir === 'asc' ? 1 : -1;
  const rows = state.records
    .filter((r) => matches(r, state.searchRe))
    .sort((a, b) => {
      if (state.sortKey === 'duration') return (a.duration - b.duration) * dir;
      if (state.sortKey === 'title') return a.title.localeCompare(b.title) * dir;
      return a.date.localeCompare(b.date) * dir;
    });

  $('taskList').innerHTML = rows.map((r) => {
    const dur = fromMinutes(r.duration) + unit();
    return `<li>
      <strong>${highlight(r.title, state.searchRe)}</strong><br>
      ${highlight(r.date, state.searchRe)} . ${highlight(String(dur), state.searchRe)} . ${highlight(r.tag, state.searchRe)}<br>
      <button type="button" data-edit="${r.id}">Edit</button>
      <button type="button" data-del="${r.id}">Delete</button>
    </li>`;
  }).join('');

  $('emptyMessage').hidden = rows.length > 0;

  const recs = state.records;
  const sum = recs.reduce((n, r) => n + r.duration, 0);
  $('totalTasks').textContent = recs.length;
  $('sumDuration').textContent = fromMinutes(sum) + unit();

  const counts = {};
  recs.forEach((r) => {
    counts[r.tag] = (counts[r.tag] || 0) + 1;
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  $('topTag').textContent = top ? top[0] : '-';

  const capNow = Number(state.settings.cap) || 0;
  const leftNow= capNow - sum;
  const fmt = (m) => `${Math.floor(Math.abs(m) / 60)}h ${Math.abs(m)% 60}min`;
 $('timeLeft').textContent = !capNow ? 'No cap set' : leftNow >= 0 ? fmt(leftNow) : `Over by ${fmt(leftNow)}`;
  const box = $('capStatus');
  box.setAttribute('aria-live', leftNow < 0 && capNow ? 'assertive' : 'polite');
  box.textContent = !capNow
    ? 'No cap set.'
    : leftNow >= 0 ? `Under cap: ${fromMinutes(leftNow)}  ${state.settings.unit}  remaining.`
     : `Over cap: ${fromMinutes(-leftNow)} ${state.settings.unit} over your target. `;
      

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return localISO(d);
  });

  const totals = days.map((day) =>
    recs.filter((r) => r.date === day).reduce((n, r) => n + r.duration, 0)
  );
  const max = Math.max(1, ...totals);
  $('chart').innerHTML = days.map((day, i) =>
    `<div class="bar" title="${day}: ${fromMinutes(totals[i])}${unit()} " style="flex:1; background:#dc5eef; min-height:2px; height: ${(totals[i] / max) * 100}%"></div>`
  ).join('');
}