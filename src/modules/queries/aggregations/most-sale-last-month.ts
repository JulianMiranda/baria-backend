import * as mongoose from 'mongoose';

export const mostSaleLastMonth = (month) => [
  {
    $match: {
      $expr: {
        $and: [{ $gt: ['$createdAt', month] }],
      },
    },
  },

  { $unwind: '$car' },

  {
    $group: {
      _id: '$car.subcategory.id',
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: 'subcategories',
      let: { subcObjctId: { $toObjectId: '$_id' } },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$_id', '$$subcObjctId'] },
                { $eq: ['$status', true] },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'images',
            let: { images: '$images' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ['$_id', '$$images'] },
                      { $eq: ['$status', true] },
                    ],
                  },
                },
              },
              {
                $project: {
                  url: 1,
                  blurHash: 1,
                  id: '$_id',
                  _id: 0,
                },
              },
            ],
            as: 'images',
          },
        },
        {
          $project: {
            id: '$_id',
            _id: 0,
            name: 1,
            description: 1,
            priceDiscount: 1,
            priceGaloreDiscount: 1,
            weight: 1,
            currency: 1,
            images: 1,
            status: 1,
            category: 1,
            price: 1,
            createdAt: 1,
            updatedAt: 1,
            priceGalore: 1,
            aviableColors: 1,
            aviableSizes: 1,
            soldOut: 1,
          },
        },
      ],
      as: 'mostSaleSubcategory',
    },
  },
  { $unwind: '$mostSaleSubcategory' },
  {
    $project: {
      mostSaleSubcategory: 1,
    },
  },
];
