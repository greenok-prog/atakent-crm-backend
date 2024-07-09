import { Injectable, Redirect, Res, StreamableFile } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { Repository } from 'typeorm';
import * as qr from 'qrcode';
import * as fs from 'fs-extra'
import * as sharp from 'sharp';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as path from 'path';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';

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
    const qrData = process.env.BASE_URL + `/visitors/change?uuid=${uniqId}`
    
    
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
  

  findAll(query) {
    const {exhibition} = query
    return this.VisitorRepository.find({
      where:{
        exhibitionId:exhibition
      },
      relations:{
        exhibiton:true
      },
      order:{
        date:{
          direction:'DESC'
        }
      }
      
    })
  }
  async changeQrValue(id){
    const visitor = await this.VisitorRepository.findOne({ where: { qrValue: `/public/qr/${id}.png` } });

  if (visitor) {
    visitor.qr = true; // Предположим, у Visitor есть поле scanned
    await this.VisitorRepository.save(visitor);
    return true;
  } else {
    return false;
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
