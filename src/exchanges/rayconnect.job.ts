import Rayconnect from 'rayconnect-client';
import { Model } from 'mongoose';
import { Exchange } from './exchanges.interface';

export  function rayconnectJob(ExModel: Model<Exchange>, app: Rayconnect) {

    // tslint:disable-next-line:no-console
    app.Query({
      address: 'change',
      scope: 'prices',
      method: 'GET',
    }, async (data) => {
      // tslint:disable-next-line:no-console
      const changes = data.data.changes;

      console.log("events");
      for (const change of changes) {
        await ExModel.findOneAndUpdate({exchange: change.exchange, sign: change.coin}, {
          exchange: change.exchange,
          buy: change.buy_price,
          sell: change.sell_price,
          sign: change.coin,
          updated_at: new Date(),
        }, {
          upsert: true,
        });
      }

    });
}
