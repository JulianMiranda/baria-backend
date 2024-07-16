import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectModel('SubcategoryAnalytics')
    private subcategoryAnalyticsDb: Model<any>,
  ) {}

  setSubcategoryAnalytics(user: string, subcategory: string) {
    try {
      console.log(user, subcategory);

      const newDocument = new this.subcategoryAnalyticsDb({
        user,
        subcategory,
      });
      newDocument.save();
    } catch (e) {
      throw new InternalServerErrorException(
        'setSubcategoryAnalytics Database error',
        e,
      );
    }
  }
}
