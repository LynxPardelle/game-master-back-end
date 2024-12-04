import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameSession } from '../../models/game-session.model';
import { TGameState, TPlayer } from '../../game/game.state';
import { GameState } from '../../models/game-state.model';
import { Player } from '../../models/player.model';


@Injectable()
export class GameService {
    private games: Map<number, TGameState> = new Map();
    constructor(
        @InjectModel(GameSession)
        private gameSessionModel: typeof GameSession,
        @InjectModel(GameState)
        private gameStateModel: typeof GameState,
        @InjectModel(Player)
        private playerModel: typeof Player,
    ) { }

    async createSession(name: string, maxPlayers: number): Promise<GameSession> {
        return await this.gameSessionModel.create({ name, maxPlayers, isActive: true });
    }

    async getSession(sessionId: number): Promise<GameSession> {
        return await this.gameSessionModel.findByPk(sessionId);
    }

    async listSessions(): Promise<GameSession[]> {
        return await this.gameSessionModel.findAll({ where: { isActive: true } });
    }

    async deactivateSession(sessionId: number): Promise<void> {
        const session = await this.gameSessionModel.findByPk(sessionId);
        if (session) {
            session.isActive = false;
            await session.save();
        }
    }

    async createGameState(sessionId: number): Promise<GameState> {
        const newGame = await this.gameStateModel.create({
            sessionId,
            isActive: true,
            currentTurn: null,
        });
        return newGame;
    }

    async getGameState(sessionId: number): Promise<GameState> {
        return await this.gameStateModel.findOne({
            where: { sessionId, isActive: true },
            include: [Player],
        });
    }

    async addPlayer(sessionId: number, playerData: { id: string; name: string }): Promise<void> {
        const game = await this.getGameState(sessionId);
        if (game) {
            await this.playerModel.create({
                id: playerData.id,
                name: playerData.name,
                gameStateId: game.id,
            });

            if (!game.currentTurn) {
                game.currentTurn = playerData.id;
                await game.save();
            }
        }
    }

    async nextTurn(sessionId: number): Promise<GameState> {
        const game = await this.getGameState(sessionId);
        if (game && game.players.length > 0) {
            const currentIndex = game.players.findIndex(
                (player) => player.id === game.currentTurn,
            );
            const nextIndex = (currentIndex + 1) % game.players.length;
            game.currentTurn = game.players[nextIndex].id;
            await game.save();
        }
        return game;
    }

    async finalizeGame(sessionId: number): Promise<GameState> {
        const game = await this.getGameState(sessionId);
        if (!game) {
            throw new Error('Game not found');
        }

        // Eliminar jugadores asociados
        await this.playerModel.destroy({
            where: { gameStateId: game.id },
        });

        // Finalizar la partida
        game.isActive = false;
        await game.save();
        return game;
    }

    async listArchivedSessions(): Promise<GameState[]> {
        return await this.gameStateModel.findAll({
            where: { isActive: false, isArchived: true },
        });
    }

}
