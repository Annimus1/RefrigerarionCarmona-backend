import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

export const client = new Client();

client.on('ready', () => {
	console.log("Client's ready!")
});

export function sendMsg(text) {
	// groupID
	const groupID = "120363315942226491@g.us"
	// Getting chatId from the number.
	// we have to delete "+" from the beginning and add "@c.us" at the end of the number.
	// const chatId = number.substring(1) + "@c.us";

	// Sending message.
	client.sendMessage(groupID, text);
}

client.on('qr', qr => {
	qrcode.generate(qr, { small: true });
});

client.initialize();