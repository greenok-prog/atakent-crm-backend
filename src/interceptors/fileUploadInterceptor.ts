import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadInterceptor implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.fieldname === 'image') {
            // Папка для файлов с полем 'image'
            cb(null, './uploads/images');
          } else if (file.fieldname === 'ticketImg') {
            // Папка для файлов с полем 'ticketImg'
            cb(null, './uploads/ticketImages');
          } 
        },
        filename: (req, file, cb) => {
          const fileExtension = extname(file.originalname);
          const fileName = `${Date.now()}${fileExtension}`;
          cb(null, fileName); // Создаем уникальное имя для файла
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } 
      },
    };
  }
}
