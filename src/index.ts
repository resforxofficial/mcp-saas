import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// MCP 서버 생성
const server = new Server(
    {
        name: "hello-mcp",
        version: "1.0.1",
    },
    {
        capabilities: {
            resources: {}, // 리소스 기능 활성화

        },
    }
);

async function main() {
    // MCP 리소스 목록 설정
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return {
            resources: [
                {
                    uri: "hello://world",
                    name: "Hello World Message",
                    description: "간단한 인사 메시지",
                    mimeType: "text/plain",
                },
                {
                    uri: "time://now",
                    name: "Show Current Time",
                    description: "간단한 시간 표시",
                    mimeType: "text/plain",
                },
            ],
        };
    });

    // 리소스 내용 제공
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        if (request.params.uri === "hello://world") {
            return {
                contents: [
                    {
                        uri: "hello://world",
                        text: "Hello, World! This is my first MCP resource.",
                    },
                ],
            };
        }

        if (request.params.uri.startsWith("time://now")) {
            return {
                contents: [
                    {
                        uri: "time://now",
                        text: `Hello, Time is ${new Date().toLocaleString()}.`,
                    }
                ],
            }
        }

        throw new Error("Resource not found");
    });

    // 서버 시작
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.info('{"jsonrpc": "2.0", "method": "log", "params": { "message": "Server running..." }}');
}

main();