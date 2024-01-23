import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly prismaService: PrismaService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }
  @Get()
  async getAllBills() {
    return this.prismaService.bill.findMany();
  }

  @Get('id/:id')
  async getBillById(@Param('id') id: string) {
    try {
      return await this.prismaService.bill.findUnique({
        where: {
          id: parseInt(id),
        },
      });
    } catch {
      throw new NotFoundException("Nincs ilyen számla");
    }
  }

  @Get('type/:type')
  async getBillsByType(@Param('type') type: string) {
    return this.prismaService.bill.findMany({
      where: {
        type,
      },
    });
  }

  @Get('urgent')
  async getUrgentBill() {
    return this.prismaService.bill.findFirst({
      orderBy: {
        due: 'asc',
      },
    });
  }

  @Get('late')
  async getLateBills() {
    const currentDate = new Date();
    return this.prismaService.bill.findMany({
      where: {
        due: {
          lt: currentDate,
        },
      },
    });
  }
}

