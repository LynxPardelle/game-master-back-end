import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from '../services/game/game.service';

@WebSocketGateway({
    cors: {
        origin: '*', // Permitir conexiones desde cualquier origen
    },
})
export class GameGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('GameGateway');

    constructor(private readonly gameService: GameService) { }

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway Initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinGame')
    async handleJoinGame(client: Socket, payload: { sessionId: number; name: string }): Promise<void> {
        const player = { id: client.id, name: payload.name };
        this.gameService.addPlayer(payload.sessionId, player);
        const gameState = await this.gameService.getGameState(payload.sessionId);
        this.logger.log(`Game state: ${JSON.stringify(gameState)}`);
        if (gameState) {
            // Notificar a todos los jugadores el nuevo estado
            this.server.emit(`gameState_${payload.sessionId}`, gameState);
        }
    }
    /* handleJoinGame(client: Socket, payload: { name: string }): void {
        this.logger.log(`Player ${payload.name} joined the game`);
        // Broadcast to other clients that a new player joined
        this.server.emit('playerJoined', payload.name);
    } */

    @SubscribeMessage('nextTurn')
    async handleNextTurn(client: Socket, payload: { sessionId: number }): Promise<void> {
        const gameState = await this.gameService.nextTurn(payload.sessionId);

        if (gameState) {
            // Notificar a todos los jugadores el nuevo turno
            this.server.emit(`gameState_${payload.sessionId}`, gameState);
        }
    }


    @SubscribeMessage('sendAction')
    handlePlayerAction(client: Socket, action: any): void {
        this.logger.log(`Action received: ${JSON.stringify(action)}`);
        // Broadcast the action to all clients
        this.server.emit('receiveAction', action);
    }

    @SubscribeMessage('finalizeGame')
    async handleFinalizeGame(client: Socket, payload: { sessionId: number }): Promise<void> {
        const game = await this.gameService.finalizeGame(payload.sessionId);

        if (game) {
            // Notificar a todos los jugadores que la partida ha finalizado
            this.server.emit(`gameEnded_${payload.sessionId}`, { message: 'Game has ended.' });
        }
    }
}
