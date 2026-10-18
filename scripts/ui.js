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
    return `<tr>
      <td data-label="Title">${highlight(r.title, state.searchRe)}</td>
      <td data-label="Date">${highlight(r.date, state.searchRe)}</td>
      <td data-label="Duration">${highlight(String(dur), state.searchRe)}</td>
      <td data-label="Tag">${highlight(r.tag, state.searchRe)}</td>
      <td data-label="Action"><button type="button" data-edit="${r.id}">Edit</button>
      <button type="button" data-del="${r.id}">Delete</button></td>
    </tr>`;
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

  const cap = Number(state.settings.cap) || 0;
  const left = cap - sum;
  const box = $('capStatus');
  box.setAttribute('aria-live', left < 0 ? 'assertive' : 'polite');
  box.textContent = !cap
    ? 'No weekly cap set.'
    : (left >= 0 ? 'Under cap: ' : 'Over cap: ') +
      fromMinutes(Math.abs(left)) +
      ' ' + state.settings.unit +
      (left >= 0 ? ' remaining.' : ' over your target.');

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
    `<div class="bar" title="${day}: ${fromMinutes(totals[i])}" style="height: ${(totals[i] / max) * 100}%"></div>`
  ).join('');
}