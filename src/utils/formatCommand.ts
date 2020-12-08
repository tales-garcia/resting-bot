export default function formatCommand(command: string): string[] {
    command = command.replace(/^\s+/g, '');
    const [action, url] = command.split(' ');

    return [action, url];
}