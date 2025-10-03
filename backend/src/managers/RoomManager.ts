import type { User } from "./UserManager.js";
import { WebSocket } from "ws";

let GLOBAL_ROOM_ID = 1;

interface Room {
    user1: User,
    user2: User
}


// RoomManager should be a singleton class
export class RoomManager {
    private rooms: Map<string, Room>;

    constructor(){
        this.rooms = new Map<string, Room>();
    }

    createRoom(user1: User, user2: User){
        const roomId = this.generate().toString();

        this.rooms.set(roomId.toString(), {
            user1,
            user2
        })

        user1.socket?.send(JSON.stringify({
            type: "send-offer",
            roomId
        }));

        user2.socket?.send(JSON.stringify({
            type: "send-offer",
            roomId
        }))
    };

    onOffer(roomId: string, sdp: string, senderSocket: WebSocket){
        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }

        // Next time send even the userId from the frontend which will be stored in cookie
        // Basically we will be finding the user by userId instead of socketId
        const receiver:User = room.user1.socket === senderSocket ? room.user2 : room.user1;

        receiver?.socket.send(JSON.stringify({
            type: "createOffer",
            sdp
        }))
    }

    // onAnswer(roomId: string, sdp: string, reciv)


    generate(){
        return GLOBAL_ROOM_ID++;
    }

}