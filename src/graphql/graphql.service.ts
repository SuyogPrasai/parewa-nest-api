import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GraphqlService {

    private client: GraphQLClient;

    constructor(private configService: ConfigService) {
        this.client = new GraphQLClient(this.configService.get<string>('GRAPHQL_ENDPOINT') || '');
        console.log(process.env.GRAPHQL_ENDPOINT);
    }

    async execute<T>(query: string): Promise<T> {
        return this.client.request<T>(query);
    }
}
