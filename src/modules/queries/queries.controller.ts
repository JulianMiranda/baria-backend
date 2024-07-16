import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MongoQuery } from 'src/dto/mongo-query.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { TransformQuery } from 'src/pipes/transform-query.pipe';
import { Subcategory } from '../../dto/subcategory.dto';
import { QueriesRepository } from './queries.repository';

@Controller('queries')
export class QueriesController {
  constructor(private queriesRepository: QueriesRepository) {}
  @UseGuards(AuthenticationGuard)
  @Post('/home')
  getHome(@Body() data: any, @Req() req): Promise<any> {
    const userId = req.user.id;
    return this.queriesRepository.getHome({ ...data, userId });
  }
  @Post('/home-invited')
  getHomeInvited(@Body() data: any): Promise<any> {
    return this.queriesRepository.getHomeInvited({ ...data });
  }

  @Post('/searchByText')
  @UsePipes(new TransformQuery())
  getSearchByText(@Body() query: MongoQuery): Promise<any> {
    return this.queriesRepository.getSearchByText(query);
  }
}
