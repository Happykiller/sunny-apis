// src\services\morgans\dto\send.morgans.service.dto.ts
export interface WelcomeSendMorgansServiceDto {
  id: string,
  email: string,
  password: string,
  logoUrl: string,
  serviceUrl: string,
  serviceName: string,
  siguriUrl: string
}


export interface SendMorgansServiceDto<T> {
  to: string,
  subject: string,
  variables?: T
}