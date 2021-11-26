import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// @ts-ignore
import { Card } from './card.model';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel('Card') private readonly cardModel: Model<Card>,
  ) {
  }

  // tslint:disable-next-line:variable-name
  async insertCard(bank: string, cardNumber: string, ibanNumber: string, accountNumber: string, user_id) {
    const newProduct = new this.cardModel({
      bank,
      cardNumber,
      ibanNumber,
      accountNumber,
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  // tslint:disable-next-line:variable-name
  async getAllCards(user_id: number) {
    const cards = await this.cardModel.find({ user_id }).exec();
    return cards;
  }

  // tslint:disable-next-line:variable-name
  async getAllCardsValid(user_id: number) {
    const cards = await this.cardModel.find({ user_id, status: 1 }).exec();
    return cards;
  }

  async getOneCard(id: number) {
    const card = await this.findProduct(id);
    return card;
  }

  private async findProduct(id: number): Promise<Card> {
    let product;
    try {
      product = await this.cardModel.find({ id }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product. err');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}
