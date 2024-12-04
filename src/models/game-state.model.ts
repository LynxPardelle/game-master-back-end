import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Player } from './player.model';
import { TGameState } from 'src/game/game.state';

@Table({
    timestamps: true,
})
export class GameState extends Model<TGameState> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sessionId: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    isActive: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    currentTurn: string; // ID del jugador en turno

    @HasMany(() => Player)
    players: Player[];

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    isArchived: boolean;
}
