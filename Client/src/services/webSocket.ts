// src/services/websocket.service.ts
export class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private messageHandlers: Map<number, (data: any) => void> = new Map();

    private constructor() {
        this.connect();
    }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    private connect() {
        this.socket = new WebSocket('ws://localhost:8081');
        this.socket.binaryType = 'arraybuffer';

        this.socket.onmessage = async (event) => {
            if (event.data instanceof ArrayBuffer) {
                const view = new DataView(event.data);
                const opcode = view.getInt16(0);
                const text = new TextDecoder().decode(event.data.slice(2));
                
                const handler = this.messageHandlers.get(opcode);
                if (handler) {
                    handler(JSON.parse(text));
                }
            }
        };

        this.socket.onclose = () => {
            setTimeout(() => this.connect(), 5000);
        };
    }

    send(opcode: number, payload: any) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

        const jsonStr = JSON.stringify(payload);
        const buffer = new ArrayBuffer(2 + jsonStr.length);
        const view = new DataView(buffer);
        view.setInt16(0, opcode);

        const encoder = new TextEncoder();
        const jsonBytes = encoder.encode(jsonStr);
        new Uint8Array(buffer).set(jsonBytes, 2);

        this.socket.send(buffer);
    }

    onMessage(opcode: number, handler: (data: any) => void) {
        this.messageHandlers.set(opcode, handler);
    }

    removeHandler(opcode: number) {
        this.messageHandlers.delete(opcode);
    }
}

export default WebSocketService;