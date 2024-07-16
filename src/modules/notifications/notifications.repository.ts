import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { flatten } from 'src/utils/util';
import { Order } from '../../dto/order.dto';
import { User } from '../../dto/user.dto';
import { NOTIFICATION } from '../../enums/notification.enum';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel('Notification') private notificationDb: Model<any>,
    @InjectModel('User') private usersDb: Model<User>,
    @InjectModel('Order') private orderDb: Model<Order>,
  ) {}

  async newOrder(type: NOTIFICATION, order: string): Promise<any> {
    try {
      console.log('Haciendo');

      const orderDB = await this.orderDb
        .findOne({ _id: order }, { cost: 1, user: 1 })
        .populate([
          {
            path: 'image',
            match: { status: true },
            select: { url: true },
          },
        ]);

      const usersJUN = await this.usersDb
        .find({ role: 'JUN' }, { notificationTokens: 1 })
        .lean();

      if (usersJUN.length === 0) return;

      const notificationsArray = [];

      for (const user of usersJUN) {
        notificationsArray.push({
          user: orderDB.user,
          title: 'Nueva Orden',
          body: `Nueva orden de ${orderDB.cost} $`,
          type,
          identifier: orderDB._id,
          notificationTokens: user.notificationTokens,
        });
      }

      //await this.notificationDb.insertMany(notificationsArray);

      /*  const pushNotifications = notificationsArray.map((item) => {
        const { title, body } = item;
        return item.notificationTokens.map((token: string) => ({
          title,
          body,
          data: {
            source: 'backend',
            type,
          },
          to: token,
        }));
      }); */
      const pushNotifications = notificationsArray.map((item) => {
        const { title, email, user, body } = item;
        return item.notificationTokens.map((token: string) => ({
          notification: {
            title,
            body,
          },

          token,
        }));
      });

      // ExpoService.sendExpoPushNotifications(flatten(pushNotifications));
    } catch (e) {
      throw new InternalServerErrorException(
        'create notification Database error',
        e,
      );
    }
  }
}
