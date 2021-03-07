export default function formatCommand(command: string): string[] {
    command = command.replace(/^\s+/g, '');
    const commandArgs = command.split(' ');

    return commandArgs;
}