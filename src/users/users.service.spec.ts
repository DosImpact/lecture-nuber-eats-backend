import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

// 알고리즘

// 1. 가짜 모듈을 만든다.
// - DI 처리를 모킹 함수를 이용한다.
// - TypeORM의 모킹 처리 getRepositoryToken , mockRepository ( jest.fn 이용 )
// - 타 모듈 서비스의 모킹 처리 JwtService , mockJwtService  ( jest.fn 이용 )

// 2. 가짜 모듈에서 서비스를 가져온다.

// 함수로 만들어서 다른 레포처럼 작동하게끔 한다. ( 다른변수를 참조 )
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

// 가짜 T 제너릭, typeorm 레포 만들기 (알고리즘)
// Partial 타입으로 모든 타입을 optional 하게 만든다.
// Record 타입으로 object 타입의 key,value를 명시
// keyof 를 통해서 Repository 객체의 모든 key 값을 가져온다. (Repository 의 제너릭은 T로 뺀다. T는 any로 둔다. )
// 모든 key 값에 대응해서 jest.Mock 이라는 타입으로 value를 지정한다.

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  // it 테스트때 공통으로 사용할 변수들이다.
  let service: UsersService; //user Service는 진짜이다.
  let usersRepository: MockRepository<User>; // 모킹 repo
  let verificationsRepository: MockRepository<Verification>; // 모킹 repo
  let mailService: MailService; //  모킹 service
  let jwtService: JwtService; //  모킹 service

  // 테스트 하기전에 모든 it 에 대해서 , 사전 준비를 아래와 같이 한다.
  // 테스트 모듈을 만들고, 해당 모듈에서 테스트 service를 가져온다, 그리고 가짜 repo를 가져온다.
  // beforeAll(async () => { 아래 모듈을 describe 전체 테스트에 적용
  // beforeEach(async () => { 아래 모듈을 describe 각각의 테스트에 적용
  beforeEach(async () => {
    // 테스팅 모듈을 직접 만든다. nestjs 에서 제공하는 jest와 호환가능한 테스팅 모듈 제공
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();
    //  모듈에 장착된 provider들 가져오기
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // ✅ it서비스가 정의 되었는지 테스트
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 🔽 createAccount 테스트
  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };
    // ✅ 존재하는 emaill로 createAccount
    it('should fail if user exists', async () => {
      // repo에서 findOne 할때 출력값 셋팅

      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: '',
      });
      const result = await service.createAccount(createAccountArgs); // service 실행3
      // 결과 확인 - 당연하 findOne의 모킹 데이터로 존재함이 ture이고 리턴됌
      expect(result).toMatchObject({
        ok: false,
        error: 'email is already taken',
      });
    });
    // ✅ 존재하지 않는 emaill로 createAccount
    it('should create a new user', async () => {
      // 1 모킹 리턴값들 정의해주기
      usersRepository.findOne.mockResolvedValue(undefined); // user가 안만들어져서
      usersRepository.create.mockReturnValue(createAccountArgs); // 만들어진 유저
      usersRepository.save.mockResolvedValue(createAccountArgs); // 저장된 결과 만들어진 유저
      verificationsRepository.create.mockReturnValue({
        user: createAccountArgs, // verification의 user정보만 필요
      });
      verificationsRepository.save.mockResolvedValue({
        code: 'code', // 코드만 필요
      });

      const result = await service.createAccount(createAccountArgs);
      // 2 불려진 횟수를 check하고, 어떤 인저로 불려졌는지 check ( 모든 Data를 조사할 필요가 없다.)
      expect(usersRepository.create).toHaveBeenCalledTimes(1); //eg) 1번 불러지고, 다음 인자로불려짐 TEST
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true });
    });

    // ✅ DB 검색 애러
    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({ ok: false, error: "Couldn't create account" });
    });
  });

  // 🔽 Login 테스트
  describe('login', () => {
    // ✔ 같은 코드 로직임!
    // jest.fn().mockResolvedValue(true);
    // jest.fn(() => Promise.resolve(true));

    const loginArgs = {
      email: 'bs@email.com',
      password: 'bs.password',
    };
    // ✅ login 시도 , 사용자 null 반환
    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    // ✅
    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Wrong password' });
    });

    // ✅
    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      // console.log(result);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ ok: true, token: 'signed-token-baby' });
    });

    // ✅
    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: "Can't log user in." });
    });
  });

  // 🔽 findById 테스트
  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };
    // ✅
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });
    // ✅
    it('should fail if no user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'User Not Found' });
    });
  });

  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        email: 'bs@old.com',
        verified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'bs@new.com' },
      };
      const newVerification = {
        code: 'code',
      };
      const newUser = {
        verified: false,
        email: editProfileArgs.input.email,
      };

      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationsRepository.create.mockReturnValue(newVerification);
      verificationsRepository.save.mockResolvedValue(newVerification);

      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editProfileArgs.userId,
      );

      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(verificationsRepository.save).toHaveBeenCalledWith(
        newVerification,
      );

      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        newVerification.code,
      );
    });

    it('should change password', async () => {
      const editProfileArgs = {
        userId: 1,
        input: { password: 'new.password' },
      };
      usersRepository.findOne.mockResolvedValue({ password: 'old' });
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(1, { email: '12' });
      expect(result).toEqual({ ok: false, error: 'Could not update profile.' });
    });
  });
  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const mockedVerification = {
        user: {
          verified: false,
        },
        id: 1,
      };
      verificationsRepository.findOne.mockResolvedValue(mockedVerification);

      const result = await service.verifyEmail('');

      expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith({ verified: true });

      expect(verificationsRepository.delete).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.delete).toHaveBeenCalledWith(
        mockedVerification.id,
      );
      expect(result).toEqual({ ok: true });
    });

    it('should fail on verification not found', async () => {
      verificationsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.verifyEmail('');
      expect(result).toEqual({ ok: false, error: 'Verification not found.' });
    });

    it('should fail on exception', async () => {
      verificationsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.verifyEmail('');
      expect(result).toEqual({ ok: false, error: 'Could not verify email.' });
    });
  });
  // 테스트할 목록들을 todo로 나열
  // it.todo('createAccount');
  // it.todo('login');
  // it.todo('findById');
  // it.todo('editProfile');
  // it.todo('verifyEmail');
});
