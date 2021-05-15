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

    const uniqueString = `${new Date().toISOString()}${Date.now()}9736893562198756984129846781687161"'][-=9]`;

    data = data.replace(lineFound, `${uniqueString}${lineFound}`);

    const [printableMsgContent, rest] = data.split(uniqueString);

    if (rest && rest.length > 1900) {
        return [printableMsgContent, ...splitResponse(`${(lineFound.match(/\ /g) || []).map(() => '\u200b').join('')}${rest}`)];
    }

    return [printableMsgContent, rest];
}