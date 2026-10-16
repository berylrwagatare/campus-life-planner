import { validateTitle, validateDate, validateDuration, validateTag } from './validators.js';
import { compileRegex } from './search.js';
import{ state, boot, addOrUpdate, remove, importRecords, exportJSON, updateSettings, toMinutes, fromMinutes } from './state.js';
import { renderAll } from './ui.js';


const $ = (id) => document.getElementById(id);
const say= (id, msg ) => { $(id).textContent =msg;};
const capView= () => fromMinutes(state.settings.cap);
function resetForm() {
    $('taskForm').reset();
    $('editId').value ='';
    $('saveBtn').textContent= 'Add task';
    $('cancelEdit').hidden= true;
}
boot();
$('unit').value = state.settings.unit;
$('cap').value = capView();
renderAll();

{ 
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
    const a = Object.assign(document.createElement('a'),{ download: 'planner- export.json'});
    a.href=URL.createObjectURL(new Blob([exportJSON()], { type:'application/json '}));
    a.click();
    say('settingsStatus','Exported JSON.');
};
async function loadList(data, ok){
    try { importRecords(data); say('settingStatus',ok ); renderAll();  }
    catch (err) { say('settingsStatus', err.message); }
}
$('importFile').onchange = async (e) => {
    const f = e.target.files[0];
    if (f) loadList(JSON.parse(await f.text()), 'Imported records.');
};
$('loadSeed').onclick = async () => loadList(await (await fetch('seed.json')).json(), 'Loaded seed.json' );

}

