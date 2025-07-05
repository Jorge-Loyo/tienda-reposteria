// src/lib/formatters.ts

const CURRENCY_FORMATTER_USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const CURRENCY_FORMATTER_VES = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "VES",
  minimumFractionDigits: 2,
});

export function formatCurrency(number: number, currency: "USD" | "VES" = "USD") {
  if (currency === "VES") {
    // Para el Bolívar, usamos un formato más local
    return `Bs. ${number.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return CURRENCY_FORMATTER_USD.format(number);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
