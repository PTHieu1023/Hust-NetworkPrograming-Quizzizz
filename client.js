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
            const oldPassword = await askQuestion("Enter old password:");
            const newPassword = await askQuestion("Enter new password:");
            const confirmPassword = await askQuestion("Enter confirm password:");
            const response = await sendMessage('127.0.0.1', 8080, 0x0003, { sessionId: currentSession, oldPassword, newPassword, confirmPassword });
            console.log('Server Response:', response);
            currentSession = null;
        },
        'createQuestion': async () => {
            const content = await askQuestion("Enter question content: ");
            const answers = []
            for (let i = 0; i < 4; i++) {
                const ac = await askQuestion(`Enter answer ${i} content: `);
                const at = await askQuestion(`Enter answer ${i} isTrue: `);
                answers.push({ content: ac, isTrue: at == 1 ? true : false })
            }
            const response = await sendMessage('127.0.0.1', 8080, 0x000c, { sessionId: currentSession, content, answers })
            console.log('Server Response:', response);
        },
        'getQuestions': async () => {
            const page = await askQuestion("Enter page: ");
            const response = await sendMessage('127.0.0.1', 8080, 0x000d, { sessionId: currentSession, page: parseInt(page) })
            console.log('Server Response:', response);
        },
        'getQuestion': async () => {
            const questionId = await askQuestion("Enter questionId");
            const response = await sendMessage('127.0.0.1', 8080, 0x0010, { sessionId: currentSession, questionId: parseInt(questionId) })
            console.log('Server Response:', JSON.stringify(response));
        },
        'test': async () => {
            payload = {
                sessionId: '459d5476-f16e-45ac-9287-d821d297eb39',
                title: "rtee",
                questions: [4, 5, 6, 7, 8, 9]
            }

            const response = await sendMessage('127.0.0.1', 8080, 0x0004, payload);
            console.log(response);
        }
    }

    while (true) {
        const action = await askQuestion("Choose action: ");
        try {
            await handleAction[action]();
        } catch (error) {
            console.error('Error:', error);
        }
    }
}


function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

main();