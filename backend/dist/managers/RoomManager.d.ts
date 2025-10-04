import type { User } from "./UserManager.js";
import { WebSocket } from "ws";
export declare class RoomManager {
    private rooms;
    constructor();
    createRoom(user1: User, user2: User): void;
    onOffer(roomId: string, sdp: string, senderSocket: WebSocket): void;
    onAnswer(roomId: string, sdp: string, receiverSocket: WebSocket): void;
    onIceCandidate(roomId: string, candidate: any, senderSocket: WebSocket): void;
    generate(): number;
}
//# sourceMappingURL=RoomManager.d.ts.map