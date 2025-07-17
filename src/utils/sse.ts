import { Response } from 'express';

export class SSEWriter {
    private res: Response;

    constructor(res: Response) {
        this.res = res;
        this.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
    }

    write(event: string, data: any) {
        this.res.write(`event: ${event}\n`);
        this.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    error(error: any) {
        this.write('error', { error: error.message || 'Unknown error' });
    }

    close() {
        this.res.end();
    }
}
