import { LatLng } from "@/features/Map/types/toilet";

export interface SearchItem{
    id: string;
    tittle: string;
    details: string;
    coords: LatLng;
}