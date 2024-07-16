import * as mongoose from 'mongoose';
export const searchText = (id: string) => [
  { $match: { _id: mongoose.Types.ObjectId(id) } },
  {
    $addFields: {
      cont: {
        $reduce: {
          input: '$description',
          initialValue: '',
          in: {
            $cond: {
              if: {
                $eq: [{ $indexOfArray: ['$description', '$$this'] }, 0],
              },
              then: { $concat: ['$$value', '$$this.content'] },
              else: { $concat: ['$$value', ' ', '$$this.content'] },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      cont: {
        $reduce: {
          input: '$description',
          initialValue: '',
          in: {
            $cond: {
              if: {
                $eq: [{ $indexOfArray: ['$description', '$$this'] }, 0],
              },
              then: { $concat: ['$$value', '$$this.content'] },
              else: { $concat: ['$$value', ' ', '$$this.content'] },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      title: {
        $reduce: {
          input: '$description',
          initialValue: '',
          in: {
            $cond: {
              if: {
                $eq: [{ $indexOfArray: ['$description', '$$this'] }, 0],
              },
              then: { $concat: ['$$value', '$$this.title'] },
              else: { $concat: ['$$value', ' ', '$$this.title'] },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      values: {
        $reduce: {
          input: '$info',
          initialValue: '',
          in: {
            $cond: {
              if: { $eq: [{ $indexOfArray: ['$info', '$$this'] }, 0] },
              then: { $concat: ['$$value', '$$this'] },
              else: { $concat: ['$$value', ' ', '$$this'] },
            },
          },
        },
      },
    },
  },

  {
    $project: {
      cont: 1,
      title: 1,
      textSearch: {
        $concat: [
          { $ifNull: ['$name', ''] },
          ' ',
          { $ifNull: [{ $toString: '$price' }, ''] },
          ' ',
          { $ifNull: [{ $toString: '$priceGalore' }, ''] },
          ' ',
          { $ifNull: [{ $toString: '$priceDiscount' }, ''] },
          ' ',
          { $ifNull: [{ $toString: '$priceGaloreDiscount' }, ''] },
          ' ',
          { $ifNull: ['$cont', ''] },
          ' ',
          { $ifNull: ['$title', ''] },
          ' ',
          { $ifNull: ['$values', ''] },
          ' ',
        ],
      },
    },
  },
];
