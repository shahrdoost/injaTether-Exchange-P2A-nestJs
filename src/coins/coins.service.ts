import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// @ts-ignore
import { Coin } from './coin.model';
// @ts-ignore
import { SubCoin } from './subcoins.schema';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel('Coin') private readonly coinModel: Model<Coin>,
    @InjectModel('SubCoin') private readonly SubcoinModel: Model<SubCoin>,
  ) {
  }

  async insertProduct(type: string,
                      name: string,
                      persianName: string,
                      sign: string,
                      wallet: string,
                      walletTwo: string,
                      buyPrice: number,
                      sellPrice: number,
                      minBuy: number,
                      maxBuy: number,
                      maxSell: number,
                      minSell: number,
                      active: number,
  ) {
    const newProduct = new this.coinModel({
      type, name, persianName, sign, wallet, walletTwo, buyPrice, sellPrice, minBuy, maxBuy, maxSell, minSell, active,
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  async insertSubCoin(name: string,
                      fee: number,
                      active: number,
                      sign: string,
                      // tslint:disable-next-line:variable-name
                      crypto_id: number,
  ) {
    const newProduct = new this.SubcoinModel({
      name, fee, active, sign, crypto_id,
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  // tslint:disable-next-line:variable-name
  async getProducts() {
    const products = await this.coinModel.find({});
    return products;
  }

  // tslint:disable-next-line:variable-name
  async getSubCoinsOneCoin(crypto_id) {
    const subcoin = await this.SubcoinModel.find({ crypto_id });
    return subcoin;
  }

  // tslint:disable-next-line:variable-name
  async getSubCoinsOneCoinWithSign(sign) {
    const subcoin = await this.SubcoinModel.find({ sign });
    return subcoin;
  }

  async getSingleProduct(sign) {
    // @ts-ignore
    const products = await this.coinModel.findOne({ sign });
    return products;
  }

  async updatePrice(sign, buyPrice, sellPrice) {
    // @ts-ignore

    await this.coinModel.findOneAndUpdate({ sign },
      { buyPrice , sellPrice });
  }

  async deleteProduct(sign: string) {
    const result = await this.coinModel.deleteOne({ sign }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
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
