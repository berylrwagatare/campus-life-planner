import { validateTitle, validateDate, validateDuration, validateTag } from './validators.js';
import { compileRegex } from './search.js';
import{ state, boot, addOrUpdate, remove, importRecords, exportJSON, updateSettings, toMinutes, fromMinutes } from './state.js';
import { renderAll } from './ui.js';


const $ = (id) => document.getElementById(id);
const say= (id, msg ) => { const el = $(id); if (el) el.textContent =msg;};
const on = (id, event, fn) => {
  const el = $(id);
  if (el) el.addEventListener(event, fn);
  else console.warn('Missing element in index.html: #'+id);
};


const capView= () => fromMinutes(state.settings.cap);

function resetForm() {
    $('taskForm' ).reset();
    $('editId').value='';
    $('saveBtn' ).textContent='Add task';
    $('cancelEdit').hidden= true;
}
boot();
$('unit').value = state.settings.unit;
$('cap').value= capView();
renderAll();

$('taskForm').addEventListener('submit', (e) =>  {  e.preventDefault();
   const title =$('title').value, date = $('dueDate').value , dur =
$('duration').value, tag = $('tag').value;
  $('titleError').textContent =validateTitle(title);
  $('dateError').textContent =validateDate(date);
  $('tagError').textContent =validateTag(tag);
  $('durationError').textContent = validateDuration(dur);
  if ($('titleError').textContent || $('dateError').textContent  || $('durationError').textContent ||$('tagError').textContent  ){ 
    return say('formStatus', 'Please fix the errors before saving.');
  }
  addOrUpdate({ id:$('editId').value || undefined, title, date,duration:toMinutes(dur), tag });
  resetForm();
  say('formStatus', 'Task saved.');
  renderAll();
});
$('cancelEdit').onclick = resetForm;
$('newTask').onclick =()  => {resetForm(); say('formStatus','');}

$('taskList'). addEventListener('click', (e) => {
    const { edit, del } = e.target.dataset;
    if (edit) {
      const rec =state.records.find((r) => r.id === edit);
    if (!rec) return;
    $('editId').value = rec.id;
    $('title').value = rec.title;
    $('dueDate').value = rec.date;
    $('duration').value = fromMinutes(rec.duration);
    $('tag').value = rec.tag;
    $('saveBtn').textContent = 'Update task';
    $('cancelEdit').hidden = false;
    }  
if(del && confirm('Delete this task?')) { remove(del); renderAll(); }
 });
  
 function applySearch() {
    const raw =$('search').value.trim();
    const re = compileRegex(raw, $('caseInsensitive').checked ? 'i' : '');
    state.searchRe = raw ? re : null;
    say ('searchStatus', !raw? '' : re ?  'Search ready.': 'Invalid regex. Try again.');
    renderAll();
 }

$('search').oninput =applySearch;
$('caseInsensitive').onchange = applySearch;
$('sortKey').onchange= () => { state.sortKey = $('sortKey').value; renderAll();  };
$('sortDir').onclick = () =>{ state.sortDir = state.sortDir === 'asc' ?  'desc': 'asc'; renderAll() ;};
$('unit').onchange = () =>{ updateSettings({ unit: $('unit').value});
$('cap').value = capView(); renderAll();}
$('cap').onchange = () => {
  const n = Number($('cap').value);
  if(!Number.isNaN(n)) updateSettings({ cap: toMinutes(n) });
  renderAll();
};
$('exportBtn').onclick= () => {
    const a = Object.assign(document.createElement('a'),{ download: 'planner-export.json'});
    a.href=URL.createObjectURL(new Blob([exportJSON()], { type:'application/json '}));
    a.click();
    say('settingsStatus','Exported JSON.');
};
async function loadList(data, ok){
    try { importRecords(data); say('settingsStatus',ok ); renderAll();  }
    catch (err) { say('settingsStatus', err.message); }
}
$('importFile').onchange = async (e) => {
    const f = e.target.files[0];
    if(!f) return;
      
    try{

      loadList(JSON.parse(await f.text()), 'Imported records.');
    }
    catch {
      say('settingsStatus', 'Invalid file : not valid  JSON.');
    }
};




