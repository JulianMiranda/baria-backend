import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Payment } from 'src/dto/payment.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { PaymentRepository } from './payment.repository';

@Controller(ENTITY.PAYMENT)
export class PaymentController {
  constructor(private paymentRepository: PaymentRepository) {}

  @Post('/payment')
  @UsePipes(new TransformQuery())
  payment(@Body() data: any): any {
    return this.paymentRepository.payment(data);
  }
}
