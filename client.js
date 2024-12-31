const net = require('net');
const readline = require('readline');

// Function to send a message to the server
async function sendMessage(host, port, actionCode, payload) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        // Connect to the server
        client.connect(port, host, () => {
            console.log('Connected to server.');
            const payloadStr = JSON.stringify(payload);

            const buffer = Buffer.alloc(1024);
            buffer.writeUInt16BE(actionCode, 0);
            buffer.write(payloadStr, 2, 'utf8');

            client.write(buffer);
        });

        // Handle server response
        client.on('data', (data) => {
            try {
                console.log(data);
                const res = JSON.parse(data);
                client.destroy();
                resolve(res);
            } catch (error) {
                reject(`Failed to parse response: ${error.message}`);
            }
        });

        client.on('error', (err) => {
            reject(`Connection error: ${err.message}`);
        });

        client.on('close', () => { });
    });
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


async function main() {
    while (true) {
        const session_id = await askQuestion('Enter session_id: ');
        // const password = await askQuestion('Enter password: ');

        const payload = { session_id };

        try {
            // Send data with action code 0x0002
            const response = await sendMessage('127.0.0.1', 8080, 0x0002, payload);
            console.log('Server Response:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}


function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

main();
