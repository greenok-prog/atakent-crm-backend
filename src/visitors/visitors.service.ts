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

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private VisitorRepository: Repository<Visitor>

  ){}
  async generateQR(): Promise<any> {
    const uniqId = uuidv4()
    const qrCodeBuffer = await qr.toBuffer('fsdf', { errorCorrectionLevel: 'H', type:'png', width:2150, heigth:2150, margin:1 });
    const qrImagePath = `./public/qr/${uniqId}.png`;
    const staticPath = `/public/qr/${uniqId}.png`

    await fs.writeFile(qrImagePath, qrCodeBuffer);

    // Add background to QR code image
    await this.addBackgroundToImage(qrImagePath);

    return {staticPath:staticPath, path:qrImagePath};
  }
  async create(createVisitorDto: CreateVisitorDto) {
    const {staticPath} = await this.generateQR()
    const visitor = this.VisitorRepository.create({...createVisitorDto, date:new Date(), exhibitionId:createVisitorDto.exhibition,qrValue:staticPath})

    return await this.VisitorRepository.save(visitor) 
  }

  async addBackgroundToImage(imagePath: string) {
    const font = { file: 'Arial', size: 86, color: 'black' }; // Adjust font properties
    const position = { top: 220, left: 100 };
    const backgroundImagePath = './static/qr.png'; // Path to your background image

    // Load images
    const qrImage = sharp(imagePath);
    const svgText = `<svg>
      <text x="${position.left}" y="${position.top}" font-family="${font.file}" font-size="${200}px" font-weight="bold" fill="${font.color}">AutoExpo - 2024</text></svg>`;
    const backgroundImage = sharp(backgroundImagePath);

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
      }
    })
  }
  async changeQrValue(id){
    await this.VisitorRepository.createQueryBuilder()
      .update(Visitor)
      .set({qr:true})
      .where(`id = :id`, {id})
      .execute()
    Redirect('/')
    
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
