import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileItem } from './file-item';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreModule } from '@angular/fire/firestore';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, ITEMS_PER_PAGE } from 'app/shared';
import { IProduct } from 'app/shared/model/product.model';
import * as firebase from 'firebase';

type EntityResponseType = HttpResponse<IProduct>;
type EntityArrayResponseType = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ProductService {
    public resourceUrl = SERVER_API_URL + 'api/products';
    private IMAGE_FOLDER = 'img';
    constructor(protected http: HttpClient, protected firestore: AngularFirestore) {}

    create(product: IProduct): Observable<EntityResponseType> {
        return this.http.post<IProduct>(this.resourceUrl, product, { observe: 'response' });
    }

    update(product: IProduct): Observable<EntityResponseType> {
        return this.http.put<IProduct>(this.resourceUrl, product, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    saveImageFirebase(image: FileItem) {
        const storageRef = firebase.storage().ref();

        image.isUploading = true;

        const uploadTask: firebase.storage.UploadTask = storageRef.child(`${this.IMAGE_FOLDER}/ ${image.fileName}`).put(image.file);

        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: firebase.storage.UploadTaskSnapshot) => (image.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            error => console.error('Error to upload', error),
            () => {
                image.isUploading = false;

                uploadTask.then(snapshot => {
                    snapshot.ref.getDownloadURL().then(url => {
                        image.url = url;
                    });
                });
            }
        );
    }
}
