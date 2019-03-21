import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from 'app/entities/product/file-item';
import { elementStyleProp } from '@angular/core/src/render3';

@Directive({
    selector: '[jhiNgDropFiles]'
})
export class NgDropFilesDirective {
    @Input() imagen: FileItem;
    @Output() mouseOverDiv: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    @HostListener('dragover', ['$event'])
    public onDragEnter(event: any) {
        this.mouseOverDiv.emit(true);
        this._preventImageOpen(event);
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: any) {
        this.mouseOverDiv.emit(false);
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: any) {
        const transference = this._getTransference(event);

        if (!transference) {
            return;
        }
        this._extractFiles(transference.files);
        this._preventImageOpen(event);
        this.mouseOverDiv.emit(false);
    }

    private _getTransference(event: any) {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }

    //Validations

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
        if (this.imagen !== undefined) {
            if (this.imagen.fileName === imageName) {
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
                this.imagen = newFile;
                console.log(this.imagen);
            }
        }
    }
}
