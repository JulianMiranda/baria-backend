import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model, Promise } from 'mongoose';
import { Category } from 'src/dto/category.dto';
import { Subcategory } from 'src/dto/subcategory.dto';
import { recentSubcategories } from './aggregations/recent-subcategories';
import { RecommendedSubcategories } from './aggregations/recommended-subcategories';
import { categories } from './aggregations/categories';
import { mostSale } from './aggregations/most-sale';
import { mostSaleSub } from './aggregations/most-sale-sub';
import { mostSaleLastMonth } from './aggregations/most-sale-last-month';
import { test } from './aggregations/test';
import { MongoQuery } from 'src/dto/mongo-query.dto';

@Injectable()
export class QueriesRepository {
  constructor(
    @InjectModel('SubcategoryAnalytics')
    private subcategoryAnalyticsDb: Model<any>,
    @InjectModel('Subcategory') private subcategoryDb: Model<Subcategory>,
    @InjectModel('Category') private categoryDb: Model<Category>,
    @InjectModel('User') private userDb: Model<any>,
    @InjectModel('Order') private orderDb: Model<any>,
  ) {}

  async getHomeInvited(data: any): Promise<any> {
    const {} = data;

    try {
      const today = new Date();
      const month = new Date();
      month.setDate(today.getDate() - 30);
      /* const ids = await this.orderDb.aggregate(test(month));
      console.log(ids[0].ids); */
      return Promise.all([
        this.subcategoryDb
          .find({
            $expr: {
              $and: [
                { $ne: ['$priceDiscount', 0] },
                { $eq: ['$status', true] },
                { $eq: ['$soldOut', false] },
              ],
            },
          })
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate([
            {
              path: 'images',
              match: { status: true },
              select: { url: true },
              options: { sort: { updatedAt: -1 } },
            },
            {
              path: 'category',
              select: { name: true },
            },
          ]),
        this.orderDb.aggregate(mostSaleLastMonth(month)),
        this.subcategoryDb
          .find({
            $expr: {
              $and: [{ $eq: ['$status', true] }, { $eq: ['$soldOut', false] }],
            },
          })
          .sort({ recentProduct: -1 })
          .limit(20)
          .populate([
            {
              path: 'images',
              match: { status: true },
              select: { url: true },
              options: { sort: { updatedAt: -1 } },
            },
            {
              path: 'category',
              select: { name: true },
            },
          ]),
      ]);
    } catch (e) {
      throw new InternalServerErrorException('getHome query error', e);
    }
  }

  async getHome(data: any): Promise<any> {
    const { userId } = data;

    try {
      const today = new Date();
      const month = new Date();
      month.setDate(today.getDate() - 30);
      /* const ids = await this.orderDb.aggregate(test(month));
      console.log(ids[0].ids); */
      return Promise.all([
        this.subcategoryDb
          .find({
            $expr: {
              $or: [
                { $ne: ['$priceGaloreDiscount', 0] },
                { $ne: ['$priceDiscount', 0] },
              ],
            },
          })
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate([
            {
              path: 'images',
              match: { status: true },
              select: { url: true },
              options: { sort: { updatedAt: -1 } },
            },
            {
              path: 'category',
              select: { name: true },
            },
          ]),
        this.orderDb.aggregate(mostSaleLastMonth(month)),
        this.subcategoryDb
          .find({
            $expr: {
              $and: [{ $eq: ['$status', true] }, { $eq: ['$soldOut', false] }],
            },
          })
          .sort({ recentProduct: -1 })
          .limit(20)
          .populate([
            {
              path: 'images',
              match: { status: true },
              select: { url: true },
              options: { sort: { updatedAt: -1 } },
            },
            {
              path: 'category',
              select: { name: true },
            },
          ]),
      ]);
    } catch (e) {
      throw new InternalServerErrorException('getHome query error', e);
    }
  }
  async getSearchByText(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      /*   const filter = this.transformFilter({}, search); */
      const [count, subcategories] = await Promise.all([
        this.subcategoryDb.countDocuments(filter),
        this.subcategoryDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: subcategories };
    } catch (e) {
      throw new InternalServerErrorException('getSearchByText query error', e);
    }
  }
}
