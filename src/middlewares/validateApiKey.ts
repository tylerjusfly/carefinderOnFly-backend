import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyUser } from 'src/apikey.entity';
import { HashValue, MAIN_KEY } from 'src/utils/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ValidateApiKeyMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(ApiKeyUser)
    private apiKeyRepository: Repository<ApiKeyUser>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Get API Key overwrite from string | string[] to string
    const headersApiKey = req.headers['x-api-key'] as string;

    // If api key does not exist
    if (!headersApiKey) {
      return res
        .status(404)
        .json({ success: false, message: 'x-api-key is required' });
    }

    // Official Site should ByPass
    if (headersApiKey === MAIN_KEY) {
      next();
    }

    const hashedValueKey = HashValue(headersApiKey);

    const developer = await this.apiKeyRepository.findOneBy({
      apikey: hashedValueKey,
    });

    console.log(developer);

    if (!developer) {
      return res.json({ success: false, message: 'Unauthenticated api key' });
    }

    // return res.status(200).json(developer);
    next();
  }
}

// @InjectEntityManager() private postManager: EntityManager,
// const postWithEntityManager = await this.postManager
//       .createQueryBuilder(Post, "post")
//       .where("post.id= :postId", { postId: id })
//       .getOne()
