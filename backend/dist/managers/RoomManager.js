import { WebSocket } from "ws";
let GLOBAL_ROOM_ID = 1;
// RoomManager should be a singleton class
export class RoomManager {
    rooms;
    constructor() {
        this.rooms = new Map();
    }
    createRoom(user1, user2) {
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), {
            user1,
            user2
        });
        user1.socket?.send(JSON.stringify({
            type: "send-offer",
            roomId
        }));
        user2.socket?.send(JSON.stringify({
            type: "send-offer",
            roomId
        }));
    }
    ;
    onOffer(roomId, sdp, senderSocket) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        // Next time send even the userId from the frontend which will be stored in cookie
        // Basically we will be finding the user by userId instead of socketId
        const receiver = room.user1.socket === senderSocket ? room.user2 : room.user1;
        receiver?.socket.send(JSON.stringify({
            type: "createOffer",
            sdp
        }));
    }
    onAnswer(roomId, sdp, receiverSocket) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const senderSocket = room.user1.socket === receiverSocket ? room.user2 : room.user1;
        senderSocket?.socket.send(JSON.stringify({
            type: "createAnswer",
            sdp
        }));
    }
    onIceCandidate(roomId, candidate, senderSocket) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receiver = room.user1.socket === senderSocket ? room.user2 : room.user1;
        receiver.socket.send(JSON.stringify({
            type: "iceCandidate",
            candidate: candidate
        }));
    }
    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
//# sourceMappingURL=RoomManager.js.map