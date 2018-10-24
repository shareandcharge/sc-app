import {Injectable, EventEmitter} from '@angular/core'
import {ConfigService} from "./config.service";

interface Event {
    type: string;
    address: string;
    message: string;
}

@Injectable()
export class EventService extends EventEmitter<Event> {

    ws: WebSocket;

    constructor(private config: ConfigService) {
        super();
        this.ws = new WebSocket(this.config.get('WS_URL'));
        this.ws.onmessage = (msg: MessageEvent) => {
            // console.log('New message from server:', msg.data);
            this.emit(JSON.parse(msg.data));
        };

        // this.ws.onclose = () => {
        //     const interval = setInterval(() => {
        //         try {
        //             this.ws = new WebSocket(this.config.get('WS_URL'));
        //             clearInterval(interval);
        //         } catch (err) {

        //         }
        //     }, 1000);
        // }
    }

}