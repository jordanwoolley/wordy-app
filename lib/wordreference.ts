/**
 * WordReference Scraper Utility
 * 
 * This utility helps extract vocabulary data from WordReference pages.
 * Since WordReference doesn't have an official API and scraping can be complex,
 * this provides helper functions and a bookmarklet approach.
 * 
 * BOOKMARKLET APPROACH (Recommended):
 * Create a bookmark with this JavaScript code to extract data while browsing WordReference:
 * 
 * ```javascript
 * javascript:(function(){
 *   const word = document.querySelector('.FrWrd strong')?.textContent?.trim() || '';
 *   const translations = Array.from(document.querySelectorAll('.ToWrd')).map(el => el.textContent.trim()).filter(Boolean);
 *   const examples = Array.from(document.querySelectorAll('.FrEx')).map(el => el.textContent.trim()).filter(Boolean);
 *   const gender = document.querySelector('.FrWrd .POS2')?.textContent?.match(/\b(nm|nf|nmpl|nfpl)\b/)?.[0] || '';
 *   
 *   const genderMap = { 'nm': 'le', 'nf': 'la', 'nmpl': 'les', 'nfpl': 'les' };
 *   
 *   const data = {
 *     word: word.toLowerCase(),
 *     translation: translations[0]?.toLowerCase() || '',
 *     example: examples[0] || '',
 *     gender: genderMap[gender] || ''
 *   };
 *   
 *   prompt('Copy this data to add to Wordy:', JSON.stringify(data));
 * })();
 * ```
 */

export interface WordReferenceData {
  word: string;
  translation: string;
  example?: string;
  gender?: 'le' | 'la' | 'les' | "l'";
  notes?: string;
}

/**
 * Parse WordReference data from JSON string (from bookmarklet)
 */
export function parseWordReferenceData(jsonString: string): WordReferenceData | null {
  try {
    const data = JSON.parse(jsonString);
    return {
      word: data.word?.toLowerCase()?.trim() || '',
      translation: data.translation?.toLowerCase()?.trim() || '',
      example: data.example?.trim() || undefined,
      gender: data.gender || undefined,
      notes: undefined,
    };
  } catch (error) {
    console.error('Error parsing WordReference data:', error);
    return null;
  }
}

/**
 * Validate WordReference data
 */
export function validateWordReferenceData(data: Partial<WordReferenceData>): boolean {
  return !!(data.word && data.translation);
}

/**
 * Instructions for users on how to use the scraper
 */
export const SCRAPER_INSTRUCTIONS = `
## How to Import from WordReference

### Method 1: Bookmarklet (Recommended)

1. Create a new bookmark in your browser
2. Name it "Extract to Wordy"
3. For the URL/location, paste this code:

\`\`\`
javascript:(function(){const word=document.querySelector('.FrWrd strong')?.textContent?.trim()||'';const translations=Array.from(document.querySelectorAll('.ToWrd')).map(el=>el.textContent.trim()).filter(Boolean);const examples=Array.from(document.querySelectorAll('.FrEx')).map(el=>el.textContent.trim()).filter(Boolean);const gender=document.querySelector('.FrWrd .POS2')?.textContent?.match(/\\b(nm|nf|nmpl|nfpl)\\b/)?.[0]||'';const genderMap={'nm':'le','nf':'la','nmpl':'les','nfpl':'les'};const data={word:word.toLowerCase(),translation:translations[0]?.toLowerCase()||'',example:examples[0]||'',gender:genderMap[gender]||''};prompt('Copy this data:',JSON.stringify(data));})();
\`\`\`

4. When on a WordReference page, click the bookmark
5. Copy the extracted JSON data
6. Paste it into the import field in Wordy

### Method 2: Manual Entry

Just use the "Add Word" button and enter the information manually!
`;

/**
 * Get gender from French gender abbreviation
 */
export function getGenderFromAbbreviation(abbr: string): 'le' | 'la' | 'les' | "l'" | undefined {
  const map: Record<string, 'le' | 'la' | 'les'> = {
    'nm': 'le',    // nom masculin
    'nf': 'la',    // nom féminin
    'nmpl': 'les', // nom masculin pluriel
    'nfpl': 'les', // nom féminin pluriel
  };
  return map[abbr.toLowerCase()];
}
