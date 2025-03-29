// import { Inject, Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigType } from '@nestjs/config';
// import jwtRefreshConfig from 'src/config/jwt-refresh.config';

// @Injectable()
// export class RefreshJwtStrategy extends PassportStrategy(
//   Strategy,
//   'refresh-jwt',
// ) {
//   constructor(
//     @Inject(jwtRefreshConfig.KEY)
//     private readonly refreshJwtConfiguration: ConfigType<
//       typeof jwtRefreshConfig
//     >,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: refreshJwtConfiguration.secret,
//     });
//   }

//   async validate(payload: any): Promise<any> {
//     return {
//       id: payload.sub,
//       email: payload.email,
//       name: payload.name,
//     };
//   }
// }
