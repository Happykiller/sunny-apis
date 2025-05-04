// src\services\morgans\morgans.service.ts
import { ServiceMorgansServiceModel } from "./model/send.morgans.service.model";
import { SendMorgansServiceDto, WelcomeSendMorgansServiceDto } from "./dto/send.morgans.service.dto";

export interface MorgansService {
  sendWelcome(dto: SendMorgansServiceDto<WelcomeSendMorgansServiceDto>): Promise<ServiceMorgansServiceModel>;
  sendTest(to: string): Promise<ServiceMorgansServiceModel>;
}
