import type {
  AnalyzeContractRequest, AnalyzeContractResponse,
  VerifyOSINTRequest, VerifyOSINTResponse,
  ChatRequest, ChatResponse,
  OCRRequest, OCRResponse,
} from '@/types/terminia'

export interface INemoClawClient {
  analyzeContract(request: AnalyzeContractRequest, authToken: string): Promise<AnalyzeContractResponse>
  verifyOSINT(request: VerifyOSINTRequest, authToken: string): Promise<VerifyOSINTResponse>
  sendChat(request: ChatRequest, authToken: string): Promise<ChatResponse>
  streamChat(request: ChatRequest, authToken: string): AsyncGenerator<string>
  extractOCR(request: OCRRequest, authToken: string): Promise<OCRResponse>
}
