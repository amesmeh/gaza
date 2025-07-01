/**
 * دالة البحث الذكي - تبحث في الكلمات المفتاحية بدلاً من البحث الحرفي
 * مثال: البحث عن "عاطف مسمح" سيجد "عاطف سعيد محمد مسمح"
 * 
 * @param text النص المراد البحث فيه
 * @param searchTerm مصطلح البحث
 * @returns true إذا وجدت جميع كلمات البحث في النص
 */
export const smartSearch = (text: string, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true;
  
  const searchWords = searchTerm.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
  const textLower = text.toLowerCase();
  
  // إذا كان البحث من كلمة واحدة، ابحث عنها في النص
  if (searchWords.length === 1) {
    return textLower.includes(searchWords[0]);
  }
  
  // إذا كان البحث من عدة كلمات، تأكد من وجود جميع الكلمات في النص
  return searchWords.every(word => textLower.includes(word));
};

/**
 * دالة البحث الذكي في كائن - تبحث في عدة حقول
 * 
 * @param item الكائن المراد البحث فيه
 * @param searchTerm مصطلح البحث
 * @param searchFields الحقول المراد البحث فيها
 * @returns true إذا وجدت جميع كلمات البحث في أي من الحقول المحددة
 */
export const smartSearchInObject = <T>(
  item: T, 
  searchTerm: string, 
  searchFields: (keyof T)[]
): boolean => {
  if (!searchTerm.trim()) return true;
  
  return searchFields.some(field => {
    const value = item[field];
    if (value === null || value === undefined) return false;
    return smartSearch(String(value), searchTerm);
  });
};

/**
 * دالة البحث الذكي في مصفوفة من الكائنات
 * 
 * @param items مصفوفة الكائنات
 * @param searchTerm مصطلح البحث
 * @param searchFields الحقول المراد البحث فيها
 * @returns مصفوفة الكائنات المطابقة للبحث
 */
export const filterWithSmartSearch = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;
  
  return items.filter(item => smartSearchInObject(item, searchTerm, searchFields));
}; 