import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { MONGO_CONNECTION, STRIPE_API_KEY } from './config/config';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { RoleController } from './modules/role/role.controller';
import { RoleModule } from './modules/role/role.module';
import { ImageController } from './modules/image/image.controller';
import { ImageModule } from './modules/image/image.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CategoryController } from './modules/category/category.controller';
import { SubcategoryController } from './modules/subcategory/subcategory.controller';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { ShopModule } from './modules/shop/shop.module';
import { ShopController } from './modules/shop/shop.controller';
import { OrderModule } from './modules/order/order.module';
import { OrderController } from './modules/order/order.controller';
import { ExpoService } from './services/expo.service';
import { SendGridService } from './services/sendgrid.service';
import { GetTokenMiddleware } from './middlewares/get-token.middleware';
import { PromotionController } from './modules/promotion/promotion.controller';
import { PromotionModule } from './modules/promotion/promotion.module';
import { QueriesController } from './modules/queries/queries.controller';
import { QueriesModule } from './modules/queries/queries.module';
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PriceModule } from './modules/price/price.module';
import { PriceController } from './modules/price/price.controller';
import { CarnetModule } from './modules/carnet/carnet.module';
import { CarnetController } from './modules/carnet/carnet.controller';
import { StripeModule } from './modules/stripe/stripe.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentController } from './modules/payment/payment.controller';
import { PromotionFinalModule } from './modules/promotionFinal/promotionFinal.module';
import { PromotionFinalController } from './modules/promotionFinal/promotionFinal.controller';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    StripeModule.forRoot(STRIPE_API_KEY, {
      apiVersion: '2020-08-27',
    }),
    AuthModule,
    UserModule,
    RoleModule,
    ImageModule,
    CategoryModule,
    SubcategoryModule,
    ShopModule,
    OrderModule,
    PromotionModule,
    PromotionFinalModule,
    QueriesModule,
    AnalyticsModule,
    PriceModule,
    CarnetModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [ExpoService, SendGridService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetTokenMiddleware)
      .forRoutes(
        AuthController,
        UserController,
        RoleController,
        ImageController,
        CategoryController,
        SubcategoryController,
        ShopController,
        OrderController,
        PromotionController,
        PromotionFinalController,
        QueriesController,
        AnalyticsController,
        PriceController,
        CarnetController,
        PaymentController,
      );
  }
}
