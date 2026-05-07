export function signApplication(recipientName: string, body: string) {
  return `Dear ${recipientName}，\n${body.trim()}`;
}
