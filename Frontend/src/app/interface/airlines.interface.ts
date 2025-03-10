export interface Airlines {
    id: string;
    airlinesImage: string;
    airlinesName: string;
    status: 'Running' | 'Cancelled';
    source: string;
    destination: string;
    fare: number;
}