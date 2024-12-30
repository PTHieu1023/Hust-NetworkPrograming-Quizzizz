const net = require('net');

const client = new net.Socket();

const host = '127.0.0.1';
const port = 8080;

client.connect(port, host, () => {
    console.log('Connected to server');

    const actionCode = 0x1234; // Example action code
    const payload = JSON.stringify({ username: "ccc" });

    // Prepare buffer
    const buffer = Buffer.alloc(1024);
    buffer.writeUInt16BE(actionCode, 0); // Write action code
    buffer.write(payload, 2, 'utf8'); // Write payload

    client.write(buffer); // Send message
});

client.on('data', (data) => {
    try {
        const parsedPayload = JSON.parse(data);
        console.log('Response:', parsedPayload);
    } catch (err) {
        console.error('Error parsing response:', err.message);
    }
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
});

client.on('close', () => {
    console.log('Connection closed');
});

process.on('SIGINT', () => {
    client.end(() => {
        console.log('Client closed. Exiting.');
        process.exit();
    });
});
