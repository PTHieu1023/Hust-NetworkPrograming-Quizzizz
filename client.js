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

    let currentSession;

    const handleAction = {
        'login': async () => {
            const username = await askQuestion("Enter username:");
            const password = await askQuestion("Enter password");
            const response = await sendMessage('127.0.0.1', 8080, 0x0000, { username, password });
            currentSession = response.sessionId;
            console.log('Server Response:', response);
        },
        'signUp': async () => {
            const username = await askQuestion("Enter username:");
            const password = await askQuestion("Enter password");
            const name = await askQuestion("Enter name: ");
            const response = await sendMessage('127.0.0.1', 8080, 0x0001, { username, password, name });
            console.log('Server Response:', response);
        },
        'logout': async () => {
            const response = await sendMessage('127.0.0.1', 8080, 0x0002, { sessionId: currentSession });
            console.log('Server Response:', response);
            currentSession = null;
        },
        'changePassword': async () => {
            const username = await askQuestion("Enter old password:");
            const password = await askQuestion("Enter new password:");
            const response = await sendMessage('127.0.0.1', 8080, 0x0003, { sessionId: currentSession, });
            console.log('Server Response:', response);
            currentSession = null;
        }
    }

    while (true) {
        const action = await askQuestion("Choose action");
        try {
            handleAction[action]();
        } catch (error) {
            console.error('Error:', error);
        }
    }
}


function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

main();
