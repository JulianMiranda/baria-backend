import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from '../../dto/image.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { Subcategory } from '../../dto/subcategory.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';
import { searchText } from './searcText.aggregation';

@Injectable()
export class SubcategoryRepository {
  readonly type = ENTITY.SUBCATEGORY;

  constructor(
    @InjectModel('Subcategory') private subcategoryDb: Model<Subcategory>,
    private imageRepository: ImageRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, subcategories] = await Promise.all([
        this.subcategoryDb.countDocuments(filter),
        this.subcategoryDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      /* const allSubcateg = await this.subcategoryDb.find().exec();
      console.log(allSubcateg.length);
      allSubcateg.forEach(async (element) => {
        await this.subcategoryDb
          .findByIdAndUpdate(element.id, { soldOut: false })
          .exec();
      }); */

      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: subcategories };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter subcategories Database error',
        e,
      );
    }
  }

  async getListUnAuth(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
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
      throw new InternalServerErrorException(
        'Filter subcategories Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Subcategory> {
    try {
      const document = await this.subcategoryDb.findOne({ _id: id }).populate([
        {
          path: 'images',
          match: { status: true },
          select: { url: true },
        },
        {
          path: 'category',
          select: { name: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find subcategory for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findSubcategory Database error',
          e,
        );
    }
  }
  async getProduct(id: string): Promise<Subcategory> {
    try {
      const document = await this.subcategoryDb.findOne({ _id: id }).populate([
        {
          path: 'images',
          match: { status: true },
          select: { url: true },
        },
        {
          path: 'category',
          select: { name: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find subcategory for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findSubcategory Database error',
          e,
        );
    }
  }

  async create(
    data: Subcategory,
    images: Array<Partial<Image>>,
  ): Promise<boolean> {
    try {
      const newSubcategory = new this.subcategoryDb(data);
      if (!images) {
        const subcategory = await newSubcategory.save();

        return !!subcategory;
      } else {
        const document = await newSubcategory.save();

        const createImages = images.map((image) => {
          image.parentType = this.type;
          image.parentId = document._id;
          return image;
        });
        const imageModel = await this.imageRepository.insertImages(
          createImages,
        );

        const newImages = imageModel.map((doc) => doc._id);
        await this.setTextSearch(document._id);

        const subcategory = await this.subcategoryDb.findOneAndUpdate(
          { _id: document._id },
          { images: newImages },
          { new: true },
        );

        return !!subcategory;
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'createSubcategory Database error',
        e,
      );
    }
  }

  async update(
    id: string,
    data: Partial<Subcategory>,
    images: Array<Partial<Image>>,
    deleteImages: string[],
  ): Promise<boolean> {
    try {
      if (images || deleteImages) {
        const storedImages = await this.subcategoryDb
          .findOne({ _id: id }, { images: true, _id: false })
          .lean();

        let newImages = [];
        if (images && images.length > 0) {
          const createImages = images.map((image) => {
            image.parentType = this.type;
            image.parentId = id;
            return image;
          });

          const imageModel = await this.imageRepository.insertImages(
            createImages,
          );
          newImages = imageModel.map((doc) => doc._id);
        }

        if (deleteImages && deleteImages.length > 0) {
          this.imageRepository.deleteImages(deleteImages);

          data.images = [...storedImages.images, ...newImages]
            .map((imageId) => imageId.toString())
            .filter((imageId) => deleteImages.indexOf(imageId) === -1);
        } else if (newImages.length > 0) {
          data.images = [...storedImages.images, ...newImages];
        }
      }
      const document = await this.subcategoryDb
        .findOneAndUpdate({ _id: id }, data, { new: true })
        .populate([
          { path: 'unit', select: { name: true } },
          {
            path: 'images',
            match: { status: true },
            select: { url: true },
          },
        ]);

      if (!document)
        throw new NotFoundException(
          `Could not find subcategory to update for id: ${id}`,
        );

      if (
        data.name ||
        data.price ||
        data.priceGalore ||
        data.priceGaloreDiscount ||
        data.priceDiscount ||
        data.description ||
        data.info
      )
        await this.setTextSearch(id);
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'updateSubcategory Database error',
        e,
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.subcategoryDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find subcategory to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteSubcategory Database error',
        e,
      );
    }
  }
  async searchTextSearch(): Promise<void> {
    try {
      const document = await this.subcategoryDb.find({});

      document.map(async (category) => await this.setTextSearch(category._id));
      console.log('Finished');
      if (!document) throw new NotFoundException(`Could not set Search all`);
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteSubcategory Database error',
        e,
      );
    }
  }
  async setPrice(): Promise<boolean> {
    try {
      const subcat = await this.subcategoryDb.find();
      subcat.map(async (item) => {
        await this.subcategoryDb.findByIdAndUpdate(item.id, {
          price: Math.floor(Math.random() * 10),
        });
      });

      return true;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteSubcategory Database error',
        e,
      );
    }
  }

  async setTextSearch(id: string): Promise<void> {
    const categoryQuery = await this.subcategoryDb.aggregate(searchText(id));

    if (categoryQuery.length === 0) return;
    const texto = this.findTilde(categoryQuery[0].textSearch);
    await this.subcategoryDb.bulkWrite(
      categoryQuery.map(({ _id, textSearch }) => ({
        updateOne: {
          filter: { _id },
          update: {
            $set: { textSearch: texto },
          },
        },
      })),
    );
  }

  findTilde(a: string): any {
    const b = a.split(' ');
    const newWords = [];
    b.map((word) => {
      for (let i = 0; i < word.length; i++) {
        const caracter = word.charAt(i);
        if (caracter === 'á' || caracter === 'Á') {
          const re = /Á/gi;
          newWords.push(word.replace(re, 'a'));
        } else if (caracter === 'é' || caracter === 'É') {
          const re = /É/gi;
          newWords.push(word.replace(re, 'e'));
        } else if (caracter === 'í' || caracter === 'Í') {
          console.log('Hay caracter: ' + word);
          const re = /Í/gi;
          newWords.push(word.replace(re, 'i'));
        } else if (caracter === 'ó' || caracter === 'Ó') {
          const re = /Ó/gi;
          newWords.push(word.replace(re, 'o'));
        } else if (caracter === 'ú' || caracter === 'Ú') {
          const re = /Ú/gi;
          newWords.push(word.replace(re, 'u'));
        } else {
          if (!newWords.includes(word)) newWords.push(word);
        }
      }
    });
    return newWords.join(' ');
  }
}
