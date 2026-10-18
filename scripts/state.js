
const RECORDS_KEY ='clp:records';
const SETTINGS_KEY='clp:settings';


function load(key,startValue) {
    try { return JSON.parse(localStorage.getItem(key)) || startValue;  }
    catch (error) { return startValue; }
}


export const state ={
    records: load(RECORDS_KEY, []),
settings: load(SETTINGS_KEY, {unit: 'minutes',cap: 0}),
 searchRe:null,
 sortKey: 'date',
 sortDir: 'asc',
};

export function save(){
    try{
        localStorage.setItem(RECORDS_KEY, JSON.stringify(state.records));
        localStorage.setItem(SETTINGS_KEY,JSON.stringify(state.settings));
    }
    catch (error) { console.log('Could not save :',error.message); }
}

export function toMinutes(value) {
    if (state.settings.unit === 'hours') return Math.round(Number(value) *60);
    return Number(value);
}


function makeId() {
    const numbers = state.records.map((r) => Number(r.id.replace( 'rec_', '')));
    return 'rec_' + String(Math.max(0,...numbers) +1).padStart(4, '0');
}


export function addRecord(data) {
    const now = new Date().toISOString();
    state.records.push({...data, id: makeId(), createdAt: now, updatedAt: now });
    save();
}

export function deleteRecord(id) {
    state.records = state.records.filter((r)  => r.id !== id);
    save();
}
export function setSettings(changes){
    Object.assign(state.settings, changes);
    save();
}


export function setSearch( text, ignoreCase){
    try {
      state.searchRe = text === '' ? null : new RegExp(text, ignoreCase ? 'gi' :  'g');
      return true;  
    } catch ( error) { return false; }
}

export function boot() {
  state.records = load(RECORDS_KEY, []);
  state.settings = load(SETTINGS_KEY, {unit: 'minutes', cap: 0 });
}

export function addOrUpdate(data) {
  const i = state.records.findIndex((r) => r.id === data.id );
  if (i === -1) return addRecord(data);
  state.records[i] = { ...state.records[i], ...data, updatedAt: new Date().toISOString()  };
  save();
}

export const remove = deleteRecord;
export const updateSettings = setSettings;
export const exportJSON = () => JSON.stringify(state.records, null, 2);


export function importRecords(data) {
    if (!Array.isArray(data)) throw new Error('Invalid file: expected an array.');
    const bad = data.map(validateRecord).find(Boolean);
    if (bad) thrown new Error ('Invalid file: ' +bad);
    state.records= data;
    save();
}
