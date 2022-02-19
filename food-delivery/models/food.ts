export interface Categories {
    id: number;
    name: string;
    description: string;
    image: string;
}

export interface Food {
    id: number;
    name: string;
    description: string;
    image: string;
    category: number;
    price: number;
    weight: number;
    trend: string;
}