import { Injectable } from '@angular/core';

import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;

    constructor(private afStorage: AngularFireStorage) {}

    public upload(event) {
        const id = Math.random()
            .toString(36)
            .substring(2);
        this.ref = this.afStorage.ref(id);
        this.task = this.ref.put(event.target.files[0]);
    }
}
