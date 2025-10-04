import { WebSocket } from "ws";
export interface User {
    socket: WebSocket;
    name: string;
    id: string;
}
export declare class UserManager {
    private users;
    private queue;
    private roomManager;
    constructor();
    addUser(name: string, socket: WebSocket): void;
    removeUser(id: string): void;
    clearQueue(): void;
    initHandlers(socket: WebSocket): void;
}
//# sourceMappingURL=UserManager.d.ts.map