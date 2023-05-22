export default interface PromptUriDataEntity {
  author?: string;
  created?: number;
  category?: string;
  title?: string;
  description?: string;
  prompt?: string; // TODO: Replace with using polybase and lit protocol
  instruction?: string;
}
