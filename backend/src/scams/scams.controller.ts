import { Controller, Post, Body, Get, Query, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


import { ScamsService } from './scams.service';

@Controller('scams')
export class ScamsController {
    constructor(private readonly scamsService: ScamsService) { }

    @Post('report')
    async report(@Body() data: any) {
        return this.scamsService.reportScam(data);
    }

    @Post('evidence/upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/evidence',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file: any) {
        return {
            url: `/uploads/evidence/${file.filename}`,
            type: file.mimetype.split('/')[0]
        };
    }


    @Get('nearby')
    async getNearby(@Query('lat') lat: number, @Query('lon') lon: number) {
        return this.scamsService.getNearbyScams(Number(lat), Number(lon));
    }

    @Get('admin/pending')
    async getPending() {
        return this.scamsService.getPendingReports();
    }

    @Post('verify/:id')
    async verify(@Param('id') id: string, @Body() data: { isVerified: boolean }) {
        return this.scamsService.verifyReport(id, data.isVerified);
    }

    @Post('admin/seed-scams')
    async seedScams() {
        return this.scamsService.seedScams();
    }
}

