class WebSocketService {
    constructor(url) {
        this.url = url;
        this.connection = null;
        this.callbacks = {};
    }

    connect() {
        if (this.connection && this.connection.readyState === WebSocket.OPEN) {
            console.log('WebSocket is already connected');
            return; // Avoid reconnecting if already connected
        }
        
        this.connection = new WebSocket(this.url);

        this.connection.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.connection.onmessage = (event) => {
            this.handleMessage(event);
        };

        this.connection.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.connection.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    handleMessage(event) {
        try {
            const data = JSON.parse(event.data); // Parse JSON data from the server
            // if (this.callbacks['newOrder']) {
            //     this.callbacks['newOrder'](data.payload); // Pass only the payload (orderId) to the callback
            // }
            const eventType = data.event;
             // Check if there's a registered callback for this event type
             if (this.callbacks[eventType]) {
                this.callbacks[eventType].forEach(callback => callback(data.payload));
            }
        } catch (error) {
            console.error('Error parsing message data:', error, 'Data:', event.data); // Log any parsing errors
        }
    }
    

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
    
        // Check if the callback is already registered
        const isCallbackRegistered = this.callbacks[event].some(cb => cb === callback);
        if (!isCallbackRegistered) {
            this.callbacks[event].push(callback);
        }
    }

    send(event, payload) {
        const message = JSON.stringify({ event, payload });
        this.connection.send(message);
    }
}

export default new WebSocketService(process.env.VUE_APP_WS_BASE_URL); // Adjust the URL as necessary
