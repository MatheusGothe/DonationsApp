export const formatOpeningHours = (
  openingDays: string[] | null | undefined,
  openingHourStart: string | null | undefined,
  openingHourEnd: string | null | undefined
): string => {
  // Se algum parâmetro for nulo, undefined ou inválido, retorna uma string vazia
  if (
    !openingDays || openingDays.length === 0 ||
    !openingHourStart || !openingHourEnd
  ) {
    return ""; // ou "Horários não informados"
  }

  // Remove "-feira" e mantém apenas os nomes dos dias
  const diasAbreviados = openingDays.map((dia) =>
    dia.replace("-feira", "").replace("feira", "")
  );

  let diasFormatado = "";

  if (diasAbreviados.length === 1) {
    diasFormatado = diasAbreviados[0];
  } else if (diasAbreviados.length === 2) {
    diasFormatado = `${diasAbreviados[0]} e ${diasAbreviados[1]}`;
  } else {
    diasFormatado =
      diasAbreviados.slice(0, -1).join(", ") +
      " e " +
      diasAbreviados[diasAbreviados.length - 1];
  }

  return `${diasFormatado} das ${openingHourStart} às ${openingHourEnd}`;
};
