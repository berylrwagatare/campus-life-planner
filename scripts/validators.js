export const PATTERNS = {
    title: /^\S(?:.*\S)?$/,
    duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWord: /\b(\w+)\s+\1\b/i
};

export const validateTitle= (v)  =>
  !PATTERNS.title.test(v) ? 'No leading/trailing spaces.'
    : PATTERNS.duplicateWord.test(v) ?' Do not repeat a word twice in a row.' :' ';

    export const validateDuration = (v) => {
      const s = String(v);
      if (! PATTERNS.duration.test(s)) return 'Use a number like 90 or 1.5';
      return Number(s) > 0 ? '' : 'Duration must be greater than 0';
    }
    export const validateDate =(v) => {
      if (!PATTERNS.date.test(v)) return 'Use the format YYYY-MM-DD';
       const [y,  m,  d ] =v.split('-').map(Number);
       const dt = new Date(y, m - 1,  d);
       return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d  ? '' : 'That date does not exist' ;
    };


    export const validateTag = (v) =>
      PATTERNS.tag.test(v) ? '' : 'Letters, spaces anf hyphens only';

    export function validateRecord(rec) {
        if (!rec||  !rec.id) return 'Missing id';
        return validateTitle(rec.title || '')
          || validateDuration(rec.duration)
          || validateDate(rec.date || '')
          || validateTag(rec.tag || '');
    }
  