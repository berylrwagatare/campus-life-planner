export function compileRegex(input , flags ='i') {
    try{ return input ? new RegExp(input , flags) : null; }
    catch { return null; }
}
export function highlight(text, re) {
    const safe = String(text).replaceAll('&', '&amp;').replaceAll('<' , '&lt ;' ).replaceAll('>' , '&gt; ');
    return re? safe.replace(re, (m) => '<marks>${m}</marks>' ) : safe;
}
export function matches(record, re){
    if(!re) return true;
    return re.test('${record.title}  ${record.tag}  ${record.date} ${record.duration}');
}