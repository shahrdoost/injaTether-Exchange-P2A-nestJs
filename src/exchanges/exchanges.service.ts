import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exchange } from '../exchanges/exchanges.interface';
import {rayconnectJob} from './rayconnect.job';
import Rayconnect from 'rayconnect-client';

const app = new Rayconnect({
  scopes: 'prices',
  appID: 'test',
  space: 'main',
  type: 'client',
});

app.OnConnect(async () => {
  const user = await app.GetUserAccess({
    username: 'nest',
    password: 'pass',
  });

});
@Injectable()
  export class ExchangesService {

    constructor(@InjectModel('Exchange') private ExModel: Model<Exchange>) {

      // init rayconnect job

        rayconnectJob(ExModel, app);
    }

    async findAll() {
      return this.ExModel.find();
    }
}
