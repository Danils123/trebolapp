export interface IMarkerplace {
    id?: string;
    name?: string;
    lat?: number;
    lng?: number;
}

export class Markerplace implements IMarkerplace {
    constructor(public id: string, public name: string, public lat: number, public lng: number) {}
}
