import PullRequestController from "./controller/pull-requests-controller";
import { writeFileSync } from "fs";
import { json2csv } from "json-2-csv";
import * as dotenv from 'dotenv';

dotenv.config({ path: ".env" });

interface ICommentData {
  pr_id: number;
  comment: string;
}

async function main() {
  // Escolha do repositório: microsoft/vscode (tem milhares de PRs)
  const owner = "microsoft";
  const name = "vscode";
  
  console.log(`🔍 Analisando repositório: ${owner}/${name}`);
  console.log("📡 Buscando comentários dos 50 primeiros PRs...");
  
  const controller = new PullRequestController();
  const prComments: ICommentData[] = await controller.getAllPRComments(owner, name);
  
  // Análise dos dados
  console.log("\n📊 ANÁLISE DOS DADOS:");
  analyzeData(prComments);
  
  // Gerar CSV usando a biblioteca do projeto
  console.log("\n💾 Gerando arquivo CSV...");
  await saveCSV(prComments, "pull_requests_comments.csv");
  
  console.log("✅ Processo concluído!");
}

function analyzeData(comments: ICommentData[]) {
  const totalComments = comments.length;
  const uniquePRs = new Set(comments.map(c => c.pr_id)).size;
  
  // Contagem de comentários por PR
  const commentsPerPR = comments.reduce((acc, comment) => {
    acc[comment.pr_id] = (acc[comment.pr_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const avgCommentsPerPR = totalComments / uniquePRs;
  const maxComments = Math.max(...Object.values(commentsPerPR));
  const minComments = Math.min(...Object.values(commentsPerPR));
  
  // Análise de tamanho dos comentários
  const commentLengths = comments.map(c => c.comment.length);
  const avgCommentLength = commentLengths.reduce((a, b) => a + b, 0) / commentLengths.length;
  
  console.log(`   Total de comentários: ${totalComments}`);
  console.log(`   PRs com comentários: ${uniquePRs}`);
  console.log(`   Média de comentários por PR: ${avgCommentsPerPR.toFixed(2)}`);
  console.log(`   PR com mais comentários: ${maxComments}`);
  console.log(`   PR com menos comentários: ${minComments}`);
  console.log(`   Tamanho médio dos comentários: ${avgCommentLength.toFixed(0)} caracteres`);
}

async function saveCSV(content: ICommentData[], path: string) {
  try {
    // Tratamento especial para vírgulas, aspas e quebras de linha nos comentários
    const sanitizedContent = content.map(item => ({
      pr_id: item.pr_id,
      comment: item.comment
        .replace(/,/g, '') // Remove todas as vírgulas
        .replace(/"/g, '""') // Escape aspas duplas
        .replace(/\r?\n/g, ' ') // Remove quebras de linha
        .trim()
    }));
    
    const csv = await json2csv(sanitizedContent, {
      delimiter: {
        field: ',',
        wrap: '"'
      }
    });
    
    writeFileSync(path, csv, 'utf-8');
    console.log(`   📁 Arquivo salvo: ${path}`);
  } catch (error) {
    throw new Error(`Erro ao salvar CSV: ${error.message}`);
  }
}

main().catch(console.error);
