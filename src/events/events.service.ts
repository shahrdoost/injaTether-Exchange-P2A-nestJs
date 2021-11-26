import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// @ts-ignore
import { Coin } from '../coins/coin.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Coin') private readonly coinModel: Model<Coin>,
  ) {
  }
  async findProduct(sign: string): Promise<Coin> {
    let product;
    try {
      product = await this.coinModel.find({ sign }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product. err');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}
