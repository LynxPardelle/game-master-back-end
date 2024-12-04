import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { GameState } from './game-state.model';
import { TPlayer } from 'src/game/game.state';

@Table({
  timestamps: true,
})
export class Player extends Model<TPlayer> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  id: string; // ID único del jugador (socket ID)

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => GameState)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  gameStateId: number;
}
