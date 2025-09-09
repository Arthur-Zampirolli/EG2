import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { existsSync } from "fs";
import puppeteer from "puppeteer";
import * as dotenv from 'dotenv';

dotenv.config({ path: ".env" });

interface ICommentData {
  pr_id: number;
  comment: string;
}

interface IAnalysisResults {
  totalComments: number;
  uniquePRs: number;
  avgCommentsPerPR: number;
  avgCommentLengthChars: number;
  avgCommentLengthWords: number;
  thanksCount: number;
  repositoryUrl: string;
}

async function main() {
  console.log("📊 Iniciando análise para relatório PDF...");
  
  // Verificar se o CSV existe
  const csvPath = "pull_requests_comments.csv";
  if (!existsSync(csvPath)) {
    console.error("❌ Arquivo CSV não encontrado! Execute 'yarn analyze' primeiro.");
    process.exit(1);
  }
  
  // Ler e analisar dados do CSV
  const analysisResults = await analyzeCSVData(csvPath);
  
  // Gerar HTML para o relatório
  const htmlContent = generateReportHTML(analysisResults);
  
  // Gerar PDF
  await generatePDF(htmlContent, "relatorio_analise_prs.pdf");
  
  // Limpeza final - garantir que não há arquivos temporários
  try {
    if (existsSync("temp_report.html")) {
      unlinkSync("temp_report.html");
    }
  } catch (e) {
    // Silenciosamente ignora erros de limpeza final
  }
  
  console.log("✅ Relatório PDF gerado: relatorio_analise_prs.pdf");
}

async function analyzeCSVData(csvPath: string): Promise<IAnalysisResults> {
  console.log("🔍 Analisando dados do CSV...");
  const csvContent = readFileSync(csvPath, 'utf-8');

  const lines = csvContent.split('\n').slice(1); // Remove header
  const comments: ICommentData[] = [];
  
  // Parse CSV (tratando aspas - vírgulas já foram removidas na geração)
  for (const line of lines) {
    if (line.trim() === '') continue;
    

    const splitted = line.split(',')
    const pr_id = parseInt(splitted[0]);
    const comment = splitted[1].replace(/""/g, '"'); // Unescape aspas duplas
    comments.push({ pr_id, comment });
  }
  
  // Análises
  const totalComments = comments.length;
  const uniquePRs = new Set(comments.map(c => c.pr_id)).size;
  const avgCommentsPerPR = totalComments / uniquePRs;
  
  // Análise de tamanho dos comentários
  const commentLengths = comments.map(c => c.comment.length);
  const avgCommentLengthChars = commentLengths.reduce((a, b) => a + b, 0) / commentLengths.length;
  
  const commentWords = comments.map(c => c.comment.split(/\s+/).length);
  const avgCommentLengthWords = commentWords.reduce((a, b) => a + b, 0) / commentWords.length;
  
  // Contagem de agradecimentos (inglês e português)
  const thanksPatterns = [
    /thank you/i,
    /thanks/i,
    /tks/i,
    /obrigado/i,
    /obrigada/i,
    /valeu/i,
    /obg/i,
    /vlw/i,
    /brigado/i,
    /brigada/i
  ];
  
  let thanksCount = 0;
  comments.forEach(comment => {
    for (const pattern of thanksPatterns) {
      if (pattern.test(comment.comment)) {
        thanksCount++;
        break; // Conta apenas uma vez por comentário
      }
    }
  });
  return {
    totalComments,
    uniquePRs,
    avgCommentsPerPR,
    avgCommentLengthChars,
    avgCommentLengthWords,
    thanksCount,
    repositoryUrl: "https://github.com/microsoft/vscode"
  };
}

function generateReportHTML(results: IAnalysisResults): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Análise de Pull Requests</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #0066cc;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .question {
            background-color: #f8f9fa;
            border-left: 4px solid #0066cc;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .question-title {
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 10px;
        }
        .answer {
            background-color: white;
            padding: 10px;
            border-radius: 3px;
            border: 1px solid #ddd;
        }
        .highlight {
            background-color: #e3f2fd;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Relatório de Análise de Pull Requests</h1>
        <p>Análise automatizada de comentários em repositórios GitHub</p>
        <p>Data de geração: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>

    <div class="question">
        <div class="question-title">a) Qual é o número do Grupo e os nomes dos participantes?</div>
        <div class="answer">
            <strong>Participantes:</strong> Arthur Zampirolli, Elias Lopes, Victor Albino e Victor Fernandes
        </div>
    </div>

    <div class="question">
        <div class="question-title">b) Qual foi o repositório analisado (URL do GitHub)?</div>
        <div class="answer">
            <strong>Repositório:</strong> <span class="highlight">${results.repositoryUrl}</span>
        </div>
    </div>

    <div class="question">
        <div class="question-title">c) Quantos comentários foram obtidos no total?</div>
        <div class="answer">
            <strong>Total de comentários:</strong> <span class="highlight">${results.totalComments}</span> comentários
        </div>
    </div>

    <div class="question">
        <div class="question-title">d) Qual é o número médio de comentários por pull request na amostra analisada?</div>
        <div class="answer">
            <strong>Média de comentários por PR:</strong> <span class="highlight">${results.avgCommentsPerPR.toFixed(2)}</span> comentários/PR<br>
            <small>Baseado em ${results.uniquePRs} PRs únicos analisados</small>
        </div>
    </div>

    <div class="question">
        <div class="question-title">e) Qual é o tamanho médio dos comentários na amostra? (Caracteres e palavras)</div>
        <div class="answer">
            <strong>Tamanho médio:</strong><br>
            • <span class="highlight">${results.avgCommentLengthChars.toFixed(0)}</span> caracteres por comentário<br>
            • <span class="highlight">${results.avgCommentLengthWords.toFixed(1)}</span> palavras por comentário
        </div>
    </div>

    <div class="question">
        <div class="question-title">f) Quantos comentários possuem palavras de agradecimento?</div>
        <div class="answer">
            <strong>Comentários com agradecimentos:</strong> <span class="highlight">${results.thanksCount}</span> comentários<br>
            <small>Palavras pesquisadas: "Thank you", "Thanks", "Tks", "Obrigado", "Obrigada", "Valeu", "Obg", "Vlw"</small><br>
            <strong>Percentual:</strong> ${((results.thanksCount / results.totalComments) * 100).toFixed(1)}% dos comentários
        </div>
    </div>

    <div class="footer">
        <p>Relatório gerado automaticamente pelo sistema de análise de PRs</p>
        <p>Ferramenta desenvolvida para análise de repositórios GitHub via GraphQL API</p>
    </div>
</body>
</html>
  `;
}

async function generatePDF(htmlContent: string, outputPath: string) {
  console.log("📄 Gerando PDF...");
  
  // Salvar HTML temporário
  const tempHtmlPath = "temp_report.html";
  writeFileSync(tempHtmlPath, htmlContent);
  
  // Gerar PDF com Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${process.cwd()}/${tempHtmlPath}`, {
    waitUntil: 'networkidle0'
  });
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  });
  
  await browser.close();
  
  // Remover arquivo temporário
  try {
    unlinkSync(tempHtmlPath);
    console.log("🗑️  Arquivo temporário removido");
  } catch (e) {
    console.warn("⚠️  Não foi possível remover o arquivo temporário:", tempHtmlPath);
    console.warn("Erro:", e.message);
  }
}

main().catch(console.error);
