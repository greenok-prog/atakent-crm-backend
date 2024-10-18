import { Injectable, Redirect, Res, StreamableFile } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { Between, Equal, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import * as qr from 'qrcode';
import * as fs from 'fs-extra'
import * as sharp from 'sharp';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as path from 'path';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';
import { PDFDocument, rgb } from 'pdf-lib';
import { readFile } from 'fs/promises';
import { addYears, format } from 'date-fns';

interface FindAllQueries{
  exhibition:number,
  fair:string,
  registrationDateStart:Date,
  registrationDateEnd:Date,
  firstDate:Date
}

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private VisitorRepository: Repository<Visitor>,
    @InjectRepository(Exhibition)
    private ExhibitionRepository: Repository<Exhibition>

  ){}
  async generateQR(bgImage:string, data): Promise<any> {
    const uniqId = uuidv4()
    const qrData = process.env.CLIENT_URL + `/visitor/qr?uuid=${uniqId}`
    
    
    const qrCodeBuffer = await qr.toBuffer(qrData, { errorCorrectionLevel: 'H', type:'png', width:2150, heigth:2150, margin:1 });
    const qrImagePath = `./public/qr/${uniqId}.png`;
    const staticPath = `/public/qr/${uniqId}.png`
   
   
    
    await fs.writeFile(qrImagePath, qrCodeBuffer);

    // Add background to QR code image
    await this.addBackgroundToImage(qrImagePath, bgImage);

    return {staticPath:staticPath, path:qrImagePath};
  }
  async create(createVisitorDto: CreateVisitorDto) {
    const exhibition = await this.ExhibitionRepository.findOneBy({id:createVisitorDto.exhibition})
    const {staticPath} = await this.generateQR(exhibition.ticketUrl, createVisitorDto)
    const visitor = this.VisitorRepository.create({...createVisitorDto, date:new Date(), exhibitionId:createVisitorDto.exhibition,qrValue:staticPath})

    return await this.VisitorRepository.save(visitor) 
  }

  async addBackgroundToImage(imagePath: string, bgPath:string = '/public/exhibitions/qr.png') {
    const font = { file: 'Arial', size: 86, color: 'black' }; // Adjust font properties
    const position = { top: 220, left: 100 };
   
    // Load images
    const qrImage = sharp(imagePath);
    const svgText = `<svg>
      <text x="${position.left}" y="${position.top}" font-family="${font.file}" font-size="${200}px" font-weight="bold" fill="${font.color}">AutoExpo - 2024</text></svg>`;
    const backgroundImage = sharp(bgPath);

    // Composite images (assuming both are the same dimensions)
    // {input:Buffer.from(svgText), top:120, left:20, level:1}
    await backgroundImage
      .composite([{ input: await qrImage.toBuffer(), level:0 }, ])
      .toFile(imagePath);
  }
  

  async findAll(query:FindAllQueries) {
    const {exhibition, firstDate, fair, registrationDateStart, registrationDateEnd} = query
    
    
    const registerStart = registrationDateStart ? new Date(registrationDateStart).toISOString() : null
    const registerEnd = registrationDateEnd ? new Date(registrationDateEnd).toISOString() : null
    
    
    const visitors = await this.VisitorRepository.find({
      where:{
        exhibitionId:exhibition,
        // firstScanDate:Equal(firstDate),
        fair:fair,
        date: registerStart && registerEnd ? Between(new Date(registerStart), new Date(registerEnd)) : null
       
      },
      relations:{
        exhibiton:true
      },
      order:{
        date:{
          direction:'DESC',
        
        }
      }
      
    })
   
    return visitors
    
  }
  async createPdf(firstname:string): Promise<Buffer> {
    // Создаем новый PDF документ
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 900]);
    const { width, height } = page.getSize();
    const imagePath = join(__dirname, '..', 'public', 'test', 'badge.png');
    const imageBytes = await readFile(imagePath);
    const image = await pdfDoc.embedPng(imageBytes);
    const imageDims = image.scale(1); // Используйте масштабирование по необходимости
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: 200,
      height: 400,
    });

    // Добавляем текст поверх изображения
    page.drawText(`${firstname}`, {
      x: 50,
      y: height - 100, // Позиция текста от верхнего края страницы
      size: 30,
      color: rgb(0, 0, 0),
      
    });

    // Сохраняем PDF документ в формате Uint8Array
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
  async changeQrValue(id:number){
    const visitor = await this.VisitorRepository.findOne({ where: { qrValue: `/public/qr/${id}.png` } });
    
    
  if (visitor) {
    if(visitor.firstScanDate){
      return visitor
    }else{
      visitor.qr = true; // Предположим, у Visitor есть поле scanned
      visitor.firstScanDate = new Date()
      await this.VisitorRepository.save(visitor);
      
    }
    return visitor
  }

    
  }
  async findOne(id: number) {
    const visitor = await this.VisitorRepository.findOneBy({id})
    
    return visitor
  }
  async downloadTicket(id: number,) {
    const visitor = await this.VisitorRepository.findOneBy({id})
    const filePath =  join(process.cwd(),'backend', '..', visitor.qrValue)
    return filePath
  }

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }
}
