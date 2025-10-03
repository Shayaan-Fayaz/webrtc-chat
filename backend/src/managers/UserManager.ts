import {WebSocket} from "ws";
import { v4 as uuidv4 } from 'uuid';
import { RoomManager } from "./RoomManager.js";

export interface User {
    socket: WebSocket;
    name: string;
    id: string;
}

export class UserManager {
    private users: User[];
    private queue: string[];
    private roomManager: RoomManager;


    constructor(){
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }


    addUser(name: string, socket: WebSocket){
        const id = uuidv4()
        this.users.push({
            socket,
            name,
            id
        });

        this.queue.push(id);
        this.clearQueue();
        this.initHandlers(socket);
    }

    removeUser(id: string){
        const user = this.users.find(x => x.id === id);
        this.users = this.users.filter(x => x !== user);
        this.queue = this.queue.filter(x => x !== id);
    }

    clearQueue(){
        if(this.queue.length < 2){
            return;
        }

        const id1 = this.queue.pop();
        const id2 = this.queue.pop();

        const user1 = this.users.find(x => x.id === id1);
        const user2 = this.users.find(x => x.id === id2);

        if(!user1 || !user2){
            return;
        }

        const room = this.roomManager.createRoom(user1, user2);
        this.clearQueue();
    }

    initHandlers(socket: WebSocket){
        socket.on("message", (data: any) => {
            const message = JSON.parse(data);
            if(message.type === "createOffer"){
                this.roomManager.onOffer(message.roomId, message.sdp, socket)
            }else if(message.type === "createAnswer"){
                
            }
        });
    }
}