let io;
import { Server } from "socket.io";
export const socket= {
    io:(server)=>{
        io = new Server(server, { cors: { origin: "*" } });
        return io
    },
    getIo:()=>{
        if(!io){
            throw new Error("Socket.io is not initialized")
        }
        return io
    }
}