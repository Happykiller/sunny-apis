//src\services\morgans\morgans.service.real.ts
import { MorgansService } from './morgans.service';
import { ServiceMorgansServiceModel } from './model/send.morgans.service.model';
import { SendMorgansServiceDto, WelcomeSendMorgansServiceDto } from './dto/send.morgans.service.dto';

export class MorgansServiceReal implements MorgansService {
  inversify: any;
  url: string;

  templates = {
    TEST: 'test.html',
    WELCOME: 'welcome.html',
  }

  constructor(inversify: any, url: string) {
    this.inversify = inversify;
    this.url = url;
  }

  async sendWelcome(dto: SendMorgansServiceDto<WelcomeSendMorgansServiceDto>): Promise<ServiceMorgansServiceModel> {
    const response: any = await this.inversify.httpService.post(this.url,
      {
        query: `mutation request($input: MailTemplateInput!) { sendMailWithTemplate(input: $input) { success message } }`,
        variables: {
          input: {
            to: dto.to,
            subject: dto.subject,
            template: this.templates.WELCOME,
            variables: dto.variables
          }
        }
      }
    );
    return response.data.sendMailWithTemplate;
  }

  async sendTest(to: string): Promise<ServiceMorgansServiceModel> {
    const response: any = await this.inversify.httpService.post(this.url,
      {
        query: `mutation request($input: MailTemplateInput!) { sendMailWithTemplate(input: $input) { success message } }`,
        variables: {
          input: {
            to,
            subject: 'test',
            template: this.templates.TEST,
            variables: {}
          }
        }
      }
    );
    return response.data.sendMailWithTemplate;
  }

}