
let socket: WebSocket | null = null;
const BASE_URL = "ws://192.168.101.10:3027"; 

export const connectSocket = (token: string, onMessageReceived: (data: any) => void) => {
    // 1. ЕСЛИ СОКЕТ УЖЕ ЕСТЬ - ОБНОВЛЯЕМ СЛУШАТЕЛЯ (чтобы звонок мог получать сообщения)
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Socket already connected, updating listener for Call");
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessageReceived(data);
            } catch (e) {
                console.log("Received non-JSON message:", event.data);
            }
        };
        return;
    }


    if (socket) {
        socket.close();
        socket = null;
    }

    const url = `${BASE_URL}/ws/add?token=${token}`;
    console.log("Connecting to:", url);

    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessageReceived(data);
        } catch (e) {
            console.log("Received non-JSON message:", event.data);
        }
    };

    socket.onerror = (e) => {
        console.log("WebSocket Error:", e);
    };

    socket.onclose = () => {
        console.log("WebSocket Disconnected");
        socket = null;
    };
};

// Твоя старая функция (оставляем, чтобы не сломать чат)
export const sendSocketMessage = (text: string, serverLink: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({
            text: text,
            link: serverLink,
            type: "sendInGroup"
        });
        socket.send(payload);
    } else {
        console.warn("Cannot send message: Socket is not open");
    }
};

// --- ДОБАВЬ ЭТУ ФУНКЦИЮ ДЛЯ ЗВОНКОВ ---
export const sendJsonMessage = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify(data);
        socket.send(payload);
    } else {
        console.warn("Cannot send JSON: Socket is not open");
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};