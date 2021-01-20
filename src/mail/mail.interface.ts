// 모듈 생성 인터페이스
export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
}
// 서비스 로직에서 사용하는 interface
export interface EmailVar {
  key: string;
  value: string;
}
