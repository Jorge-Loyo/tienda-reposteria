// Validaciones centralizadas para el sistema
import { sanitizeText, isValidEmail, isValidPhoneNumber } from './sanitizer';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export function validateUserData(data: any): ValidationResult {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Validar nombre
  if (data.name) {
    const sanitizedName = sanitizeText(data.name);
    if (sanitizedName.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    } else {
      sanitizedData.name = sanitizedName;
    }
  }

  // Validar email
  if (data.email) {
    const sanitizedEmail = sanitizeText(data.email);
    if (!isValidEmail(sanitizedEmail)) {
      errors.push('Email inválido');
    } else {
      sanitizedData.email = sanitizedEmail;
    }
  }

  // Validar teléfono
  if (data.phoneNumber) {
    const sanitizedPhone = sanitizeText(data.phoneNumber);
    if (!isValidPhoneNumber(sanitizedPhone)) {
      errors.push('Número de teléfono inválido');
    } else {
      sanitizedData.phoneNumber = sanitizedPhone;
    }
  }

  // Validar otros campos
  if (data.address) {
    sanitizedData.address = sanitizeText(data.address);
  }

  if (data.identityCard) {
    sanitizedData.identityCard = sanitizeText(data.identityCard);
  }

  if (data.instagram) {
    sanitizedData.instagram = sanitizeText(data.instagram);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}

export function validateProductData(data: any): ValidationResult {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Validar nombre del producto
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Nombre del producto es requerido');
  } else {
    const sanitizedName = sanitizeText(data.name);
    if (sanitizedName.length < 2) {
      errors.push('El nombre del producto debe tener al menos 2 caracteres');
    } else {
      sanitizedData.name = sanitizedName;
    }
  }

  // Validar precio
  if (data.priceUSD !== undefined) {
    const price = Number(data.priceUSD);
    if (isNaN(price) || price < 0) {
      errors.push('Precio inválido');
    } else {
      sanitizedData.priceUSD = price;
    }
  }

  // Validar stock
  if (data.stock !== undefined) {
    const stock = Number(data.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push('Stock inválido');
    } else {
      sanitizedData.stock = stock;
    }
  }

  // Validar categoría
  if (data.categoryId !== undefined) {
    const categoryId = Number(data.categoryId);
    if (isNaN(categoryId) || categoryId <= 0) {
      errors.push('ID de categoría inválido');
    } else {
      sanitizedData.categoryId = categoryId;
    }
  }

  // Sanitizar campos opcionales
  if (data.description) {
    sanitizedData.description = sanitizeText(data.description);
  }

  if (data.sku) {
    sanitizedData.sku = sanitizeText(data.sku);
  }

  if (data.imageUrl) {
    sanitizedData.imageUrl = sanitizeText(data.imageUrl);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}