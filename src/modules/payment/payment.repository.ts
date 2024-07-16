import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../../dto/payment.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';
import { STRIPE_CLIENT } from '../stripe/constants';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentRepository {
  readonly type = ENTITY.PAYMENT;

  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    @InjectModel('Payment') private paymentDb: Model<Payment>,
    private imageRepository: ImageRepository,
  ) {}

  async payment(data: any): Promise<any> {
    try {
      /*  const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, payments] = await Promise.all([
        this.paymentDb.countDocuments(filter),
        this.paymentDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1; */
      console.log('doing', data);
      const body = {
        amount: 855.0,
        currency: 'usd',
        source: 'tok_1L26FvFEU9Nmrqwcwh1EVxGb',
        description: 'Lianet Vazquez',
      };
      const payment = await this.stripe.charges.create(body);
      console.log('payment', payment);
      /*  const result = await this.stripe.customers.list(); */

      return true;
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter payments Database error',
        e,
      );
    }
  }
}
