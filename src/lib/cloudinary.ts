import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Carrega as credenciais do .env
cloudinary.config();

// Configura o armazenamento do Multer com destino ao Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'ecommerce-products', // Nome da pasta que será criada no Cloudinary
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});

export const upload = multer({ storage });