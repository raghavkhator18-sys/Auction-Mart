export const getLotNumber = (id: string, sku?: string): string => {
  // If we already have a well-formed LOT number starting with AM-, return it
  if (sku && sku.startsWith('AM-')) {
    return sku;
  }
  
  // Use a simple deterministic hash function to generate a 6-digit number
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Ensure we get a positive 6-digit number (using modulo)
  const numericId = Math.abs(hash) % 1000000;
  return `AM-${numericId.toString().padStart(6, '0')}`;
};
