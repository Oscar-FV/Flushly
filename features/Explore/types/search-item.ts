import { LatLng } from "@/features/Map/types/toilet";

export interface SearchItem{
    id: string;
    tittle: String;
    details: string;
    coords: LatLng;
}