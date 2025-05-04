// src\services\morgans\morgans.service.fake.ts
import { ServiceMorgansServiceModel } from "./model/send.morgans.service.model";
import { MorgansService } from "./morgans.service";

export class MorgansServiceFake implements MorgansService {
  sendWelcome(): Promise<ServiceMorgansServiceModel> {
    return Promise.resolve({
      success: true,
      message: ''
    });
  }
  sendTest(): Promise<ServiceMorgansServiceModel> {
    return Promise.resolve({
      success: true,
      message: ''
    });
  }

}