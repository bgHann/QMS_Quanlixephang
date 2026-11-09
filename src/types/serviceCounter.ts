export interface Counter {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  services: Service[];
}
export interface Service {
  id: string;
  name: string;
}
