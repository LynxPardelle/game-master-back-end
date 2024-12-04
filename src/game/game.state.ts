export type TPlayer = {
    id: string; // ID único (podemos usar el ID de socket)
    name: string;
    gameStateId: number; // ID del juego al que pertenece
  }
  
  export type TGameState  ={
    sessionId: number; // ID de la sesión del juego
    players: TPlayer[];
    currentTurn: string; // ID del jugador cuyo turno es
    isActive: boolean;
    isArchived: boolean;
  }
  