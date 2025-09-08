export interface IPullRequestResponse {
    repository: {
        pullRequests: {
            nodes: IPullRequestNode[];
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
        };
    };
}
export interface IComment {
    author: { login: string } | null;
    body: string;
    createdAt: string;
}
export interface IPullRequestNode {
    number: number;
    title: string;
    comments: {
        nodes: IComment[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
    reviews: {
        nodes: IComment[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
}