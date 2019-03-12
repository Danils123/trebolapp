import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { ProductsPerOrderService } from './products-per-order.service';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from 'app/entities/product-commerce';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { OrderItemService } from 'app/entities/order-item';

@Component({
    selector: 'jhi-products-per-order-update',
    templateUrl: './products-per-order-update.component.html'
})
export class ProductsPerOrderUpdateComponent implements OnInit {
    productsPerOrder: IProductsPerOrder;
    isSaving: boolean;

    productcommerces: IProductCommerce[];

    orderitems: IOrderItem[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productsPerOrderService: ProductsPerOrderService,
        protected productCommerceService: ProductCommerceService,
        protected orderItemService: OrderItemService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productsPerOrder }) => {
            this.productsPerOrder = productsPerOrder;
        });
        this.productCommerceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductCommerce[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductCommerce[]>) => response.body)
            )
            .subscribe((res: IProductCommerce[]) => (this.productcommerces = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.orderItemService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IOrderItem[]>) => mayBeOk.ok),
                map((response: HttpResponse<IOrderItem[]>) => response.body)
            )
            .subscribe((res: IOrderItem[]) => (this.orderitems = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.productsPerOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.productsPerOrderService.update(this.productsPerOrder));
        } else {
            this.subscribeToSaveResponse(this.productsPerOrderService.create(this.productsPerOrder));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductsPerOrder>>) {
        result.subscribe((res: HttpResponse<IProductsPerOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackProductCommerceById(index: number, item: IProductCommerce) {
        return item.id;
    }

    trackOrderItemById(index: number, item: IOrderItem) {
        return item.id;
    }
}
