export const generatePassword = (): string => {
  const length: number = 10;
  const uppercaseChars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars: string = "abcdefghijklmnopqrstuvwxyz";
  const numericChars: string = "0123456789";
  const specialChars: string = "!@#$%^&*()_+~`|}{[]\\:;?><,./-=";

  let password: string = "";

  // Generar al menos un carácter de cada tipo
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(numericChars);
  password += getRandomChar(specialChars);

  // Generar los caracteres restantes
  for (let i: number = 0; i < length - 4; i++) {
    const randomIndex: number = Math.floor(
      Math.random() *
        (uppercaseChars.length +
          lowercaseChars.length +
          numericChars.length +
          specialChars.length)
    );
    const randomChar: string = getCharAtIndex(
      randomIndex,
      uppercaseChars,
      lowercaseChars,
      numericChars,
      specialChars
    );
    password += randomChar;
  }

  return password;
};

const getRandomChar = (charString: string): string => {
  const randomIndex: number = Math.floor(Math.random() * charString.length);
  return charString.charAt(randomIndex);
};

const getCharAtIndex = (index: number, ...charStrings: string[]): string => {
  let currentIndex: number = index;
  for (const charString of charStrings) {
    if (currentIndex < charString.length) {
      return charString.charAt(currentIndex);
    }
    currentIndex -= charString.length;
  }
  // Si no se encuentra un carácter válido, se devuelve un carácter vacío
  return "";
};
