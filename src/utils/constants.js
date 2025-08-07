// Application Constants
export const APP_NAME = 'HSE Tracker'
export const APP_VERSION = '1.0.0'

// API Endpoints (for future backend integration)
export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api'

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'hse_user',
  THEME: 'hse_theme',
  SETTINGS: 'hse_settings'
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'superviseur',
  TECHNICIAN: 'technicien'
}

// Incident Types
export const INCIDENT_TYPES = {
  ACCIDENT: 'accident',
  FIRE: 'incendie',
  ENVIRONMENT: 'environnement'
}

// Status Types
export const STATUS_TYPES = {
  NEW: 'nouveau',
  IN_PROGRESS: 'en_cours',
  RESOLVED: 'résolu',
  CANCELLED: 'annulé'
}

// EPI Categories
export const EPI_CATEGORIES = {
  HEAD: 'Protection tête',
  HANDS: 'Protection mains',
  FEET: 'Protection pieds',
  EYES: 'Protection yeux',
  RESPIRATORY: 'Protection respiratoire',
  BODY: 'Protection corps'
}

// Severity Levels
export const SEVERITY_LEVELS = {
  LOW: 'faible',
  MEDIUM: 'moyen',
  HIGH: 'élevé',
  CRITICAL: 'critique'
}

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  GRAY: '#6b7280'
}

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5
}
