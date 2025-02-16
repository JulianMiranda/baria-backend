import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategoryAnalyticsSchema } from 'src/schemas/subcategory-analytics.schema';
import { UserSchema } from 'src/schemas/user.schema';
import CategorySchema from '../../schemas/category.schema';
import SubcategorySchema from '../../schemas/subcategory.schema';
import { OrderSchema } from '../../schemas/order.schema';
import { QueriesController } from './queries.controller';
import { QueriesRepository } from './queries.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Subcategory',
        schema: SubcategorySchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
      {
        name: 'SubcategoryAnalytics',
        schema: SubcategoryAnalyticsSchema,
      },
      {
        name: 'Order',
        schema: OrderSchema,
      },
    ]),
  ],

  controllers: [QueriesController],
  providers: [QueriesRepository],
})
export class QueriesModule {}
