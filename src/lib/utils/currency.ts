const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    SGD: 'S$',
    AUD: 'A$',
    NZD: 'NZ$',
    INR: '₹',
    CAD: 'C$',
    BRL: 'R$',
    MXN: 'MX$',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    ZAR: 'R',
    AED: 'د.إ'
  };
  
  export function formatSalary(min?: number | null, max?: number | null, currency: string = 'USD'): string {
    if (!min && !max) return 'Salary not specified';
  
    const symbol = currencySymbols[currency] || currency;
    
    // Convert to k format if >= 1000
    const formatNumber = (num: number): string => {
      if (num >= 1000) {
        return `${Math.round(num / 1000)}k`;
      }
      return num.toString();
    };
  
    if (min && max) {
      return `${symbol}${formatNumber(min)}–${formatNumber(max)} ${currency} / year`;
    } else if (min) {
      return `${symbol}${formatNumber(min)}+ ${currency} / year`;
    } else if (max) {
      return `Up to ${symbol}${formatNumber(max)} ${currency} / year`;
    }
  
    return 'Salary not specified';
  }