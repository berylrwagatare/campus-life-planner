export function compileRegex(input , flags ='i') {
    try{ return input ? new RegExp(input , flags) : null; }
    catch { return null; }
}
export function highlight(text, re) {
    const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<' , '&lt ;' ).replaceAll('>' , '&gt; ');
    const str = String(text);
    if (!re) return esc(str);
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    let out = '', last = 0;
    for (const m of str.matchAll(g)) {
        if(!m[0]) continue;
        out += esc(str.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
        last= m.index + m[0].length;
    }
    return out + esc( str.slice(last));
}
export function matches(record, re){
    if(!re) return true;
    return re.test('${record.title}  ${record.tag}  ${record.date} ${record.duration}');
}