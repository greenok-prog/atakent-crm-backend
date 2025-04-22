import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, Redirect, Res, StreamableFile } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { Between, Equal, LessThanOrEqual, Repository, getRepository } from 'typeorm';
import * as qr from 'qrcode';
import * as fs from 'fs-extra'
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as path from 'path';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { getHtmlMessage } from './utils/pdf';
import { MailerService } from '../mailer/mailer.service';
import { PassThrough } from 'stream';
import * as ExcelJS from 'exceljs';

@Injectable()
export class VisitorsService {
  private readonly logger = new Logger(VisitorsService.name);
  constructor(
    @InjectRepository(Visitor)
    private VisitorRepository: Repository<Visitor>,
    @InjectRepository(Exhibition)
    private ExhibitionRepository: Repository<Exhibition>,
    private configService: ConfigService,
    private mailerService: MailerService
    

  ){}
  
  async generateQR(uid, data): Promise<any> {
    const uniqId = uid
    const qrData = process.env.BASE_URL + `/visitors/change?uuid=${uniqId}`
    const qrDirectory = this.configService.get<string>('QR_PATH');
    
    const qrCodeBuffer = await qr.toBuffer(qrData, { errorCorrectionLevel: 'H', type:'png', width:540, heigth:540, margin:1 });
    const qrImagePath = `${qrDirectory}/${uniqId}.png`;
    const staticPath = `/public/qr/${uniqId}.png`

    await fs.writeFile(qrImagePath, qrCodeBuffer);

    return {staticPath:staticPath, path:qrImagePath,};
  }
  async create(createVisitorDto: CreateVisitorDto) {
    const { email, phone, exhibition } = createVisitorDto;
  
    // Проверка на дубликаты по email или номеру телефона
    const existingVisitor = await this.VisitorRepository.findOne({
      where: [
        { email, exhibitionId: exhibition },
        { phone, exhibitionId: exhibition },
      ],
    });
    if (existingVisitor) {
      const errors: Record<string, string> = {};
    
      if (existingVisitor.email === createVisitorDto.email) {
        errors.email = 'Этот email уже зарегистрирован на выставку';
      }
    
      if (existingVisitor.phone === createVisitorDto.phone) {
        errors.phone = 'Этот номер телефона уже зарегистрирован на выставку';
      }
    
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  
    const uniqId = uuidv4();
    const exhibitionEntity = await this.ExhibitionRepository.findOneBy({ id: exhibition });
    const { staticPath } = await this.generateQR(uniqId, createVisitorDto);
  
    const visitor = this.VisitorRepository.create({
      ...createVisitorDto,
      date: new Date(),
      exhibitionId: exhibition,
      qrValue: staticPath,
      exhibition: exhibitionEntity,
      uuid: uniqId,
    });
  
    const savedVisitor = await this.VisitorRepository.save(visitor);
  
    try {
      const pdfBuffer = await this.generatePdfTicket(savedVisitor.id);
      await this.mailerService.sendTicket(
        savedVisitor.email,
        Buffer.from(pdfBuffer),
        `ticket-${savedVisitor.name}.pdf`,
      );
    } catch (err) {
      this.logger.error('Не удалось отправить билет на email:', err.message);
    }
  
    return savedVisitor;
  }
  
  async findAll(query: any) {
    const { exhibition, fair, registrationDateStart, registrationDateEnd } = query;

    
    try {
      const [visitorsList, exhibitionStatistics, fairStatistics] = await Promise.all([
        this.VisitorRepository.find({
          where: {
            exhibitionId: exhibition,
            fair: fair,
            date: registrationDateStart && registrationDateEnd 
              ? Between(registrationDateStart, registrationDateEnd)
              : undefined
          },
          relations: ['exhibition'],
          order: { date: 'DESC' }
        }),
        this.VisitorRepository.createQueryBuilder('visitor')
          .select('exhibition.name', 'name')
          .addSelect('COUNT(visitor.id)', 'count')
          .innerJoin('visitor.exhibition', 'exhibition')
          .groupBy('exhibition.id')
          .getRawMany(),
        this.VisitorRepository.createQueryBuilder('visitor')
          .select('visitor.fair', 'name')
          .addSelect('COUNT(DISTINCT visitor.id)', 'count')
          .groupBy('visitor.fair')
          .getRawMany()
      ]);

      return {
        visitors: visitorsList,
        fairStatistics,
        exhibitionStatistics,
        individualCount: visitorsList.filter(visitor => visitor.executor === 'individual').length,
        companyCount: visitorsList.filter(visitor => visitor.executor === 'company').length,
        qrStats: visitorsList.filter(visitor => visitor.qr).length
      };
    } catch (error) {
      
      throw error;
    }
  }
  async exportToExcel(query: any): Promise<StreamableFile> {
    const { exhibition, fair, registrationDateStart, registrationDateEnd } = query;
    console.log(query);
    
    const where: any = {};
    if (exhibition) where.exhibitionId = +exhibition;
    if (fair) where.fair = fair;
    if (registrationDateStart && registrationDateEnd) {
      where.date = Between(new Date(registrationDateStart), new Date(registrationDateEnd));
    }
  
    const visitors = await this.VisitorRepository.find({
      where,
      relations: ['exhibition'],
      order: { date: 'DESC' },
    });

    console.log(visitors);
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Посетители');
  
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Имя', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Телефон', key: 'phone', width: 20 },
      { header: 'Тип', key: 'executor', width: 15 },
      { header: 'Ярмарка', key: 'fair', width: 15 },
      { header: 'Дата регистрации', key: 'date', width: 20 },
      { header: 'Выставка', key: 'exhibition', width: 25 },
    ];
  
    visitors.forEach(visitor => {
      worksheet.addRow({
        id: visitor.id,
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        executor: visitor.executor,
        fair: visitor.fair,
        date: visitor.date.toLocaleString(),
        exhibition: visitor.exhibition?.name ?? '',
      });
    });
    console.log('Экспортируем:', visitors.length, 'записей');

    const buffer = await workbook.xlsx.writeBuffer();
    const stream = new PassThrough();
    stream.end(buffer);
  
    return new StreamableFile(stream);
  }
  
  async changeQrValue(query){
    console.log(query);
    
    const visitor = await this.VisitorRepository.findOne({ where: { uuid: query } });

  if (visitor) {
    visitor.qr = true; 
    await this.VisitorRepository.save(visitor);
    return true;
  } else {
    return false;
  }
    
  }
  async findByQrUuid(uuid: string): Promise<Visitor | null> {
    const visitor = await this.VisitorRepository.findOneBy({uuid})
    return visitor
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldQrCodes() {
    try {
      const qrDirectory = this.configService.get<string>('QR_PATH');
      const fullPath = path.resolve(process.cwd(), qrDirectory);

      const files = await fs.readdir(fullPath);
      const now = new Date();

      for (const file of files) {
        const filePath = path.join(fullPath, file);

        const stats = await fs.stat(filePath);
        const fileAge = (now.getTime() - stats.mtime.getTime()) / 1000; // Convert to seconds

        if (fileAge > 7 * 24 * 60 * 60 * 1000) { // 1 week
          try {
            await fs.unlink(filePath);
            this.logger.log(`Successfully deleted file: ${file}`);
          } catch (error) {
            this.logger.error(`Error deleting file ${file}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error in removeOldQrCodes: ${error.message}`);
    }
    this.logger.log('Cron job finished: removeOldQrCodes');
  }

  async findOne(id: number) {
    const visitor = await this.VisitorRepository.findOneBy({id})
    
    return visitor
  }
  async downloadTicket(id: number) {
    const visitor = await this.VisitorRepository.findOneBy({ id });
  
    if (!visitor || !visitor.qrValue) {
      throw new Error('QR code not found');
    }
  
    // Убери /public — у тебя скорее всего папка 'public/qr' лежит в root проекта
    const qrRelativePath = visitor.qrValue.replace(/^\/public/, 'public');
  
    const filePath = path.resolve(process.cwd(), qrRelativePath);
  
    return filePath;
  }
  async generatePdfTicket(visitorId: number) {
    const visitor = await this.VisitorRepository.findOne({
      where: { id: visitorId },
      relations: ['exhibition'],
    });
  
    if (!visitor) throw new Error('Visitor not found');
  
    // Правильный путь до QR
    const qrPath = path.resolve(process.cwd(), visitor.qrValue.replace(/^\/public/, 'public'));
    
    // Читаем и кодируем QR как base64
    const qrBuffer = await fs.readFile(qrPath);
    const base64QR = qrBuffer.toString('base64');
    const qrImg = `data:image/png;base64,${base64QR}`;
  
    const html = getHtmlMessage(visitor, qrImg)
  
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
  
    await browser.close();
    return pdfBuffer;
  }
  

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }
}
