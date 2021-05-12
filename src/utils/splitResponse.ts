export default function splitResponse(data: string): string[] {
    if (!data) return [];

    let characters = 0;
    let lineFound = '';

    data.split(/\r\n|\r|\n/).forEach(line => {
        characters += line.length;

        if (characters >= 1900 && !lineFound) {
            lineFound = line;
        }
    });

    data = data.replace(lineFound, `:84386572823465367365,,,.....;;;;;;lllllll${lineFound}`);

    const [printableMsgContent, rest] = data.split(':84386572823465367365,,,.....;;;;;;lllllll');

    if (rest && rest.length > 1900) {
        return [printableMsgContent, ...splitResponse(`${(lineFound.match(/\ /g) || []).map(() => '\u200b').join('')}${rest}`)];
    }

    return [printableMsgContent, rest];
}