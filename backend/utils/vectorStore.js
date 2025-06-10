import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { v4 as uuidv4 } from "uuid";

// Load locally via @xenova/transformers (no API key required)
const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2",
});

const config = {
  postgresConnectionOptions: {
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "sadam@123",
    database: "hello",
  },
  tableName: "testlangchainjs",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
  distanceStrategy: "cosine",
};

export const getVectorStore = async () => await PGVectorStore.initialize(embeddings, config);

export const saveDocuments = async (docs) => {
  const vectorStore = await getVectorStore();
  const ids = docs.map(() => uuidv4());
  await vectorStore.addDocuments(docs, { ids });
};
