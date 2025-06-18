import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLandingPageDto } from 'src/application/dto/lading-page/create-landing-page.dto';
import { UpdateLandingPageDto } from 'src/application/dto/lading-page/update-landing-page.dto';
import { LANDING_PAGE_REPOSITORY } from 'src/core/constants/constants';
import { LandingPageDocument } from 'src/core/entities/landing-page/landing-page.entity';

@Injectable()
export class LandingPageService {
  constructor(
    @InjectModel(LANDING_PAGE_REPOSITORY)
    private readonly landingPageModel: Model<LandingPageDocument>,
  ) {}

  async create(dto: CreateLandingPageDto) {
    const created = new this.landingPageModel(dto);
    return created.save();
  }

  async findAll() {
    return this.landingPageModel.find().exec();
  }

  async findOne(id: string) {
    const page = await this.landingPageModel.findById(id).exec();
    if (!page) throw new NotFoundException('Landing page no encontrada');
    return page;
  }

  async update(id: string, dto: UpdateLandingPageDto) {
    const updated = await this.landingPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Landing page no encontrada');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.landingPageModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Landing page no encontrada');
    return deleted;
  }
}
