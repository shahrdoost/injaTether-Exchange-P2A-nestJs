import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { CoinsService } from '../coins/coins.service';

@WebSocketGateway()
export class EventsGateway {
  // @ts-ignore
  constructor(private readonly coinsService: CoinsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('coins')
  // @ts-ignore
  async coins(@MessageBody() data: any): Promise<number> {

      // @ts-ignore
    setInterval(async () => {
      const getProducts = await this.coinsService.getProducts();
      this.server.emit('coins', getProducts);
      }, 3000);
  }

  @SubscribeMessage('subcoins')
  // @ts-ignore
  async subcoins(@MessageBody() data: any): Promise<number> {

    // @ts-ignore
    setInterval(async () => {
      const getProducts = await this.coinsService.getSubCoinsOneCoin(1);
      this.server.emit('subcoins', getProducts);
    }, 10000);
  }
}
