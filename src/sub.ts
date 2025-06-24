import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const mainServer = new Server(
    {
        name: "main-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {},
        }
    }
);

const subServer = new McpServer({
    name: "sub-mcp",
    version: "1.0.0",
});

async function main() {
    mainServer.setRequestHandler(ListResourcesRequestSchema, async () => {
        return {
            resources: [
                {
                    uri: "hello://world",
                    name: "Hello World Message",
                    description: "simple greeting message",
                    mimeType: "text/plain",
                },
            ],
        }
    });

    mainServer.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        if (request.params.uri === "hello://world") {
            return {
                contents: [
                    {
                        uri: "hello://world",
                        text: "Hello World. This is my first mcp Server.",
                    }
                ],
            }
        }

        throw new Error("Resource not found");
    });

    // subServer.registerTool("add",
    //     {
    //         title: "Addition Tool",
    //         description: "Add Two Numbers",
    //         inputSchema: { a: z.number(), b: z.number() },
    //     },
    //     async ({ a, b }) => ({
    //         content: [{ type: "text", text: String(a + b) }],
    //     }),
    // );

    const transport = new StdioServerTransport();
    await mainServer.connect(transport);
}

main();