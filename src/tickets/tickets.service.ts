import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './ticket.interface';
import { Comment } from './comment.interface';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class TicketsService {

  // @ts-ignore
  constructor(@InjectModel('Ticket') private ticketModel: Model<Ticket>,
              // @ts-ignore
              @InjectModel('Comment') private CommentModel: Model<Comment>) {}

  // tslint:disable-next-line:variable-name
  async create(title, message, user_id) {

    const createdTicket = new this.ticketModel({
      title,
      message, user_id, status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });
    // @ts-ignore
    return await createdTicket.save();

  }

  // tslint:disable-next-line:variable-name
  async createComment(image, text, user_id, ticket_id) {

    const createdComment = new this.CommentModel({image, text, user_id, ticket_id, role: 'client'});
    // @ts-ignore
    return await createdComment.save();

  }

  // @ts-ignore
  // tslint:disable-next-line:variable-name
  async findOneByTicketId(id): Model<Ticket> {

    // @ts-ignore
    return this.ticketModel.findOne({ id });

  }

  // @ts-ignore
  // tslint:disable-next-line:variable-name
  async findAllTicket(user_id): Model<Ticket> {

    // @ts-ignore
    return this.ticketModel.find({ user_id });
  }

  // @ts-ignore
  // tslint:disable-next-line:variable-name
  async findAllCommet(ticket_id): Model<Comment> {

    // @ts-ignore
    return this.CommentModel.find({ ticket_id });
  }

  // tslint:disable-next-line:variable-name
  async insertComment(text: string, image: string, user_id: string, ticket_id: string) {
    const newComment = new this.CommentModel({
      text,
      image,
      user_id,
      ticket_id,
      role: 'client',
      created_at: new Date(),
    });
    // @ts-ignore
    const result = await newComment.save();
    return result.id as string;
  }
}
