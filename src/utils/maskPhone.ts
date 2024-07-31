export function maskPhone(number:any) {
    const cleanedNumber = number.replace(/[^\d]/g, "");

    // Aplica a formatação específica
    const formattedNumber = cleanedNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  
    return formattedNumber;
  }