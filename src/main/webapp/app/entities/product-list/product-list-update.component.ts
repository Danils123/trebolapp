import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProductList, ProductList } from 'app/shared/model/product-list.model';
import { ProductListService } from './product-list.service';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from 'app/entities/product-commerce';
import Swal from 'sweetalert2';
import { ListPurchaseService } from 'app/entities/list-purchase';
import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { AccountService } from 'app/core';
import { UserExtraService } from 'app/entities/user-extra';
import { ProductService } from 'app/entities/product';
import { ISubCategory } from 'app/shared/model/sub-category.model';
import { IProduct } from 'app/shared/model/product.model';

@Component({
    selector: 'jhi-product-list-update',
    templateUrl: './product-list-update.component.html',
    styleUrls: []
})
export class ProductListUpdateComponent implements OnInit {
    productList: IProductList;
    isSaving: boolean;
    nameList: string;
    nameProduct: string;
    brandProduct: string;
    descrList: string;
    quantityProduct: number;
    productArray: IProductList[];
    productcommerces: IProductCommerce[];
    listPurchase: IListPurchase;
    listPurchaseReturn: IListPurchase;
    index: number;
    id: number;
    idUser: IUserExtra;
    allProducts: IProduct[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productListService: ProductListService,
        protected productCommerceService: ProductCommerceService,
        protected activatedRoute: ActivatedRoute,
        protected listPurchaseService: ListPurchaseService,
        protected accountService: AccountService,
        protected userExtraService: UserExtraService,
        protected productService: ProductService
    ) {
        this.idUser = this.userExtraService.userExtra;
        this.productArray = [];
        this.listPurchase = new class implements IListPurchase {
            description: string;
            id: number;
            name: string;
            productList: IProductList;
            seller: IUserExtra;
            state: boolean;
        }();
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ listPurchase }) => {
            if (!(listPurchase === undefined)) {
                this.listPurchase = listPurchase;
                this.loadAllProducts(this.listPurchase);
            }
        });
        this.productCommerceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductCommerce[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductCommerce[]>) => response.body)
            )
            .subscribe((res: IProductCommerce[]) => (this.productcommerces = res), (res: HttpErrorResponse) => this.onError(res.message));

        this.productService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ISubCategory[]>) => mayBeOk.ok),
                map((response: HttpResponse<ISubCategory[]>) => response.body)
            )
            .subscribe((res: ISubCategory[]) => (this.allProducts = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;

        if (this.listPurchase.id !== undefined) {
            this.subscribeToSaveResponsePurchase(this.listPurchaseService.update(this.listPurchase));
        } else {
            this.listPurchase.seller = this.idUser;
            this.listPurchase.state = true;
            this.subscribeToSaveResponsePurchase(this.listPurchaseService.create(this.listPurchase));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductList>>) {
        result.subscribe((res: HttpResponse<IProductList>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected subscribeToSaveResponsePurchase(result: Observable<HttpResponse<IListPurchase>>) {
        result.subscribe(
            (res: HttpResponse<IListPurchase>) => {
                this.listPurchaseReturn = res.body;

                for (const productList of this.productArray) {
                    if (productList.id !== undefined) {
                        this.subscribeToSaveResponse(this.productListService.update(productList));
                    } else {
                        productList.idlistpurchase = this.listPurchaseReturn.id;
                        productList.state = true;
                        this.subscribeToSaveResponse(this.productListService.create(productList));
                    }
                }

                if (this.productArray.length === 0) {
                    this.onSaveSuccess();
                }
            },
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            type: 'success',
            title: 'Lista agregada satisfactoriamente'
        });
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

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }

    addProduct() {
        this.productArray.push(new ProductList(this.id, this.nameProduct, this.brandProduct, this.quantityProduct));
    }

    deleteProduct(product: IProductList) {
        let i = 0;
        for (const item of this.productArray) {
            if (product.name === item.name && product.brand === item.brand) {
                this.productArray.splice(i, 1);

                if (item.id !== undefined) {
                    console.log('prueba');
                    console.log(product.id);
                    this.productListService.delete(item.id).subscribe(response => {});
                }
            }
            i++;
        }
    }

    loadAllProducts(purchaseList: IListPurchase) {
        this.productListService
            .queryList(purchaseList.id)
            .pipe(
                filter((res: HttpResponse<IProductList[]>) => res.ok),
                map((res: HttpResponse<IProductList[]>) => res.body)
            )
            .subscribe(
                (res: IProductList[]) => {
                    this.productArray = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }
}
