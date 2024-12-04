import { Controller, Post, Get, Patch, Param, Body, Delete } from '@nestjs/common';
import { GameService } from '../../services/game/game.service';
import { GameSession } from '../../models/game-session.model';
import * as QRCode from 'qrcode';
import { TGameState } from 'src/game/game.state';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Post('create-session')
    async createSession(
        @Body() body: { name: string; maxPlayers: number },
    ): Promise<GameSession> {
        return await this.gameService.createSession(body.name, body.maxPlayers);
    }

    @Get('session/:id')
    async getSession(@Param('id') id: string): Promise<GameSession> {
        return await this.gameService.getSession(parseInt(id, 10));
    }

    @Get('sessions')
    async listSessions(): Promise<GameSession[]> {
        return await this.gameService.listSessions();
    }

    @Delete('session/:id')
    async deactivateSession(@Param('id') id: string): Promise<void> {
        await this.gameService.deactivateSession(parseInt(id, 10));
    }

    @Get('session/:id/qrcode')
    async getSessionQRCode(@Param('id') id: string): Promise<string> {
        const session = await this.gameService.getSession(parseInt(id, 10));
        if (!session) {
            throw new Error('Session not found');
        }
        const url = `http://localhost:3000/game/session/${session.id}`;
        return await QRCode.toDataURL(url);
    }

    @Patch('session/:id/finalize')
    async finalizeGame(@Param('id') id: string): Promise<TGameState> {
        return await this.gameService.finalizeGame(parseInt(id, 10));
    }

    @Get('archived-sessions')
    async listArchivedSessions(): Promise<TGameState[]> {
        return await this.gameService.listArchivedSessions();
    }
}
