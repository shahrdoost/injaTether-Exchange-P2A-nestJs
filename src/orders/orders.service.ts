import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// @ts-ignore
import { Order } from './order.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly productModel: Model<Order>,
  ) {
  }

  // tslint:disable-next-line:variable-name
  async insertProduct(user_id, card_id, type, currency, price, value, cost, wallet, network) {
    const newProduct = new this.productModel({
      user_id,
      card_id,
      type,
      currency,
      price,
      value,
      cost,
      wallet,
      network,
      status: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  // tslint:disable-next-line:variable-name
  async getOrders(user_id: number) {
    const orders = await this.productModel.find({ user_id }).exec();
    return orders;
  }

  async getSingleProduct(id: number) {
    const product = await this.findProduct(id);
    return product;
    //  return {
    //   id: product.id,
    //   title: product.title,
    //   description: product.description,
    //   price: product.price,
    // };
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    // @ts-ignore
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    updatedProduct.save();
  }

  async deleteProduct(id: number) {
    const result = await this.productModel.deleteOne({ id }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findProduct(id: number): Promise<Order> {
    let product;
    try {
      product = await this.productModel.find({ id }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product. err');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }

  // tslint:disable-next-line:variable-name
  async updateTokenPayOrder(id: number, token: string) {
    await this.productModel.findOneAndUpdate({ id },
      { pay_token: token });
  }

  // tslint:disable-next-line:variable-name
  async updateStatusPayOrder(id: number) {
    await this.productModel.findOneAndUpdate({ id },
      { pay_status: 1 });
  }

}
