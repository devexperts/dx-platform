declare module 'react-dev-utils/WebpackDevServerUtils' {
    export function choosePort(host: string, defaultPort: number): Promise<number>
}