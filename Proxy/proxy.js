const WebSocket = require('ws');
const net = require('net');

const WS_PORT = 8081;
const TCP_PORT = 8080;
const TCP_HOST = 'localhost';

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    const tcpClient = new net.Socket();
    
    tcpClient.connect(TCP_PORT, TCP_HOST, () => {
        console.log('Connected to TCP server');
    });

    ws.on('message', (data) => {
        tcpClient.write(data);
    });

    tcpClient.on('data', (data) => {
        ws.send(data);
    });

    ws.on('close', () => {
        tcpClient.destroy();
    });

    tcpClient.on('close', () => {
        ws.close();
    });

    tcpClient.on('error', (error) => {
        console.error('TCP error:', error);
        ws.close();
    });
});

console.log(`WebSocket proxy running on ws://localhost:${WS_PORT}`);