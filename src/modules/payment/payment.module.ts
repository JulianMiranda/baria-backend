import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PaymentSchema from 'src/schemas/payment.schema';
import { ImageModule } from '../image/image.module';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Payment',
        schema: PaymentSchema,
      },
    ]),
    ImageModule,
  ],
  providers: [PaymentRepository],
  controllers: [PaymentController],
})
export class PaymentModule {}
