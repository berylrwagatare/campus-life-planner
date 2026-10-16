const KEY ='campus-planner :v1';
export const load = () => { try{  return JSON.parse(localStorage.getItem(KEY) || 'null') ; }  catch { return null; } };
export const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));