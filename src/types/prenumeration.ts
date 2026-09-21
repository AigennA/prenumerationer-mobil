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
