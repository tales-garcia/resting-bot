import AppError from "../errors/AppError";

export default function formatCommand(command: string): string[] {
    command = command.replace(/^\s+/g, '');
    const [action, url] = command.split(' ');

    if (!url) {
        throw new AppError(`The command ***${action}*** requires an URL`);
    }

    return [action, url];
}