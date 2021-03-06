import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category';
import { ISubCategory } from 'app/shared/model/sub-category.model';
import { SubCategoryService } from 'app/entities/sub-category';
import Swal from 'sweetalert2';

import { FileItem } from './file-item';
import { HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'jhi-product-update',
    templateUrl: './product-update.component.html',
    styleUrls: ['./stylesImage.css']
})
export class ProductUpdateComponent implements OnInit {
    product: IProduct;
    isSaving: boolean;
    imageFirebase: FileItem;
    isOverDrop = false;
    loadedImage = false;
    existing = false;
    imageFromDatabase = false;
    categories: ICategory[];
    validBarCode = true;
    allProducts: IProduct[];
    minValue = true;
    maxValue = true;

    subcategories: ISubCategory[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productService: ProductService,
        protected categoryService: CategoryService,
        protected subCategoryService: SubCategoryService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ product }) => {
            this.product = product;
            if (this.product.image !== undefined && this.product.image !== '' && this.product.image !== null) {
                this.imageFromDatabase = true;
            }
            if (this.product.id !== undefined) {
                this.existing = true;
            }
        });
        this.categoryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICategory[]>) => response.body)
            )
            .subscribe(
                (res: ICategory[]) => {
                    this.categories = [];
                    res.forEach(category => {
                        if (category.disabled === false) {
                            this.categories.push(category);
                        }
                    });
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );

        this.subCategoryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ISubCategory[]>) => mayBeOk.ok),
                map((response: HttpResponse<ISubCategory[]>) => response.body)
            )
            .subscribe(
                (res: ISubCategory[]) => {
                    this.subcategories = [];
                    res.forEach(subCategory => {
                        if (subCategory.disabled === false) {
                            this.subcategories.push(subCategory);
                        }
                    });
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
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

    saveProduct() {
        this.validateBarCode();

        if (this.validBarCode) {
            this.isSaving = true;
            if (this.imageFirebase !== undefined) {
                this.product.image = this.imageFirebase.url;
                this.loadedImage = true;
            }
            if (this.product.id !== undefined) {
                this.subscribeToSaveResponse(this.productService.update(this.product));
            } else {
                this.product.disabled = false;
                this.subscribeToSaveResponse(this.productService.create(this.product));
            }
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>) {
        result.subscribe((res: HttpResponse<IProduct>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
            title: 'Producto agregado satisfactoriamente'
        });
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCategoryById(index: number, item: ICategory) {
        return item.id;
    }

    trackSubCategoryById(index: number, item: ISubCategory) {
        return item.id;
    }

    loadImage() {
        this.productService.saveImageFirebase(this.imageFirebase);
        this.product.image = this.imageFirebase.url;
        console.log(this.product.image);
        this.loadedImage = true;
    }

    save() {}

    cleanImage() {
        this.imageFirebase = undefined;
        this.loadedImage = false;
    }

    @HostListener('dragover', ['$event'])
    public onDragEnter(event: any) {
        this.isOverDrop = true;
        this._preventImageOpen(event);
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: any) {
        this.isOverDrop = false;
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: any) {
        const transference = this._getTransference(event);

        if (!transference) {
            return;
        }
        this._extractFiles(transference.files);
        this._preventImageOpen(event);
        this.isOverDrop = false;
        this.loadImage();
    }

    private _getTransference(event: any) {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }

    // Validations

    private _fileCanBeUploaded(file: File): boolean {
        if (!this.imageHasBeenDropped(file.name) && this._isImage(file.type)) {
            return true;
        } else {
            return false;
        }
    }

    private _preventImageOpen(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    private imageHasBeenDropped(imageName: string): boolean {
        if (this.imageFirebase !== undefined) {
            if (this.imageFirebase.fileName === imageName) {
                console.log('Este archivo ya lo subio bestia apocaliptica');
                return true;
            }
        }
        return false;
    }

    private _isImage(fileType: string): boolean {
        return fileType === '' || fileType === undefined ? false : fileType.startsWith('image');
    }

    private _extractFiles(listFiles: FileItem) {
        // tslint:disable-next-line: forin
        for (const properti in Object.getOwnPropertyNames(listFiles)) {
            const temporaryFile = listFiles[properti];

            if (this._fileCanBeUploaded(temporaryFile)) {
                const newFile = new FileItem(temporaryFile);
                this.imageFirebase = newFile;
            }
        }
    }

    isOverDropMethod() {}

    validateBarCode() {
        let valid = true;
        if (this.product.id === undefined) {
            this.allProducts.forEach(product => {
                if (product.barCode === this.product.barCode) {
                    valid = false;
                }
            });
            this.validBarCode = valid;
        } else {
            this.validBarCode = valid;
        }
    }

    validateMinMax(form: NgForm) {
        this.minValue = true;
        this.maxValue = true;

        if (this.product.barCode != null) {
            if (this.product.barCode.toString().length <= 9) {
                this.minValue = false;
                form.form.controls.barCode.setErrors({ incorrect: true });
            } else {
                this.minValue = true;
            }

            if (this.product.barCode.toString().length > 13) {
                this.maxValue = false;
                form.form.controls.barCode.setErrors({ incorrect: true });
            } else {
                this.maxValue = true;
            }
        }
        return form;
    }
}
