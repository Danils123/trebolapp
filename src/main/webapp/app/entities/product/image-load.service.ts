import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import * as firebase from 'firebase';
@Injectable()
export class ImageLoadService {
    private IMAGE_FOLDER = 'img';
    constructor(private db: AngularFirestore) {}

    private saveImage(image: { nombre: string; url: string }) {
        this.db.collection(`/${this.IMAGE_FOLDER}`).add(image);
    }
}
