import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game/game.gateway';
import { DatabaseModule } from './database/database.module';
import { GameController } from './controllers/game/game.controller';
import { GameService } from './services/game/game.service';
import { GameSession } from './models/game-session.model';
import { GameState } from './models/game-state.model';
import { Player } from './models/player.model';

@Module({
  imports: [DatabaseModule,
    SequelizeModule.forFeature([GameSession,GameState, Player]),],
  controllers: [AppController, GameController],
  providers: [AppService, GameGateway, GameService],
})
export class AppModule { }
