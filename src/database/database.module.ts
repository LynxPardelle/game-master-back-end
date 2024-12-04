import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameSession } from '../models/game-session.model';
import { GameState } from 'src/models/game-state.model';
import { Player } from 'src/models/player.model';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'sqlite',
            storage: './game-data.sqlite',
            autoLoadModels: true,
            synchronize: true,
        }),
        SequelizeModule.forFeature([GameSession, GameState, Player]),
    ],
})
export class DatabaseModule { }
