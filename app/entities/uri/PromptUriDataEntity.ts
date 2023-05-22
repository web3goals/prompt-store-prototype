export default interface PromptUriDataEntity {
  author?: string;
  created?: number;
  category?: string;
  title?: string;
  description?: string;
  prompt?: string;
  promptEncryptedString?: string;
  promptEncryptedSymmetricKey?: string;
  instruction?: string;
}
