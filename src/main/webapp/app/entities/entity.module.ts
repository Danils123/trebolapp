import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'ranking-per-order',
                loadChildren: './ranking-per-order/ranking-per-order.module#TrebolRankingPerOrderModule'
            },
            {
                path: 'points-commerce',
                loadChildren: './points-commerce/points-commerce.module#TrebolPointsCommerceModule'
            },
            {
                path: 'category',
                loadChildren: './category/category.module#TrebolCategoryModule'
            },
            {
                path: 'sub-category',
                loadChildren: './sub-category/sub-category.module#TrebolSubCategoryModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#TrebolProductModule'
            },
            {
                path: 'product-commerce',
                loadChildren: './product-commerce/product-commerce.module#TrebolProductCommerceModule'
            },
            {
                path: 'list-purchase',
                loadChildren: './list-purchase/list-purchase.module#TrebolListPurchaseModule'
            },
            {
                path: 'product-list',
                loadChildren: './product-list/product-list.module#TrebolProductListModule'
            },
            {
                path: 'products-per-order',
                loadChildren: './products-per-order/products-per-order.module#TrebolProductsPerOrderModule'
            },
            {
                path: 'order-item',
                loadChildren: './order-item/order-item.module#TrebolOrderItemModule'
            },
            {
                path: 'list-schedule',
                loadChildren: './list-schedule/list-schedule.module#TrebolListScheduleModule'
            },
            {
                path: 'parameters-commerce',
                loadChildren: './parameters-commerce/parameters-commerce.module#TrebolParametersCommerceModule'
            },
            {
                path: 'commerce',
                loadChildren: './commerce/commerce.module#TrebolCommerceModule'
            },
            {
                path: 'schedule-commerce',
                loadChildren: './schedule-commerce/schedule-commerce.module#TrebolScheduleCommerceModule'
            },
            {
                path: 'offer',
                loadChildren: './offer/offer.module#TrebolOfferModule'
            },
            {
                path: 'user-extra',
                loadChildren: './user-extra/user-extra.module#TrebolUserExtraModule'
            },
            {
                path: 'ranking-per-order',
                loadChildren: './ranking-per-order/ranking-per-order.module#TrebolRankingPerOrderModule'
            },
            {
                path: 'user-extra',
                loadChildren: './user-extra/user-extra.module#TrebolUserExtraModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolEntityModule {}
