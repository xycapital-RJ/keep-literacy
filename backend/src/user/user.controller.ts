import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** GET /users/:userId/stats — returns XP, level, streak */
  @Get(':userId/stats')
  getStats(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getStats(userId);
  }
}
