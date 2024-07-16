import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsRepository } from './analytics.repository';
import { SubcategoryAnalyticsSchema } from '../../schemas/subcategory-analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'SubcategoryAnalytics',
        schema: SubcategoryAnalyticsSchema,
      },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsRepository],
})
export class AnalyticsModule {}
