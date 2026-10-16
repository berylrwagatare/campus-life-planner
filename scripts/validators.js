export const PATTERNS = {
    title: /^\S(?:.*\S)?$/,
    duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWord: /\b(\w+)\s+\1\b/i
};
export const validateTitle= (v)  =>
  !PATTERNS.title.test(v) ? 'No leading/trailing spaces. '
    : PATTERNS.duplicateWord.test(v) ?' Do not repeat a word twice in a row.' :' ';
    export const validateDuration = (v) =>
      PATTERNS.duration.test(String(v)) ? '' : 'Use a number like 90 or 1.5';
    export const validateDate =(v) =>
      PATTERNS.date.test(v) ? '' : 'Letters, spaces and hyphens only';
    export function validateRecord(rec) {
        if (!rec||  !rec.id) return 'Missing id';
        return validateTitle(rec.title ||'')
             validateDuration(rec.duration)
             validateDate(rec.date || rec.duedate || '')
             validateTag(rec.tag || '');
    }
  