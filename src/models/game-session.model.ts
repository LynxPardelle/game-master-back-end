import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    timestamps: true,
})
export class GameSession extends Model<GameSession> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    maxPlayers: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    isActive: boolean;
}
