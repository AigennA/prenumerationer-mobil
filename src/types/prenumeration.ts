export type Prenumeration = {
  id: number;
  serviceName: string;
  note: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  logoUrl: string | null;
  documentUrl: string | null;
  documentName: string | null;
};

export type NyPrenumeration = Omit<Prenumeration, "id" | "logoUrl" | "documentUrl" | "documentName">;
