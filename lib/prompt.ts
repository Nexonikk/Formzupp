export function getFormGenPrompt({
  prompt,
  topics,
}: {
  prompt: string;
  topics?: string;
}): string {
  return `Create a customer survey form for an ecommerce website based on the following requirements:
  
Primary Prompt: ${prompt}
${topics ? `Topics to focus on: ${topics}` : ""}

The form should include:
1. A clear title
2. A brief description
3. Relevant questions covering:
   - Product quality assessment
   - Customer satisfaction
   - Packaging feedback
   - Delivery experience
   - Overall rating

Format all questions with:
- Clear content/text
- Appropriate field type (text, number, etc.)
- Required/optional indication

Return only the JSON response matching the provided schema.`;
}
