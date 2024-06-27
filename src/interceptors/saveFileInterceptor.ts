import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, tap } from 'rxjs';
import { writeFile, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Request } from 'express';

@Injectable()
export class SaveFileInterceptor implements NestInterceptor {

    saveFile(file: Express.Multer.File) {
        const fileType = file.mimetype ? file.mimetype.split('/')[0] : 'others';
        const destination = join(__dirname, `../../public/img/`);
        if (!existsSync(destination)) {
            mkdirSync(destination, { recursive: true });
        }
        writeFile(
            `${destination}/${file.filename}`,
            file.buffer,
            err => {
                if (err) {
                    console.log(err);
                    throwError(err);
                }
            }
        )
    }

    generateFilePath(file: Express.Multer.File) {
        const fileType = file.mimetype ? file.mimetype.split('/')[0] : 'others';
        file.path = `/public/img/${file.filename}`; // path served as static file
    }

    generateFileName(file: Express.Multer.File) {
        file.filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const req: Request = context.switchToHttp().getRequest();
        
        if (req.file) {
            this.generateFileName(req.file);
            this.generateFilePath(req.file);
        }
        if (req.files) {
            if (Array.isArray(req.files)) {
                req.files.forEach(file => {
                    this.generateFileName(file);
                    this.generateFilePath(file);
                });
            }
            else {
                Object.values(req.files).flat().forEach(file => {
                    this.generateFileName(file);
                    this.generateFilePath(file);
                });
            }
        }

        return next.handle().pipe(tap(() => {
            
            if (req.file) {
                this.saveFile(req.file);
            }
            if (req.files) {
                if (Array.isArray(req.files)) {
                    req.files.forEach(file => this.saveFile(file));
                }
                else {
                    Object.values(req.files).flat().forEach(file => this.saveFile(file));
                }
            }
        }));
    }
}