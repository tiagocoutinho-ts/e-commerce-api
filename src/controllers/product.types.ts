export interface CreateProductDTO {
  name: string;
  description?: string;
  price: any;
  stock?: any;
  files?: Express.Multer.File[];
}