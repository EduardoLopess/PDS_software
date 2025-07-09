import * as signalR from '@microsoft/signalr';
const HUB_URL = 'http://192.168.5.5:5071/pedidoHub'

const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL)
    .withAutomaticReconnect()
    .build()

const startConnection = async () => {
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            console.log("✅ SignalR conectado.");
        } else {
            console.log("⚠️ SignalR já está conectado ou conectando:", connection.state);
        }
    } catch (err) {
        console.error("❌ Erro ao conectar:", err);
        setTimeout(startConnection, 3000);
    }
};


const onPedidoCriado = (callback) => {
    connection.on('PedidoCriado', callback);
};

const onPedidoAtualizado = (callback) => {
    connection.on('PedidoAtualizado', callback);
};

const onPedidoCancelado = (callback) => {
    connection.on('PedidoCancelado', callback);
};

const onNovaNotificacao = (callback) => {
    connection.on('NovaNotificacao', callback);
};
export {
    connection,
    startConnection,
    onPedidoAtualizado,
    onNovaNotificacao,
    onPedidoCancelado,
    onPedidoCriado
};